# Gray Area Festival Video Archive

https://quilime.github.io/gray-area-video-archive


## TODO

### Aggregation Page

  - [ ] Festival description per year
  - [ ] Hot tags
  - [x] Starting page
  - [x] Rev chron by year (sortable)
  - [x] Year tags

### Logo Bumper for New Videos

  - [ ] Gray Area Logo
  - [ ] Festival Title
  - [ ] Festival Year

## New Metadata

  - Used for more fidelity in Video Archive
  - Retrieved in Video JSON and parsed
  - Metadata delimiter (7 equals signs) "======="
  - key : value format
  - append raw metadata to bottom of YouTube Description field
  - when parsed in archive, prepended with "meta_", for example, "festival_year" becomes { "meta_festival_year" : "2015" } in the archive json

```
======
featured: <featured person(s), or group>
featured_url: https://www.ruhabenjamin.com
festival_year: 2015
... additional metadata as needed ...
```

## Fetch Gray Area Festival YouTube Playlist Metadata

```
# 2021
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIb5NO3fjqIb7o2AxxIqU2w- ./data/videos/2021/

# 2020
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIaarwTpOzGg4DXXVLWy2GVU ./data/videos/2020/

# 2019
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZXGbpAdjpIP9cuuJYfOW-F ./data/videos/2019/

# 2018
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIaNfzV_-f0aYvrpAZAzjhIl ./data/2018/

# 2017
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIYAk9rAz1CQmE9Pzn8G_hrq ./data/videos/2017/

# 2016
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZtQ0PqjW341QIWrqPPkQXi ./data/videos/2016/

# 2015
./bin/get-youtube-metadata https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZz_vKS1amJguyAEIiTtxjw ./data/videos/2015/
```