# Gray Area Festival Video Archive

https://quilime.github.io/gray-area-video-archive


# Fetching YouTube Playlist Metadata

Retrieve All Playlists from Youtube as JSON

Single Playlist

`ytdlp --write-info-json --skip-download "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZXGbpAdjpIP9cuuJYfOW-F"`

Multiple Playlists

`ytdlp --ignore-errors --write-info-json --skip-download -o "./%(playlist)s/%(title)s.%(ext)s" https://www.youtube.com/@GrayAreaorg/playlists`
