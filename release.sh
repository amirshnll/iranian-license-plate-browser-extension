#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

find . -type f -name ".DS_Store" -delete
mkdir -p build/chrome build/firefox
rm -f build/license-plate-chrome.zip build/license-plate-firefox.zip

mkdir -p build/chrome/src build/firefox/src
cp chrome/manifest.json build/chrome/manifest.json
cp firefox/manifest.json build/firefox/manifest.json
cp -R src/. build/chrome/src/
cp -R src/. build/firefox/src/

cd build/chrome
zip -r ../license-plate-chrome.zip . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store
cd "$ROOT/build"
cd firefox
zip -r ../license-plate-firefox.zip . --exclude ".git/*" --exclude "release.sh" --exclude .DS_Store
cd "$ROOT"

find build -mindepth 1 -maxdepth 2 -type f ! -name '*.zip' -delete
find build -mindepth 1 -maxdepth 2 -type d -empty -delete

rm -rf build/chrome build/firefox
