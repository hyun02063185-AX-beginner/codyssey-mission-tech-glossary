// Public Web / Technology Atlas deep-link contract for the Chrome Open-book extension.
//
// Single source of truth for URL rules. The extension build compiles this module
// to a browser global (PublicWebLinks) via esbuild, so extension code never
// assembles URLs by hand. Only canonical ids (termId / mapId / missionId) travel
// into URLs — never user input text.
//
// Web route contract (HashRouter, deployed on GitHub Pages):
//   term detail : <base>#/terms/<termId>
//   map         : <base>#/maps/<mapId>?mission=<missionId>&term=<termId>

export const PUBLIC_WEB_BASE_URL =
  'https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/';

/** termId -> implemented maps whose canvas contains the term as a real graph node. */
export type TermMapLinks = { terms: Record<string, string[]>; missions: Record<string, string[]> };

function encodeParam(value: string): string {
  return encodeURIComponent(value);
}

export function buildTermDetailUrl(termId: string): string {
  return `${PUBLIC_WEB_BASE_URL}#/terms/${encodeParam(termId)}`;
}

export function buildTechnologyMapUrl(options: { mapId: string; termId: string; missionId?: string }): string {
  const query: string[] = [];
  if (options.missionId) query.push(`mission=${encodeParam(options.missionId)}`);
  query.push(`term=${encodeParam(options.termId)}`);
  return `${PUBLIC_WEB_BASE_URL}#/maps/${encodeParam(options.mapId)}?${query.join('&')}`;
}

/**
 * Resolution policy (section 8 of the integration plan):
 * 1. a map that exposes an overlay for the current mission, when the term is a node there
 * 2. the term's canonical home (primary field) implemented map — index keeps it first
 * 3. any other implemented map where the term exists as a real graph node
 * Returns null when the term has no map node at all, so callers can hide the map CTA.
 */
export function resolveTechnologyMap(
  termId: string,
  missionId: string | undefined,
  index: TermMapLinks
): { mapId: string; missionId?: string } | null {
  const termMaps = index.terms[termId] ?? [];
  if (termMaps.length === 0) return null;
  if (missionId) {
    const missionMaps = index.missions[missionId] ?? [];
    const preferred = missionMaps.find((mapId) => termMaps.includes(mapId));
    if (preferred) return { mapId: preferred, missionId };
  }
  return { mapId: termMaps[0] };
}
