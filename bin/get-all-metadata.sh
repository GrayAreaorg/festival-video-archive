#!/usr/bin/env bash

# Usage: ./bin/get-all-metadata.sh [OPTIONS] <destination>
# 
# Options:
#   --year YEAR         Only process specified year (e.g., --year 2025)
#   --browser BROWSER   Use cookies from browser (e.g., --browser firefox)
#
# Example:
#   ./bin/get-all-metadata.sh ./data/videos
#   ./bin/get-all-metadata.sh --year 2025 ./data/videos
#   ./bin/get-all-metadata.sh --browser firefox ./data/videos
#   ./bin/get-all-metadata.sh --year 2025 --browser firefox ./data/videos

DEST=""
FILTER_YEAR=""
BROWSER=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --year)
      FILTER_YEAR="$2"
      shift 2
      ;;
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    *)
      # Assume it's the destination if not a flag
      if [[ -z "$DEST" ]]; then
        DEST="$1"
      fi
      shift
      ;;
  esac
done

# Check if destination was provided
if [[ -z "$DEST" ]]; then
  echo "Error: destination directory required"
  echo "Usage: ./bin/get-all-metadata.sh [--year YEAR] [--browser BROWSER] <destination>"
  exit 1
fi

# Build yt-dlp options
YTDLP_OPTS="-r 50K --ignore-errors --write-info-json --skip-download --js-runtimes node --remote-components ejs:github --restrict-filenames"
if [[ -n "$BROWSER" ]]; then
  YTDLP_OPTS="$YTDLP_OPTS --cookies-from-browser $BROWSER"
  echo "Using cookies from $BROWSER"
fi

# Read playlists into arrays (compatible with older bash versions)
years=()
urls=()
while read -r year url; do
    years+=("$year")
    urls+=("$url")
done < ./bin/playlists.txt

# Process playlists
for i in "${!years[@]}"; do
  year="${years[$i]}"
  url="${urls[$i]}"
  
  # If FILTER_YEAR is set and doesn't match current year, skip
  if [[ -n "$FILTER_YEAR" && "$year" != "$FILTER_YEAR" ]]; then
    continue
  fi
  
  mkdir -p $DEST/$year
  
  # Check if metadata already exists
  existing_files=$(find "$DEST/$year" -type f -name "*.info.json" 2>/dev/null | wc -l)
  if [[ $existing_files -gt 0 ]]; then
    echo "Processing playlists $year (skipping $existing_files existing files)"
    YTDLP_OPTS="$YTDLP_OPTS --no-overwrites"
  else
    echo "Processing playlists $year"
  fi
  
  {
    yt-dlp $YTDLP_OPTS -o "$DEST/$year/%(title)s [%(id)s].%(ext)s" "$url"
  } || {
    echo "Error occurred, but continuing"
  }
done
