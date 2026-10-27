import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';

describe('main geometry fixture', () => {
  it('preserves all 1,128 original states and only the approved CB01 emphasis changes', () => {
    expect(() => execFileSync('node', ['scripts/qa_b31_map_geometry.mjs'], { stdio: 'pipe' })).not.toThrow();
  });
});
