# B2-1 U3-A compatibility verification

- Date: 2026-10-24 (Asia/Seoul). Baseline: `5e910b625098a6820c7898e8ef78c5d49ce05955`.
- Worktree: `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`; branch `content/b2-1-story-map-foundation`, fast-forwarded from ad2b1fd to the requested baseline. Remote target was identical to baseline after fetch.
- The original main worktree reported 26 modified files. Each file was byte-equal to HEAD (LF conversion had changed checkout metadata). All 26 were verified independently, then restored by explicit path; no content edits or other work were discarded. Audit outside Git: `C:/Users/hyun0/reports/b21-u3-original-eol.json`.
- Foundation hashes canonicalize CRLF to LF only. Whitespace, bare CR, words, IDs and SVG remain protected. Snapshot comparison also canonicalizes CRLF. Approval revision and SHA-256 values are unchanged.
- `.gitattributes` scopes LF checkout policy to approved B21 manuscripts, SVG, v3 source and integrity metadata. No repository-wide normalization.
- PASS `npm.cmd run b21:validate`; PASS `npm.cmd run b21:v3-validate`.
- PASS `node scripts/check_b21_eol.mjs`: actual CLI on all 26 files in LF and CRLF, restoring original bytes in finally.
- PASS targeted Vitest: 24 tests, including real approved manuscripts/SVG with LF, CRLF, mixed endings, and rejection of whitespace/bare-CR changes.
- PASS installed Chrome Foundation browser harness: 63 assertions; PASS actual HTTP Foundation Preview.
- PASS Chrome v3 parity sample: 9 screens (01:1, 05:2, 08:6 at 1280/390/360), 115 assertions. Full parity is scheduled with U3-B.
- Protected source files and approval JSON have no Git content diff. Commit is the U3-A checkpoint; U3-B begins only after this clean checkpoint.
- macOS execution SKIP: Windows host. LF/CRLF regression exercises both text representations on Windows.
