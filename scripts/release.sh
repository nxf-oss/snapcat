#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./release.sh <version>"
  exit 1
fi

export CHANGELOG_GITHUB_TOKEN="$CHANGELOG_GITHUB_TOKEN"

github_changelog_generator \
  -u nxf-oss \
  -p snapcat \
  --future-release $VERSION \
  --output ./.tmp/changelog.md

gh release create $VERSION \
  --notes-file ./.tmp/changelog.md \
  --title "Snapcat $VERSION"
