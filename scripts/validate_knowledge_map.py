#!/usr/bin/env python3
"""Validate every implemented field map, its overlays, registry, and Atlas linkage."""
import json, sys
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; REGISTRY=ROOT/'data/knowledge-maps/map-registry.json'; TAXONOMY=ROOT/'data/knowledge-maps/atlas/field-taxonomy.json'; CLASSIFICATIONS=ROOT/'data/knowledge-maps/atlas/term-field-classification.json'; MATRIX=ROOT/'data/knowledge-maps/atlas/mission-field-matrix.json'; ROUTING=ROOT/'data/knowledge-maps/atlas/mission-map-routing.json'; OPENBOOK=ROOT/'content/peer-review/main-m01-openbook.yaml'; APP=ROOT/'src/App.tsx'
RELATIONS={'is_a','based_on','defined_by','provided_by','uses','interacts_with','prerequisite','cs_foundation','evolved_from','enabled_by','compare_with','mission_uses'}; CONFIDENCE={'HIGH','MEDIUM','LOW'}; EVIDENCE={'mission-source','official-standard','official-documentation','architectural-inference'}; ROLES={'core','foundation','boundary','shared'}; ORIGINS={'field','foundation'}; MISSION_RELATIONS={'direct','required','related'}

def main():
    registry=json.loads(REGISTRY.read_text()); taxonomy=json.loads(TAXONOMY.read_text()); classifications={item['termId']:item for item in json.loads(CLASSIFICATIONS.read_text())['classifications']}; missions={item['missionId'] for item in json.loads(MATRIX.read_text())['missions']}; field_ids={item['id'] for item in taxonomy['fields']}; entries=registry['maps']; errors=[]; ids=[entry.get('mapId') for entry in entries]
    if len(ids)!=len(set(ids)): errors.append('duplicate registry mapId')
    implemented=[entry for entry in entries if entry.get('status')=='implemented']
    for entry in entries:
        if entry.get('fieldId') not in field_ids: errors.append(f"{entry.get('mapId')}: unknown fieldId")
        if entry.get('status') not in {'implemented','planned','review-required','cross-field-candidate','cross-field-layer'}: errors.append(f"{entry.get('mapId')}: invalid status")
        if entry.get('status')=='implemented' and not entry.get('dataPath'): errors.append(f"{entry.get('mapId')}: implemented map missing dataPath")
    all_counts={}
    for entry in implemented:
        graph=json.loads((ROOT/entry['dataPath']).read_text()); overlays=[json.loads((ROOT/path).read_text()) for path in entry.get('overlayPaths',[])]; nodes=graph.get('nodes',[]); edges=graph.get('edges',[]); node_ids=[node.get('id') for node in nodes]; known=set(node_ids); regions={region.get('id') for region in graph.get('regions',[])}
        if graph.get('mapId')!=entry['mapId'] or graph.get('fieldId')!=entry['fieldId']: errors.append(f"{entry['mapId']}: registry/data identity mismatch")
        if len(node_ids)!=len(known): errors.append(f"{entry['mapId']}: duplicate node id")
        for node in nodes:
            missing={'id','label','nodeOrigin','nodeRole','layer','primaryRegion','summary'}-set(node)
            if missing: errors.append(f"{entry['mapId']}/{node.get('id')}: missing fields")
            if node.get('nodeOrigin') not in ORIGINS or node.get('nodeRole') not in ROLES: errors.append(f"{entry['mapId']}/{node.get('id')}: invalid origin or role")
            if node.get('primaryRegion') not in regions: errors.append(f"{entry['mapId']}/{node.get('id')}: invalid region")
            if node.get('nodeRole')=='foundation' and not node.get('foundationRationale'): errors.append(f"{entry['mapId']}/{node.get('id')}: foundation missing rationale")
            if node.get('termId'):
                if node['id']!=f"term:{node['termId']}" or node['termId'] not in classifications: errors.append(f"{entry['mapId']}/{node.get('id')}: invalid canonical term binding")
                else:
                    item=classifications[node['termId']]
                    if entry['fieldId'] not in [item['primaryField'],*item['secondaryFields']]: errors.append(f"{entry['mapId']}/{node['termId']}: outside Atlas field context")
        route_ids=[route.get('id') for route in graph.get('learningRoutes',[])]
        if len(route_ids)!=len(set(route_ids)): errors.append(f"{entry['mapId']}: duplicate route id")
        for route in graph.get('learningRoutes',[]):
            if not route.get('label') or route.get('scope') not in {'field','mission'} or len(route.get('nodeIds',[]))<2 or any(node_id not in known for node_id in route.get('nodeIds',[])): errors.append(f"{entry['mapId']}/{route.get('id')}: invalid route")
        seen=set(); degree=Counter()
        for edge in edges:
            key=(edge.get('from'),edge.get('relation'),edge.get('to'))
            if key in seen: errors.append(f"{entry['mapId']}: duplicate edge {key}")
            seen.add(key); degree[edge.get('from')]+=1; degree[edge.get('to')]+=1
            if edge.get('from') not in known or edge.get('to') not in known or edge.get('relation') not in RELATIONS or edge.get('confidence') not in CONFIDENCE or edge.get('evidenceType') not in EVIDENCE or not str(edge.get('source','')).startswith(('http://','https://','repo:')): errors.append(f"{entry['mapId']}: invalid edge {key}")
        if any(degree[node_id]==0 for node_id in known): errors.append(f"{entry['mapId']}: orphan node")
        overlay_ids=[]
        for overlay in overlays:
            overlay_ids.append(overlay.get('overlayId')); overlay_nodes=overlay.get('nodeIds',[]); refs=overlay.get('nodeRefs',[])
            overlay_mission=overlay.get('missionId',''); course, _, mission=overlay_mission.partition('-'); matrix_mission=f"{course}/{mission.upper()}"
            if overlay.get('mapId')!=entry['mapId'] or overlay_mission not in entry.get('availableMissions',[]) or matrix_mission not in missions: errors.append(f"{entry['mapId']}: invalid overlay identity")
            if len(overlay_nodes)!=len(set(overlay_nodes)) or any(node_id not in known for node_id in overlay_nodes) or {ref.get('nodeId') for ref in refs}!=set(overlay_nodes): errors.append(f"{entry['mapId']}/{overlay.get('missionId')}: invalid overlay nodes")
            if any(route_id not in route_ids for route_id in overlay.get('routeIds',[])) or any(ref.get('termId') not in classifications or ref.get('relation') not in MISSION_RELATIONS for ref in refs): errors.append(f"{entry['mapId']}/{overlay.get('missionId')}: invalid overlay refs")
        if len(overlay_ids)!=len(set(overlay_ids)): errors.append(f"{entry['mapId']}: duplicate overlay id")
        all_counts[entry['mapId']]={'nodes':len(nodes),'edges':len(edges),'overlays':len(overlays)}
    frontend=next((entry for entry in implemented if entry['mapId']=='frontend'),None)
    if not frontend: errors.append('frontend map missing')
    else:
        m01=json.loads((ROOT/next(path for path in frontend['overlayPaths'] if path.endswith('main-m01.json'))).read_text()); quick=set(json.loads(OPENBOOK.read_text())['quick_terms'])
        if {ref['termId'] for ref in m01['nodeRefs']}!=quick: errors.append('frontend M01 Quick Term coverage mismatch')
    app=APP.read_text(encoding='utf-8')
    if '/maps/main-m01' not in app or '/maps/frontend?mission=main-m01' not in app: errors.append('legacy M01 redirect target missing')
    if errors:
        for error in errors: print(f'ERROR: {error}',file=sys.stderr)
        return 1
    layers=[entry for entry in entries if entry.get('status')=='cross-field-layer']
    expected_layers={'programming-foundations','developer-workflow-tools'}
    if {entry['mapId'] for entry in layers} != expected_layers: errors.append('cross-field layer disposition mismatch')
    if len(implemented)!=10 or any(entry.get('status')=='planned' for entry in entries): errors.append('final Atlas must have 10 implemented maps and no planned maps')
    routing=json.loads(ROUTING.read_text())['missions']; route_ids=[item.get('missionId') for item in routing]; expected_route_ids={mission.replace('/', '-').lower() for mission in missions}
    if len(route_ids)!=len(set(route_ids)) or set(route_ids)!=expected_route_ids: errors.append('mission routing coverage mismatch')
    entry_by_id={entry['mapId']:entry for entry in entries}
    for route in routing:
        primary=route.get('primaryContext',{}); cross=route.get('crossFieldLayers',[]); contexts=route.get('maps',[])
        if primary.get('fieldId') not in field_ids or primary.get('kind') not in {'field','cross-field-layer'}: errors.append(f"{route.get('missionId')}: invalid primary context")
        if primary.get('kind')=='cross-field-layer' and not any(entry['fieldId']==primary.get('fieldId') and entry['status']=='cross-field-layer' for entry in entries): errors.append(f"{route.get('missionId')}: missing primary cross-field layer")
        if len(cross)!=len(set(cross)) or any(not any(entry['fieldId']==field and entry['status']=='cross-field-layer' for entry in entries) for field in cross): errors.append(f"{route.get('missionId')}: invalid cross-field layer")
        if not contexts or any(context.get('mapId') not in entry_by_id or context.get('relation') not in {'primary','secondary','boundary'} for context in contexts): errors.append(f"{route.get('missionId')}: invalid map contexts")
        for context in contexts:
            overlay_mission=context.get('overlayMissionId'); entry=entry_by_id.get(context.get('mapId'),{})
            if overlay_mission and overlay_mission not in entry.get('availableMissions',[]): errors.append(f"{route.get('missionId')}: routing overlay missing from map")
        if route.get('coverage') not in {'FULL_PRIMARY','PARTIAL_CROSS_FIELD','RELATED_MAP_ONLY','NO_MAP'}: errors.append(f"{route.get('missionId')}: invalid coverage")
    if errors:
        for error in errors: print(f'ERROR: {error}',file=sys.stderr)
        return 1
    print(f"Knowledge maps valid: {len(implemented)} implemented / {len(entries)} registry maps · {len(layers)} cross-field layers")
    for map_id, counts in sorted(all_counts.items()): print(f"{map_id}: {counts['nodes']} nodes · {counts['edges']} edges · {counts['overlays']} overlays")
    return 0
if __name__=='__main__': raise SystemExit(main())
