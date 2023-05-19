#!/bin/bash

# This version of the script uses indexed arrays `files` and `file_ids`
# to store file names and their corresponding file IDs. It assigns a unique
# ID to each file and counts the words in each caption file
# The output in `wordcount.txt` includes the file IDs with the word count
# The output in `wordcount_ids.txt` includes the file IDs

generate_id() {
    echo "$1" | md5 -r | cut -c 1-7
}

files=()
file_ids=()
temp_dir=$(mktemp -d)
temp_files_list=$(mktemp)

find ./data/videos -name "*.vtt" -print0 > "$temp_files_list"

index=0
while IFS= read -r -d '' file; do
    file_id=$(generate_id "$file")
    files+=("$file")
    file_ids+=("$file_id")

    cat "$file" | \
    sed '/[0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}\.[0-9]\{3\}/d' | \
    tr '[:upper:]' '[:lower:]' | \
    tr -s '[:punct:][:space:]' '\n' | \
    sort | \
    uniq -c | while read -r count word; do
        echo "$count $index" >> "${temp_dir}/${word}"
    done

    index=$((index + 1))
done < "$temp_files_list"

rm -f wordcount.txt
for word_file in "${temp_dir}"/*; do
    word=$(basename "$word_file")
    total_count=0
    file_list=""
    while read -r count index; do
        total_count=$((total_count + count))
        file_list+="${file_ids[$index]}($count) "
    done < "$word_file"
    echo "$total_count $word $file_list" >> wordcount.txt
done

sort -nr wordcount.txt -o wordcount.txt
rm -rf "$temp_dir"
rm -f "$temp_files_list"

rm -f wordcount_ids.txt
for i in "${!files[@]}"; do
    echo "${file_ids[$i]}: ${files[$i]}" >> wordcount_ids.txt
done