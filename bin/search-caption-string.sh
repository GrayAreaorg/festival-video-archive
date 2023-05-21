#!/bin/bash

# Usage: script.sh sourceDir output.txt query1 [query2 query3 ...]

# Query Arrays
#   "AI"                  ->  "artificial intelligence" " ai "
#   "Art"                 ->  " art " "fine art" "gallery"
#   "Biology"             ->  "biology" "cell" "genetics" "evolution" "physiology" "biochemistry" "adaptation" "reproduction" "biodiversity" "microbio" "molecular"
#   "Decolonialism"       ->  "decolonialism" "neocolonialism" "colonial" "indigenous" "imperialism" "sovereignty"
#   "Design"              ->  "design" "graphic design" "web design" "product design"
#   "Ecology"             ->  "ecology" "earth" "climate change" "ecosystem" "biodiversity" "conservation" "environment"
#   "History"             ->  "history" "historical" "past" "era" "ancient" "civilization" "culture" "heritage"
#   "Indigenous Wisdom"   ->  "indigenous" "wisdom" "elder" "past" "native" "heritage" "spiritual"
#   "Machine Learning"    ->  "machine learning" " ml " "neural net"
#   "Metaverse"           ->  " ar " " vr " " xr " "augmented reality" "mixed reality" "virtual reality" "immersive" "virtual world"
#   "Music"               ->  "music" "song" "concert" "composition" "melody"
#   "Philosophy"          ->  "philosophy" "metaphysics" "ethics" "aesthetic" "phenomenology"
#   "Software"            ->  "software" "programming" "code" "algorhythm" "computer science" "open source" "interface"
#   "Systems"             ->  "systems" "chaos" "complexity" "modeling" "simulation" "pattern"

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 sourceDir output.txt query1 [query2 query3 ...]"
    exit 1
fi

sourceDir="$1"
outputFile="$2"
shift 2
argsArray=("$@")

echo "Source directory: $sourceDir"
echo "Output file: $outputFile"
echo "Arguments array: ${argsArray[*]}"

# empty the output file
> "$outputFile-tmp"

# find each element in the args array
for pattern in "${argsArray[@]}"; do
    # find all .vtts and search for the pattern in each one
    find $sourceDir -type f -name "*.vtt" -exec grep -H -n "$pattern" {} \; >> "$outputFile-tmp"
done

# process temp file and write to output file.
# 1. `cat "$outputFile-tmp"`: reads contents of temp file
# 2. `cut -d ':' -f 1`: splits each line using `:` as a delimiter and keep the first field
# 3. `sort`: sorts the lines alpha/numerically
# 4. `uniq -c`: removes duplicate lines and add count occurrences for each unique line
# 5. `sort -r`: reverse sort
# 6. `> $outputFile`: save to output file
cat "$outputFile-tmp" | cut -d ':' -f 1 | sort | uniq -c | sort -r > $outputFile

# cleanup
rm "$outputFile-tmp"

# find ./data/videos -type f -name "*.vtt" -exec grep -H -n "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -Hl "$1" {} \;
# find ./data/videos -type f -name "*.vtt" -exec grep -l "$1" {} \; | xargs -I {} basename {}