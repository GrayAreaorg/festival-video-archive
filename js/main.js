const _databaseFilename = "./data/db.json";

const onReady = () => {};

const DOMContentLoaded = () => {
  if (document.readyState !== "loading") {
    onReady();
    return;
  }
  document.addEventListener("DOMContentLoaded", onReady);
  document.addEventListener("alpine:init", () => {
    // get videos and set as data object
    Alpine.data("videoData", () => ({
      allVideos: [],
      videos: [],
      async init() {
        this.videos = await fetch(_databaseFilename).then((response) =>
          response.json()
        );
        // default sort to festival year
        this.sort("festival_year");
        this.allVideos = this.videos;
      },
      sortArrow(col) {
        return this.sortCol === col ? this.sortArrowIcon : "";
      },
      // default sort to true
      sortAsc: true,
      sortCol: "",
      filter(filters) {
        if (filters.length > 0) {
          this.videos = this.allVideos.filter((video) =>
            filters.includes(video.festival_year)
          );
        } else {
          this.videos = this.allVideos;
        }
      },
      sort(col) {
        const up = "▲";
        const dn = "▼";
        if (this.sortCol === col) this.sortAsc = !this.sortAsc;
        this.sortCol = col;
        if (this.sortCol == "festival_year") {
          this.sortArrowIcon = this.sortAsc ? dn : up;
        } else {
          this.sortArrowIcon = this.sortAsc ? up : dn;
        }
        this.videos.sort((a, b) => {
          if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? 1 : -1;
          if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? -1 : 1;
          return 0;
        });
      },
    }));
  });
};
DOMContentLoaded();
