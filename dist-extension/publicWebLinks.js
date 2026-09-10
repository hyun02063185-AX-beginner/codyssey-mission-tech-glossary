var PublicWebLinks = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/publicWebLinks.ts
  var publicWebLinks_exports = {};
  __export(publicWebLinks_exports, {
    PUBLIC_WEB_BASE_URL: () => PUBLIC_WEB_BASE_URL,
    buildTechnologyMapUrl: () => buildTechnologyMapUrl,
    buildTermDetailUrl: () => buildTermDetailUrl,
    resolveTechnologyMap: () => resolveTechnologyMap
  });
  var PUBLIC_WEB_BASE_URL = "https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/";
  function encodeParam(value) {
    return encodeURIComponent(value);
  }
  function buildTermDetailUrl(termId) {
    return `${PUBLIC_WEB_BASE_URL}#/terms/${encodeParam(termId)}`;
  }
  function buildTechnologyMapUrl(options) {
    const query = [];
    if (options.missionId) query.push(`mission=${encodeParam(options.missionId)}`);
    query.push(`term=${encodeParam(options.termId)}`);
    return `${PUBLIC_WEB_BASE_URL}#/maps/${encodeParam(options.mapId)}?${query.join("&")}`;
  }
  function resolveTechnologyMap(termId, missionId, index) {
    const termMaps = index.terms[termId] ?? [];
    if (termMaps.length === 0) return null;
    if (missionId) {
      const missionMaps = index.missions[missionId] ?? [];
      const preferred = missionMaps.find((mapId) => termMaps.includes(mapId));
      if (preferred) return { mapId: preferred, missionId };
    }
    return { mapId: termMaps[0] };
  }
  return __toCommonJS(publicWebLinks_exports);
})();
