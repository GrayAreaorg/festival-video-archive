#!/bin/bash


find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -Hl "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \; | xargs -I {} basename {}