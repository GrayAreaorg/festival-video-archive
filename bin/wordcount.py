import os
import re
from collections import Counter, defaultdict

def traverse_directory(directory, video_word_counters):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.vtt'):
                video_id = get_video_id(file)
                video_word_counters[video_id] = process_vtt(os.path.join(root, file))

def process_vtt(file_path):
    video_word_counter = Counter()
    with open(file_path, 'r', encoding='utf-8') as file:
        for _ in range(4):
            next(file, None)
        for line in file:
            if re.search(r'\d{2}:\d{2}:\d{2}\.\d{3}', line) or line.startswith('NOTE') or line.strip().isdigit():
                continue
            words = re.findall(r'\w+', line.lower())
            video_word_counter.update(words)
    return video_word_counter

def get_video_id(filename):
    match = re.search(r'\[(.*?)\]', filename)
    if match:
        return match.group(1)
    return None

def merge_word_counters(video_word_counters):
    merged_counter = defaultdict(lambda: {"total": 0, "videos": defaultdict(int)})
    for video_id, word_counter in video_word_counters.items():
        for word, count in word_counter.items():
            merged_counter[word]["total"] += count
            merged_counter[word]["videos"][video_id] = count
    return merged_counter

def main():
    directory = 'data/videos'
    output_file = 'wordcount.txt'
    video_word_counters = {}

    traverse_directory(directory, video_word_counters)
    merged_counter = merge_word_counters(video_word_counters)
    sorted_merged_counter = sorted(merged_counter.items(), key=lambda x: x[1]["total"], reverse=True)

    with open(output_file, 'w', encoding='utf-8') as file:
        for word, stats in sorted_merged_counter:
            sorted_video_stats = sorted(stats["videos"].items(), key=lambda x: x[1], reverse=True)
            video_stats = ', '.join([f"{video_id}: {count}" for video_id, count in sorted_video_stats])
            file.write(f"{stats['total']} {word} [{video_stats}]\n")

if __name__ == '__main__':
    main()
