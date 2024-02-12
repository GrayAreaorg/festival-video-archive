#!/bin/bash

mkdir -p ./data/topics

./bin/search-caption-string.sh ./data/videos "artificial intelligence" " ai " > ./data/topics/ai.txt
./bin/search-caption-string.sh ./data/videos " art " "fine art" "gallery" > ./data/topics/art.txt
./bin/search-caption-string.sh ./data/videos "biology" "cell" "genetics" "evolution" "physiology" "biochemistry" "adaptation" "reproduction" "biodiversity" "microbio" "molecular" > ./data/topics/biology.txt
./bin/search-caption-string.sh ./data/videos "decolonialism" "neocolonialism" "colonial" "indigenous" "imperialism" "sovereignty" > ./data/topics/decolonialism.txt
./bin/search-caption-string.sh ./data/videos "design" "graphic design" "web design" "product design" > ./data/topics/design.txt
./bin/search-caption-string.sh ./data/videos "ecology" "earth" "climate change" "ecosystem" "biodiversity" "conservation" "environment" > ./data/topics/ecology.txt
./bin/search-caption-string.sh ./data/videos "history" "historical" "past" "era" "ancient" "civilization" "culture" "heritage" > ./data/topics/history.txt
./bin/search-caption-string.sh ./data/videos "indigenous" "wisdom" "elder" "past" "native" "heritage" "spiritual" > ./data/topics/indigenous.txt
./bin/search-caption-string.sh ./data/videos "machine learning" " ml " "neural net" > ./data/topics/machine-learning.txt
./bin/search-caption-string.sh ./data/videos " ar " " vr " " xr " "augmented reality" "mixed reality" "virtual reality" "immersive" "virtual world" > ./data/topics/metaverse.txt
./bin/search-caption-string.sh ./data/videos "music" "song" "concert" "composition" "melody" > ./data/topics/music.txt
./bin/search-caption-string.sh ./data/videos "philosophy" "metaphysics" "ethics" "aesthetic" "phenomenology" > ./data/topics/philosophy.txt
./bin/search-caption-string.sh ./data/videos "software" "programming" "code" "algorithm" "open source" > ./data/topics/software.txt
./bin/search-caption-string.sh ./data/videos "systems" "chaos" "complexity" "modeling" "simulation" "pattern" > ./data/topics/systems.txt

# convert to json
for file in $(find ./data/topics/ -type f -name "*.txt"); do
  json_file="${file%.txt}.json"
  node bin/topic_lists_to_json.js "$file" > "$json_file"
done
