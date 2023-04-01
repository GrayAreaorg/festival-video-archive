const _databaseFilename = "./data/db.json";

const onReady = () => {
  console.info("document ready");
}

const filterData = () => {
  console.log('filter');
}

const documentReady = (fn) => {
  if (document.readyState !== "loading") {
    fn();
    return;
  }
  document.addEventListener("DOMContentLoaded", fn);
  document.addEventListener("alpine:init", () => {
    // get all videos and set as data object
    Alpine.data("videoData", () => ({
      allVideos: [],
      videos: [],
      async init() {
        this.videos = await fetch(_databaseFilename).then((response) => response.json());
        this.allVideos = this.videos;
      },
      sortArrow(col) {
        return this.sortCol === col ? this.sortArrowIcon : '';
      },
      sortCol: '',
      filter(filters) {
        if (filters.length > 0) {
          this.videos = this.allVideos.filter(video => filters.includes(video.festival_year));
        } else {
          this.videos = this.allVideos;
        }
      },
      sort(col) {
        if (this.sortCol === col) this.sortAsc = !this.sortAsc;
        this.sortCol = col;
        this.sortArrowIcon = this.sortAsc ? '▲' : '▼';
        this.videos.sort((a, b) => {
          if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? 1 : -1;
          if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? -1 : 1;
          return 0;
        });
      },
    }));
  });
}

documentReady(onReady);