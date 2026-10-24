// Owner-approved U3-D contract: stable role topology; content determines height.
const roleKeys = ['tile-model', 'tile-repo', 'tile-service', 'tile-cli'];
const roleNames = ['Model', 'Repository', 'Service', 'CLI'];
// Chrome resolves layout to 1/64 CSS px. Document overflow has NO tolerance.
const near = (a, b) => Math.abs(a - b) <= 1 / 64;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export async function captureRoleLayout(page, viewportWidth) {
  return page.evaluate(viewportWidth => {
    const grid = document.querySelector('#stage .grid');
    const box = element => {
      const r = element.getBoundingClientRect();
      return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height, right: r.right + scrollX, bottom: r.bottom + scrollY };
    };
    const visible = element => {
      const r = element.getBoundingClientRect(), s = getComputedStyle(element);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
    };
    const rectsOverlap = (a, b) => a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom;
    const clipped = [], outside = [], textOverlaps = [];
    const tiles = [...grid.querySelectorAll('.tile')].map(tile => {
      const bounds = box(tile), style = getComputedStyle(tile);
      const labels = [...tile.querySelectorAll('.tx > *, .bd .badge')].filter(visible).map(element => {
        const range = document.createRange(); range.selectNodeContents(element);
        const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0).map(r => ({ x: r.x + scrollX, y: r.y + scrollY, right: r.right + scrollX, bottom: r.bottom + scrollY }));
        if (element.scrollWidth > element.clientWidth + 1) clipped.push(element.textContent);
        if (rects.some(r => r.x < bounds.x || r.right > bounds.right || r.y < bounds.y || r.bottom > bounds.bottom)) outside.push(element.textContent);
        return { text: element.textContent, rects };
      });
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        if (labels[i].rects.some(a => labels[j].rects.some(b => rectsOverlap(a, b)))) textOverlaps.push([labels[i].text, labels[j].text]);
      }
      return { key: tile.dataset.key, role: tile.querySelector('.en')?.textContent.trim(), box: bounds, pressed: tile.getAttribute('aria-pressed') === 'true', selected: tile.classList.contains('sel'), borderColor: style.borderTopColor };
    });
    const s = getComputedStyle(grid), swatch = document.createElement('span');
    swatch.style.color = s.getPropertyValue('--accent').trim();
    return { viewportWidth, documentWidth: document.documentElement.scrollWidth, display: s.display, columns: s.gridTemplateColumns.trim().split(/\s+/), rows: s.gridTemplateRows.trim().split(/\s+/), columnGap: parseFloat(s.columnGap), rowGap: parseFloat(s.rowGap), grid: box(grid), accent: swatch.style.color, tiles, clipped, outside, textOverlaps };
  }, viewportWidth);
}

export function roleLayoutAssertions(snapshot, baseline = snapshot, selectedRole = null) {
  const { tiles, grid } = snapshot;
  const labels = ['four roles', '2 by 2 grid', 'role order and names', 'left/right and top/bottom order', 'aligned columns', 'aligned rows', 'horizontal gaps', 'vertical gaps', 'cards inside grid', 'no document overflow', 'no clipped text', 'no overlapping cards', 'no overlapping text', 'selection and accent', 'stable role columns across content', 'stable gaps across content'];
  if (tiles.length !== 4 || baseline.tiles.length !== 4) return labels.map(label => ({ label, ok: false }));
  const boxes = tiles.map(t => t.box), [a, b, c, d] = boxes;
  const expected = selectedRole ? [`tile-${selectedRole}`] : [];
  const noOverlap = boxes.every((r, i) => boxes.slice(i + 1).every(s => r.right <= s.x || s.right <= r.x || r.bottom <= s.y || s.bottom <= r.y));
  const values = [
    tiles.length === 4,
    snapshot.display === 'grid' && snapshot.columns.length === 2 && snapshot.rows.length === 2,
    same(tiles.map(t => t.key), roleKeys) && same(tiles.map(t => t.role), roleNames),
    a.x < b.x && c.x < d.x && a.y < c.y && b.y < d.y,
    near(a.x, c.x) && near(b.x, d.x) && near(a.width, c.width) && near(b.width, d.width),
    near(a.y, b.y) && near(a.bottom, b.bottom) && near(c.y, d.y) && near(c.bottom, d.bottom),
    snapshot.columnGap > 0 && near(b.x - a.right, snapshot.columnGap) && near(d.x - c.right, snapshot.columnGap),
    snapshot.rowGap > 0 && near(c.y - a.bottom, snapshot.rowGap) && near(d.y - b.bottom, snapshot.rowGap),
    boxes.every(r => r.x >= grid.x && r.right <= grid.right && r.y >= grid.y && r.bottom <= grid.bottom),
    snapshot.documentWidth <= snapshot.viewportWidth && boxes.every(r => r.x >= 0 && r.right <= snapshot.viewportWidth),
    snapshot.clipped.length === 0 && snapshot.outside.length === 0,
    noOverlap,
    snapshot.textOverlaps.length === 0,
    same(tiles.filter(t => t.pressed).map(t => t.key), expected) && same(tiles.filter(t => t.selected).map(t => t.key), expected) && tiles.filter(t => t.selected).every(t => t.borderColor === snapshot.accent),
    tiles.every((t, i) => t.key === baseline.tiles[i].key && near(t.box.x, baseline.tiles[i].box.x) && near(t.box.width, baseline.tiles[i].box.width)),
    near(snapshot.columnGap, baseline.columnGap) && near(snapshot.rowGap, baseline.rowGap),
  ];
  return labels.map((label, i) => ({ label, ok: values[i] }));
}
