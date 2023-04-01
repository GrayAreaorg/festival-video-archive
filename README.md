# Gray Area Festival Video Archive

https://quilime.github.io/gray-area-video-archive


## TODO

### Logo Bumper

  - [ ] Gray Area Logo
  - [ ] Festival Title
  - [ ] Festival Year


### Aggregation Page

  - [ ] Festival description per year
  - [x] Starting page
  - [x] Rev chron by year (sortable)
  - [x] Year tags
  - [ ] Hot tags


### Festival talks metadata

  - [x] Title
  - [ ] Presenter
  - [ ] Description
  - [x] Tags
  - [x] Date
  - [x] Festival Year


### JSON Database

  - [ ] JSON Database


### Existing Festival Websites

  - https://2015.grayareafestival.io/
  - https://2016.grayareafestival.io/
  - https://2017.grayareafestival.io/
  - https://2018.grayareafestival.io/
  - https://2019.grayareafestival.io/
  - https://2020.grayareafestival.io/
  - https://2021.grayareafestival.io/


## Fetching YouTube Playlist Metadata

Retrieve All Playlists from Youtube as JSON

Single Playlist

`ytdlp --write-info-json --skip-download "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZXGbpAdjpIP9cuuJYfOW-F"`

Multiple Playlists

`ytdlp --ignore-errors --write-info-json --skip-download -o "./%(playlist)s/%(title)s.%(ext)s" https://www.youtube.com/@GrayAreaorg/playlists`
