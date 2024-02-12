#!/bin/bash

set -x

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 youtube_id dest"
  exit 1
fi

if [ -n "$2" ]; then
  yt-dlp --sub-lan=en --write-auto-sub --skip-download -o "$2" "https://www.youtube.com/watch?v=$1"
else
  yt-dlp --sub-lan=en --write-auto-sub --skip-download "https://www.youtube.com/watch?v=$1"
fi
