#!/bin/bash

# This script searches for specified query patterns in .vtt
# files within a source directory, counts the occurrences
# of each file, and saves the sorted results to an output file.

# Usage: script.sh sourceDir query1 [query2 query3 ...]

# example usage:
# ./bin/search-caption-string.sh ./data/videos " art " "fine art" "gallery" > ./data/topics/art.txt
# notice spaces between specific key words to isolate them, rather then match fragments of other words.

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 sourceDir query1 [query2 query3 ...]"
    exit 1
fi

temp_file=$(mktemp)

sourceDir="$1"
shift 1
argsArray=("$@")

# find each element in the args array
for pattern in "${argsArray[@]}"; do
    args_string+="\"$pattern\" "
    # find all .vtts and search for the pattern in each one
    find $sourceDir -type f -name "*.vtt" -exec grep -H -n "$pattern" {} \; >> "$temp_file"
done

# process temp_file and output
# 1. `cat "$temp_file"`: reads contents of temp file
# 2. `cut -d ':' -f 1`: splits each line using `:` as a delimiter and keep the first field
# 3. `sort`: sorts the lines alpha/numerically
# 4. `uniq -c`: removes duplicate lines and add count occurrences for each unique line
# 5. `sort -r`: reverse sort
cat "$temp_file" | cut -d ':' -f 1 | sort | uniq -c | sort -r

# cleanup
rm "$temp_file"

# notes
# find ./data/videos -type f -name "*.vtt" -exec grep -H -n "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -Hl "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \; | xargs -I {} basename {}
