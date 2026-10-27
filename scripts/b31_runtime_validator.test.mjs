import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
it('accepts runtime data and detects all eight reviewed mutations', () => {
  expect(() => execFileSync('python3', ['scripts/test_validate_mission_concept_map.py'], { stdio: 'pipe' })).not.toThrow();
});
