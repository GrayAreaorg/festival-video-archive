#!/bin/bash

IFS=$'\n' # set the Internal Field Separator to newline, ignore the spaces
for f in $(find $1 -type f -name '*.json');
do
  ytid=`jq -r .id $f`
  ./bin/get-youtube-subs.sh $ytid $f
done
