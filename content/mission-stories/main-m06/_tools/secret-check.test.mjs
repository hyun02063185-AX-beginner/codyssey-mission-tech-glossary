import { describe, expect, it } from 'vitest';
import secrets from './secret-check.cjs';

describe('B3-2 evidence secret check', () => {
  it('allows masked values and complete shell variable references', () => {
    for (const token of ['$CODYSSEY_API_KEY', '${CODYSSEY_API_KEY}', '••••••••', '[REDACTED]']) {
      expect(secrets.containsSecret(`Authorization: Bearer ${token}`)).toBe(false);
    }
  });
  it('still catches secret prefixes and literal or mixed bearer credentials', () => {
    for (const token of ['sk-' + 'z'.repeat(24), 'ghp_' + 'z'.repeat(24),
      'github_pat_' + 'z'.repeat(24), 'AKIA' + 'X'.repeat(16)]) {
      expect(secrets.containsSecret(token)).toBe(true);
    }
    for (const token of ['provided-1234567890', '$provided-token-example', '${VAR}provided-token-example']) {
      expect(secrets.containsSecret(`Authorization: Bearer ${token}`)).toBe(true);
    }
  });
});
