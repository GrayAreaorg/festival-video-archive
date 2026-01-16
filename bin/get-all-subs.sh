#!/usr/bin/env bash

# Usage: ./bin/get-all-subs.sh [--browser BROWSER] <directory>
#
# Options:
#   --browser BROWSER   Use cookies from browser (e.g., firefox, chrome, safari)
#
# Examples:
#   ./bin/get-all-subs.sh ./data/videos
#   ./bin/get-all-subs.sh --browser firefox ./data/videos

BROWSER=""
DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    *)
      DIR="$1"
      shift
      ;;
  esac
done

if [[ -z "$DIR" ]]; then
  echo "Usage: $0 [--browser BROWSER] ./data/dir"
  exit 1
fi

# Build args for get-youtube-subs.sh
SUBS_ARGS=()
if [[ -n "$BROWSER" ]]; then
  SUBS_ARGS+=(--browser "$BROWSER")
fi

IFS=$'\n' # set the Internal Field Separator to newline, ignore the spaces
for f in $(find $DIR -type f -name '*.info.json'); do
  ytid=$(jq -r .id "$f")
  echo $ytid
  dname=$(dirname "$f")
  bname=$(basename "$f")
  ff="${bname%.info.json}"
  ./bin/get-youtube-subs.sh "${SUBS_ARGS[@]}" "$ytid" "$dname/$ff"
done
