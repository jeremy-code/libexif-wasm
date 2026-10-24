#!/bin/bash
#
# Since staged publishing is not supported by Changesets, manually write
# $CHANGESETS_OUTPUT so that GitHub releases and Git tags can be pushed
# https://github.com/changesets/changesets/issues/2025

pnpm stage publish --recursive --report-summary

if [[ ! -f pnpm-publish-summary.json ]]; then
  echo "Unable to find pnpm-publish-summary.json" >&2
  exit 1
fi

# $CHANGESETS_OUTPUT is a NDJSON file of this format
# https://github.com/changesets/action/blob/615034bb14e5d240e559f941ce9769beb5e14fb0/src/run.ts#L99
jq \
  --compact-output \
  '.publishedPackages[] | {type: "git-tag", tag: "v\(.version)", packageName: .name}' \
  pnpm-publish-summary.json \
  > $CHANGESETS_OUTPUT

rm -f pnpm-publish-summary.json
