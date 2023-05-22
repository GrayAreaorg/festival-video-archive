#!/bin/bash

IFS=$'\n' # set the Internal Field Separator to newline, ignore the spaces
for f in $(find $1 -type f -name '*.json'); do
  ytid=$(jq -r .id $f)
  yt-dlp --sub-lan=en --write-auto-sub --skip-download $ytid
  # ./bin/get-youtube-subs.sh $ytid #$f
done
