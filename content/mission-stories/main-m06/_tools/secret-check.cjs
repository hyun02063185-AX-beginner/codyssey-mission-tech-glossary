const knownSecret = /\b(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{16,}|AKIA[A-Z0-9]{16})\b/;
const shellReference = /^\$(?:[A-Za-z_][A-Za-z0-9_]*|\{[A-Za-z_][A-Za-z0-9_]*\})$/;

function containsSecret(text) {
  if (knownSecret.test(text)) return true;
  return [...text.matchAll(/Bearer\s+(?![•\[])([^\s"'<]{8,})/g)]
    .some(([, credential]) => !shellReference.test(credential));
}

module.exports = { containsSecret };
