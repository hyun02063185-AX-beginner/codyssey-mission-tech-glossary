"""Codyssey Open-book Chrome Extension 배포용 ZIP 패키징.

npm run package:extension  ->  npm run build:extension && python3 scripts/package_extension.py

1) dist-extension 산출물 검증 (manifest v3, version, 필수 파일)
2) releases/codyssey-openbook-v<version>.zip 생성 — ZIP 루트에 manifest.json
3) 임시 디렉터리에 풀어 다시 검증
"""
import json
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD_DIR = ROOT / 'dist-extension'
RELEASE_DIR = ROOT / 'releases'
ZIP_PREFIX = 'codyssey-openbook'

REQUIRED_FILES = [
    'manifest.json',
    'background.js',
    'content.js',
    'sidepanel.html',
    'sidepanel.js',
    'glossary.json',
    'openbook-main-m01.json',
]


def fail(msg):
    raise SystemExit(f'[package:extension] FAIL: {msg}')


def validate_artifact(manifest):
    """ZIP 생성 전 dist-extension 산출물 검증."""
    for name in REQUIRED_FILES:
        if not (BUILD_DIR / name).is_file():
            fail(f'dist-extension/{name} 누락')
    if manifest.get('manifest_version') != 3:
        fail('manifest_version이 3이 아님')
    version = manifest.get('version')
    if not version or not isinstance(version, str):
        fail('manifest.json에 version 문자열이 없음')
    return version


def main():
    manifest_path = BUILD_DIR / 'manifest.json'
    if not manifest_path.is_file():
        fail('dist-extension/manifest.json 누락 — 먼저 npm run build:extension 실행')

    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    version = validate_artifact(manifest)
    zip_path = RELEASE_DIR / f'{ZIP_PREFIX}-v{version}.zip'

    RELEASE_DIR.mkdir(exist_ok=True)
    # ZIP 루트에 manifest.json이 오도록 상위 폴더 없이 파일만 담는다
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name in REQUIRED_FILES:
            zf.write(BUILD_DIR / name, arcname=name)

    # 생성된 ZIP을 임시 디렉터리에 풀어 검증
    with tempfile.TemporaryDirectory(prefix='codyssey-zip-check-') as tmp:
        extracted = Path(tmp)
        with zipfile.ZipFile(zip_path) as zf:
            names = set(zf.namelist())
            for name in REQUIRED_FILES:
                if name not in names:
                    fail(f'ZIP에 {name} 누락 — 생성된 ZIP 검증 실패')
            zf.extractall(extracted)
        # ZIP 루트에 manifest.json이 직접 있어야 한다 (중첩 폴더 금지)
        if not (extracted / 'manifest.json').is_file():
            fail('ZIP 루트에 manifest.json이 없음 — 중첩 폴더 구조 오류')
        unzipped_manifest = json.loads((extracted / 'manifest.json').read_text(encoding='utf-8'))
        if unzipped_manifest.get('version') != version:
            fail(f'ZIP 내부 version 불일치: {unzipped_manifest.get("version")} != {version}')

    print(f'[package:extension] PASS: {zip_path}')
    print(f'[package:extension] version={version}, files={len(REQUIRED_FILES)}, '
          f'zip root: manifest.json OK')
    return 0


if __name__ == '__main__':
    main()
