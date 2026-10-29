# npm 의존성 보안 진단 — Phase 1 (2026-10-29)

## A. Executive Summary

**권장 결론: 통제된 업데이트 계획 권장. 상태: `READY_FOR_SECURITY_REVIEW`.** 전체 감사의 5건은 개발 의존성 패키지 5개의 집계이며, 중복을 제거하면 보안 권고문은 **10개**다. Critical 패키지 2개는 `tinypool`과 이를 사용하는 `vitest`로, 독립된 Critical 제품 결함 2개가 각각 발견됐다는 뜻이 아니다. 실제 Critical 권고문 2개는 모두 Tinypool에 있다.

1. **어디에 있는가?** Vite의 개발 서버 기능, PostCSS가 사용하는 source-map-js, Vitest의 mocker와 worker pool에 있다. React나 Playwright 자체는 이번 감사의 취약 패키지로 보고되지 않았다.
2. **공개 사이트 방문자는 위험한가?** 이번 10개 권고문에 관한 직접 노출은 **낮음**으로 판단한다. Pages는 `dist` 정적 파일을 배포하며, 현재 애플리케이션의 실제 번들 모듈 목록에 이 5개 패키지가 없었다. 방문자의 브라우저에서 Node worker나 Vite 개발 서버가 실행되지 않는다. 이는 사이트 전체가 안전하다는 인증은 아니다.
3. **개발 PC·Actions는?** 개발 PC는 Vite의 파일 열기 기능이 관련돼 **중간**, 신뢰된 main만 빌드하는 현재 Actions는 **낮음**이다. 개발 의존성도 CI에 설치되며 Vite·PostCSS는 빌드에서 실행된다. 외부 CSS/source map이나 신뢰하지 않는 코드가 들어오면 다시 평가해야 한다.
4. **지금 업데이트해야 하나?** 현재 사용에서 실제 악용을 확인한 P0는 없다. 다만 Windows 개발 환경과 관련된 Vite 문제는 **P1 별도 수정 작업을 우선 승인**할 것을 권고한다. 이 분석에서 패키지를 자동 변경하거나 배포하지 않았다.
5. **안전한 순서?** Vite 6.4.4 패치 → source-map-js 1.2.2 간접 의존성 패치 → 별도 호환성 검토를 거친 Vitest 상위 Major 후보 순서다. 각 단계에서 감사·빌드·기존 회귀 계약을 재확인한다. 수량을 줄이기 위한 강제 업데이트나 테스트 조건 완화는 권고하지 않는다.

## 기준·수집 방법

| 항목 | 값 |
|---|---|
| 기준 main | `3f5fb445d222a9be5d3fb1f526c8c7de163b34f8` (사전 fetch 결과 일치, 작업 트리 깨끗함) |
| 브랜치 | `security/npm-dependency-risk-assessment` |
| 환경 | Windows / PowerShell, Node 24.16.0, npm 11.13.0, Python 3.14.6 |
| 전체 감사 | 2026-10-29 **10:17:38–10:17:40 KST**, 종료 코드 **1** |
| Production 감사 | 같은 날 **10:17:38–10:17:39 KST**, 종료 코드 **0** |
| lockfile | v3; 기록된 해석 버전을 사용, 기존 node_modules 경로도 `npm ls`로 대조 |

```powershell
$env:PYTHONUTF8 = "1"
npm audit --package-lock-only --include=dev --json |
  Set-Content (Join-Path $env:TEMP "codyssey-npm-audit-full.json") -Encoding utf8
# 실제 npm 종료 코드: 1 (유효한 취약점 결과)
npm audit --package-lock-only --omit=dev --json |
  Set-Content (Join-Path $env:TEMP "codyssey-npm-audit-production.json") -Encoding utf8
# 실제 npm 종료 코드: 0
npm ls vite vitest @vitest/mocker tinypool source-map-js postcss --all --json
```

두 JSON 모두 정상 파싱됐고 registry 오류·lockfile 오류는 없었다. 전체 감사의 종료 코드 1은 명령/네트워크 실행 실패가 아니라 취약점 검출이다. Batch D의 과거 집계(2 Critical/2 High/1 Moderate)와 수량은 같으며 package/lockfile도 Batch D 기준 이후 바뀌지 않았다. 당시에는 개별 advisory 원본을 보존하지 않았으므로 과거 권고문 목록까지 같았다고 단정하지 않는다. 본 결과는 위 시각의 registry/Advisory DB 기준이며 향후 DB 갱신으로 수량이 바뀔 수 있다.

## B. 설치 패키지와 고유 권고문

### 감사의 패키지별 집계 및 의존성 경로

| 패키지 / lock 버전 | 감사 심각도 | 직접/간접·경로 | 실제 역할·판정·우선순위 |
|---|---|---|---|
| `vite@6.4.3` | High | 직접 devDependency `^6.0.0`; plugin-react·Vitest·vite-node도 같은 버전 참조 | 개발 서버·빌드. Windows 개발 **중간/P1**, 현재 Pages·CI **낮음** |
| `source-map-js@1.2.1` | High | `vite@6.4.3 → postcss@8.5.28 → source-map-js@1.2.1` | CSS/source map 처리. 현재 신뢰된 입력에서는 **낮음/P2** |
| `tinypool@1.1.1` | Critical | `vitest@3.2.7 → tinypool@1.1.1` (`^1.1.1`) | Node 테스트 worker. 선행 prototype pollution이 필요한 조건부 RCE; 현재 **낮음/P2** |
| `@vitest/mocker@3.2.7` | Moderate | `vitest@3.2.7 → @vitest/mocker@3.2.7` (정확 버전) | mock 처리. 공격 대상 서버 플러그인 설정은 발견되지 않음; 현재 **낮음/P2** |
| `vitest@3.2.7` | Critical | 직접 devDependency `^3.0.0` | 위 Tinypool·mocker 취약점이 전파된 상위 패키지. 별도의 독립 Critical 권고문이 아님; 현재 **낮음/P2** |

5개 모두 lockfile에 `dev:true`다. `launch-editor`는 독립 lockfile 항목이 아니라 Vite의 Node 배포 코드에 포함돼 있다. 실제 `node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js`에서 편집기 middleware·Windows 인자 처리·`/__open-in-editor` 등록을 확인했다. 따라서 lockfile에서 `launch-editor`를 찾지 못했다고 이 문제를 제외하지 않았다.

### 고유 권고문 10개

아래의 심각도는 **권고문 자체**의 평가이며 프로젝트 위험도와 구별한다. C/I/A는 각각 정보 유출/변조/가용성 영향이다. RCE의 C/I/A는 실행 계정 권한에 따른 잠재 영향이며 프로젝트에서 공격을 재현했다는 뜻이 아니다. 표의 GHSA 링크는 공식 GitHub Reviewed Advisory이며 CVE·영향 범위·수정 버전도 함께 대조했다.

| GHSA / CVE | 설치 대상·권고 심각도 | 문제·필요 조건 / 잠재 영향 | 공식 수정 버전·현재 프로젝트 판단 |
|---|---|---|---|
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) / CVE-2026-112942 | Vite 6.4.3 (bundled launch-editor), **High** | Windows 파일 존재 검사 우회. 파일 인자를 제어하고 아래 `%` 문제 등과 조합하면 명령 실행에 이를 수 있음. 기존의 악성 파일 배치 전제를 약화함; C/I/A | Vite **6.4.4**, 직접 launch-editor 사용자는 2.14.2. Windows 개발 endpoint가 관련되므로 **중간/P1**; 실제 편집기·공격 경로 완성은 미확인 |
| [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) / CVE-2026-112943 | Vite 6.4.3, **Moderate** | Windows cmd 인자의 `%` 처리 부족. 원 권고는 악성 파일명과 환경 변수/NTFS ADS 조건을 요구하며, 위 우회와 함께 평가해야 함; 명령 실행 C/I/A | Vite **6.4.4** / launch-editor 2.14.2. 현재 Windows 사용과 관련돼 **중간/P1** |
| [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) / CVE-2026-112944 | Vite 6.4.3, **Moderate** | 파일명이 특정 편집기의 CLI 옵션으로 해석됨. 악성 `+`/`-` 파일·특정 편집기 등이 필요하며 **Vite 사용자는 WSL 조건**도 요구됨; C/I/A | Vite **6.4.4** / launch-editor 2.14.2. 현재 Windows PowerShell에서는 WSL 사용을 확인하지 못해 **낮음/P2** |
| [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) / CVE-2026-112945 | Vite 6.4.3, **Low** | custom middleware가 원 요청 URL을 `transformIndexHtml`에 그대로 넘기고 inline module을 변환할 때 다른 origin 스크립트 실행. 민감한 개발 origin의 C/I | Vite **6.4.4**. 현재 기본 SPA와 B2-1 SSR loader에서 해당 HTTP URL 전달 경로가 발견되지 않아 **낮음/P2** |
| [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) / CVE-2026-112946 | Vite 6.4.3, **Moderate** | non-Windows dev server 노출 + 프로젝트 import URL과 호스트 절대 경로 충돌 + fs.deny 비차단 조건에서 allow 범위 밖 파일 제공; C | Vite **6.4.4**. 현재 Windows 로컬에는 OS 조건 불일치. Linux CI에서는 HTTP listener가 없어 현재 **낮음/P2** |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) / CVE-2026-93749 | source-map-js 1.2.1, **High** | 공격자가 큰 section offset을 넣은 indexed source map을 파서에 전달하면 동기 이벤트 루프 차단; A | **1.2.2**. 빌드·개발 CSS 처리에 사용되지만 현재 외부 source map 입력 경로를 찾지 못해 **낮음/P2** |
| [GHSA-5gmw-xhrv-c9v3](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3) / CVE-2026-104848 | Tinypool 1.1.1 → Vitest, **Critical** | 선행 prototype pollution으로 worker 옵션의 `execArgv`/`env`를 주입하면 호스트 권한으로 코드 실행; C/I/A | 이 권고만의 수정은 **2.1.1**. 현재 기본 Vitest forks 경로는 env·execArgv를 자체 속성으로 지정하고 있고, 선행 오염 경로는 확인하지 못함. **낮음/P2**; 다른 pool까지 안전하다는 의미는 아님 |
| [GHSA-85c8-ppgw-ccpr](https://github.com/advisories/GHSA-85c8-ppgw-ccpr) / CVE-2026-104849 | Tinypool 1.1.1 → Vitest, **Critical** | 선행 `Object.prototype.filename` 오염 + `pool.run(task, options)`의 자체 filename 없는 옵션 객체 조건에서 악성 worker 모듈 로드; C/I/A | **2.1.2**. Vitest의 해당 호출 형태는 있으나 공격자가 같은 프로세스를 오염시키고 모듈을 공급할 경로를 확인하지 못함. **낮음/P2**. 2.1.1만으로 두 권고를 모두 해결하지 못함 |
| [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) / CVE-2026-84373 | mocker 3.2.7 및 Vitest 3.2.7, **Moderate** | standalone mocker/interceptor 플러그인의 WebSocket 등록과 redirect mock 경로 검증 누락으로 로컬 파일 읽기; C. 자체 Vitest browser RPC는 토큰 경계가 있어 무인증 경로와 구별 | **4.1.11** (5.x 범위의 첫 수정은 5.0.0-rc.2; 안정 후보는 아래 참조). 현재 Node `vitest run`이고 해당 플러그인·browser 모드 설정 없음: **낮음/P2** |
| [GHSA-qxg6-89mg-rqv8](https://github.com/advisories/GHSA-qxg6-89mg-rqv8) / CVE-2026-112949 | mocker 3.2.7, **Moderate** | standalone interceptor의 접근 가능한 WebSocket에서 manual mock URL이 코드로 삽입되어 개발 브라우저 origin에서 실행; C/I | **4.1.12 또는 5.0.3**. 위 redirect 수정만으로 해결되지 않음. 현재 해당 서버 플러그인 미사용: **낮음/P2** |

범위 중복을 포함한 `via` 객체는 11개다. `GHSA-82fw-gwwq-j7x9`가 mocker와 Vitest에 각각 나타나므로 이를 한 번만 세면 10개다. 고유 권고문 기준 심각도는 Critical 2 / High 2 / Moderate 5 / Low 1이며, 아래 패키지 집계와 혼합하지 않는다. Tinypool 권고문의 CVSS 숫자가 감사 JSON에서 0/미제공이어도 공식 Critical 심각도를 임의로 낮추지 않았다.

## C. 전체 / Production 및 실행 환경별 노출

| 패키지 집계 | 전체 (`--include=dev`) | Production (`--omit=dev`) |
|---|---:|---:|
| Critical | 2 | 0 |
| High | 2 | 0 |
| Moderate | 1 | 0 |
| Low / Info | 0 / 0 | 0 / 0 |
| 합계 | **5** | **0** |

production 0은 dev 의존성을 제외한 **잠금 트리의 알려진 권고문 결과**다. Vite 등 CI 실행 코드를 제거했다거나 모든 공격이 없다는 뜻은 아니다.

### 공개 정적 사이트 — 낮음

`.github/workflows/deploy-pages.yml`은 Node 22에서 설치·빌드한 뒤 **dist만** Pages artifact로 올린다. Node 개발 서버나 node_modules를 공개 서비스로 실행하지 않는다. 이는 [Vite의 정적 배포 모델](https://vite.dev/guide/static-deploy.html)과 일치한다.

단순 문자열 검색 대신 기존 애플리케이션 Vite 설정을 읽은 **메모리 전용 빌드의 Rollup `output.modules`**를 수집했다. `build.write=false`, `emptyOutDir=false`, `copyPublicDir=false`와 TEMP cache를 사용했고, 프로젝트 설정 파일이나 dist를 쓰지 않았다. 63개 JS chunk, 588개 모듈 중 위 5개 패키지의 모듈은 각각 **0개**였다. Vite 내부 bundled launch-editor도 Node 도구 쪽에 있으며 이 공개 JS 그래프에 없다. 결과는 TEMP JSON에 보존했다.

따라서 이 권고문들의 개발 서버/worker 기능이 방문만으로 직접 실행되는 경로는 확인되지 않았다. 다만 개발/빌드 호스트가 먼저 침해되면 변조된 정적 파일이 배포될 수 있으므로 개발 도구 문제를 방문자와 무관하다고 폐기하지 않는다. 이 분석은 현재 소스의 생성 그래프이며 공개 서버 침투 검사나 배포 바이트 전수 대조가 아니다.

### GitHub Actions 설치·빌드 — 낮음, 조건 변경 시 재평가

- workflow는 `push: main` 및 수동 실행이며 신뢰하지 않는 PR head를 자동 빌드하는 구성은 아니다. Node 22, `npm ci`, `npm run build`를 실행한다. Vitest/Playwright 전체 테스트는 이 배포 workflow에서 실행하지 않는다.
- dev 의존성도 설치되지만 이번 5개 패키지 자체에는 lockfile의 `hasInstallScript` 표시가 없다. 설치 hook 표시는 esbuild/fsevents에 있었고 이번 10개 권고문 대상은 아니다. npm 설치가 일반적으로 무위험하다는 뜻은 아니다.
- Vite·PostCSS와 source-map-js는 build-time 실행 대상이다. PostCSS `lib/previous-map.js`에서 `SourceMapConsumer` 호출과 inline/로컬 이전 map 입력 처리를 확인했다. source-map 출력 옵션이 꺼져 있다는 이유만으로 **입력** map 파싱까지 없다고 판단하지 않았다. 현재 추적 CSS의 `sourceMappingURL`과 추적 `.map` 파일은 발견되지 않았다. 현재 신뢰된 main 소스와 잠긴 의존성만 처리하므로 위험은 제한적이나 악성 source map 도입 시 CPU/빌드 가용성 문제가 가능하다.
- `npm run build`의 `b21:validate`는 `scripts/b21_story_integrity.mjs`에서 `createServer({middlewareMode:true, hmr:false, ws:false, appType:'custom'})`를 만들어 로컬 원고를 SSR로 읽는다. **listen하지 않으며 원 HTTP URL을 `transformIndexHtml`에 넘기지 않는다.** 단순히 custom 모드가 있다는 이유로 개발 서버 XSS 조건을 충족한다고 보지 않았다.

### Windows 로컬 개발 — Vite 중간, 나머지 현재 낮음

`npm run dev`는 Vite 기본 바인딩을 사용한다. Playwright 서버는 `--host 127.0.0.1`, B2-1 preview도 loopback·`open:false`다. 현재 설정에서 LAN/인터넷 바인딩은 발견되지 않았다. loopback이 모든 로컬 악성 프로그램/브라우저 경로를 차단한다는 뜻은 아니다.

Vite 개발 서버는 `__open-in-editor` middleware를 등록한다. 자동 브라우저 열기인 `server.open:false`는 이 middleware를 제거하는 설정이 아니다. Windows 관련 경로가 존재하므로 P1로 두되, 실제 지정 편집기·WSL 여부·다른 로컬 프로세스·외부 노출·공격자의 입력 제어를 전수 조사하지 않았고 RCE를 재현하지 않았으므로 프로젝트 위험을 '높음'으로 확정하지 않았다.

설정상 완화 후보는 loopback 유지, 네트워크/터널 노출 금지, 패치 전 불필요한 개발 서버 종료, 편집기 열기 요청을 필요한 신뢰 경로로 제한하는 것이다. 편집기 endpoint를 비활성화하는 별도 middleware 변경은 후속 검토 대상이며 이번에 구현하지 않았다. fs allowlist만 바꾸면 편집기 주입까지 해결된다고 주장하지 않는다.

### 테스트 — Tinypool 조건부 위험과 mocker 경계

`npm test`는 Node `vitest run`이다. Vite 설정의 test 항목은 제외 경로뿐이고, 저장소 코드에서 `mockerPlugin()`/`interceptorPlugin()` 직접 사용이나 Vitest browser/API 서버 설정을 찾지 못했다. 별도 Playwright의 실제 브라우저 실행을 Vitest browser mode와 혼동하지 않았다. Playwright 1.63.0 자체에 대해서는 이번 감사가 취약점을 보고하지 않았다.

설치된 Vitest `coverage.DfSpMS-b.js`의 기본 forks 경로는 Tinypool을 생성하고 `pool.run(data,{name,channel})`로 실행한다. Tinypool `dist/index.js`의 prototype 조회 형태도 확인했다. 첫 번째 권고의 env·execArgv는 관찰한 호출에서 자체 속성으로 설정돼 있으나, 두 번째 권고의 filename 상속 경로는 옵션 형태상 여전히 검토 대상이다. **같은 프로세스에 선행 prototype pollution을 만들 외부 입력 경로는 확인되지 않았다.** 현재 신뢰된 테스트/원고 처리 기준 낮음으로 분류하되, 신뢰하지 않는 테스트 실행은 그 자체로 임의 코드 실행을 허용하므로 비밀정보와 권한을 분리해야 한다. prototype pollution이나 명령 주입 payload는 실행하지 않았다.

## D. 수정 대안 — 조사만 수행

공식 권고문과 npm registry의 정확한 버전 메타데이터를 읽었다. 아래는 **후속 승인 브랜치의 후보**이며 설치·해결·호환성 검증을 완료한 버전이라는 뜻은 아니다.

| 순서·우선순위 | 권장 후보·예상 파일 | 호환성·회귀 영향 및 대안 |
|---|---|---|
| **1 / P1** Vite | **6.4.3 → 6.4.4**. 필수 lock 변경, 최소 버전 명시 시 package.json도 변경 | 같은 Major의 패치로 위 Vite 권고문 5개를 대상으로 함. 현재 `^6.0.0` 범위와 plugin-react 4.7.0의 Vite 6 peer 범위 내다. 개발 서버·SSR 원고 로더·JS/CSS 출력·공개 Hash 경로를 재검증. 직접 launch-editor를 추가하는 방식은 Vite 내부 사본을 고치지 못함. [버전 메타데이터](https://registry.npmjs.org/vite/6.4.4) |
| **2 / P2** source-map-js | **1.2.1 → 1.2.2**. 현재 PostCSS의 `^1.2.1` 안에서 간접 해석을 갱신하는 lock 변경 후보 | 별도 직접 dependency 추가나 PostCSS Major 변경이 필수는 아님. 실제 해석 결과·중복 사본을 확인해야 함. CSS/이전 source map·빌드 무결성·SVG/테마/대비를 회귀검사. 외부 CSS/map 입력을 신뢰하지 않는 경우 우선순위를 높임. [버전 메타데이터](https://registry.npmjs.org/source-map-js/1.2.2) |
| **3 / P2** Vitest·mocker·Tinypool | **Vitest 4.1.12**를 최소 호환성 검토 후보로 두고 **5.0.5**와 비교. package.json·lock 변경 필요 | 3→4 또는 3→5 Major 변경이다. 4.1.12의 mocker는 4.1.12이며 manual/redirect 문제를 함께 피하는 후보다. v4는 Tinypool을 제거한 새 pool을 사용하므로 기존 1.1.1 직접 경로를 없애는 대안이다. 최종 lock에서 잔여 취약 사본이 없는지 반드시 재감사. Node 22/현재 로컬 24 및 Vite 6와 명시 범위가 맞지만 실제 테스트 호환성은 미검증. [4.1.12 메타데이터](https://registry.npmjs.org/vitest/4.1.12), [공식 v4 마이그레이션](https://v4.vitest.dev/guide/migration.html) |
| 대안·주의 | 감사 자동 제안은 **Vitest 5.0.5** (SemVer Major) | 최신 Major를 자동 적용하지 않음. Node 최소 22.12.0, Vite 최소 6.4.0 및 mock 상태 초기화 등 추가 변경을 확인해야 한다. CI의 `node-version:22`가 실행 시 어떤 patch를 쓰는지 확인. [5.0.5 메타데이터](https://registry.npmjs.org/vitest/5.0.5), [공식 v5 마이그레이션](https://vitest.dev/guide/migration/) |

Vitest 4는 worker pool·mock 동작·보고서·기본 제외 범위·module runner가 바뀐다. 현재 `maxWorkers`는 이미 사용하지만 513개 테스트의 실행 수·격리·타임아웃 동작과 기존 불변 해시 검사를 보존해야 한다. v4 문서는 현재 구버전 문서이므로 4.1.12는 최소 변경 비교 후보이지 장기 유지보수 버전의 확정 결정은 아니다. 5.0.5와 유지보수 정책을 함께 검토한다.

Tinypool만 강제로 **1.x → 2.1.2** override하는 것은 상위 Vitest 요구 범위를 벗어나므로 우선 권고하지 않는다. 두 Tinypool 권고를 모두 피하려면 2.1.2 이상 또는 해당 의존성을 제거하는 상위 업데이트가 필요하다. `@vitest/mocker`만 3.x → 4/5.x로 강제 override하는 것도 Vitest의 정확 버전 연결을 깨므로 피한다. 4.1.11로 멈추면 manual mock 권고가 남는다. browser/mocker 플러그인을 쓰지 않는 현재 운영 유지와 신뢰된 테스트만 실행하는 것은 완화책이지 설치된 취약 버전을 수정한 것은 아니다.

**후속 검증 순서:** 각 승인 변경을 분리 → 전체/production 감사 및 설치 트리 비교 → 단위 513개·TypeScript/Vite·B2-1 산출물 검사 → 관련 Playwright → 최종 443개 이름·계약 보존 확인 → 변경 범위·생성 데이터·원본 해시 확인 → GPT/Owner 검토. 기존 fixture·기대 해시·대비·테스트 수를 업데이트 편의를 위해 바꾸지 않는다. 이 Phase에서는 전체 단위/Playwright를 다시 실행하지 않았으며 Batch D의 PASS를 보안 수정 검증으로 재사용하지 않았다.

## E. 증거·한계·권장 결론

원시 결과는 TEMP에 보존했다. 보고서만 커밋하며 패키지·lock·제품·배포 설정·Canonical·443개 기존 테스트 변경은 없다. 감사 후에도 package/lock의 원본 해시와 Git diff가 일치함을 확인했다. 패키지 설치·업데이트·audit 자동 수정 명령은 실행하지 않았다.

| 파일 | SHA256 |
|---|---|
| `package.json` (작업 트리 원본) | `12ac759ce95aac2751199965f467f3414c2eb6ce611efd514a11c43e495f97d8` |
| `package-lock.json` (작업 트리 원본) | `df2443dac28994cd016f5c033546c4faa8080cf77f519cd7e130ca5f6451eaeb` |
| `%TEMP%/codyssey-npm-audit-full.json` | `39fbadb0e6cc85cc2839a966611dd3db9436cc322a1b532f05b3fa6bc48dc576` |
| `%TEMP%/codyssey-npm-audit-production.json` | `664eeb08e0f599d58fd2b7d0777d0510e463d131c99898494621f3c6cabe80c4` |
| `%TEMP%/codyssey-npm-advisories.json` | `1e4a12f9e6389658f94fc67d1f930ff3c2feeeb6389d8144fc8d577df79fe996` |
| `%TEMP%/codyssey-npm-dependency-paths.json` | `ee04b882af0421cfbb57372ca657fd77004f75d7e3dcf263f96681d4fbbc49ee` |
| `%TEMP%/codyssey-npm-fix-metadata.json` | `bd9469714beeb0a63e2a6ebc6105afbdc023e28d4623bf4dcf2e19229289b42f` |
| `%TEMP%/codyssey-security-bundle-inventory.json` | `d2cd796870422b762b6ec65970025c94d4929981af9b12b42335d3cb3bacc18d` |

정적 분석·기존 설정·설치 코드·공식 권고문을 근거로 평가했다. 공격 payload 실행, 개발 PC의 모든 환경/프로세스·실제 편집기 조사, 전체 공급망 감사, 모든 패키지의 미공개 결함 탐지는 수행하지 않았다. 실행 중 외부 터널·WSL·Vitest browser 모드를 도입하거나 신뢰하지 않는 source map/테스트를 처리한다면 위험도를 재평가한다.

**통제된 업데이트 계획 권장:** P0 긴급 공개 사이트 차단을 요구할 증거는 없지만, Windows 개발 Vite 문제는 P1로 별도 조치를 준비한다. 먼저 영향이 작은 Vite·source-map 패치를 검토하고 Vitest Major 변경은 분리한다. Owner가 이 평가와 후속 변경 범위를 승인한 뒤에만 수정한다. 현재 상태는 `READY_FOR_SECURITY_REVIEW`이며 main 병합·배포는 실행하지 않았다.
