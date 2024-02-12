#!/bin/bash

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 ./data/dir"
  exit 1
fi

IFS=$'\n' # set the Internal Field Separator to newline, ignore the spaces
for f in $(find $1 -type f -name '*.json'); do
  ytid=$(jq -r .id $f)
  echo $ytid
  dname=$(dirname $f)
  bname=$(basename $f)
  ff="${bname%.info.json}"
  ./bin/get-youtube-subs.sh "$ytid" "$dname/$ff"
done
