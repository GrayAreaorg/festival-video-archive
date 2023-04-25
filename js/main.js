const _databaseFilename = "./data/db.json";

const onReady = () => {};

const filterStrings = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
];

const DOMContentLoaded = () => {
  if (document.readyState !== "loading") {
    onReady();
    return;
  }
  document.addEventListener("DOMContentLoaded", onReady);
  document.addEventListener("alpine:init", () => {
    Alpine.data("videoData", () => ({
      allVideos: [],
      videos: Alpine.$persist([]),
      filters: Alpine.$persist([]),
      selVideo: "",
      sortAsc: true,
      sortCol: "",
      pageSize: 10,
      curPage: 1,
      async init() {
        const _db = await fetch(_databaseFilename).then((response) => response.json());
        this.videos = this.allVideos = _db.videos;
        this.filter(this.filters);
        this.sort("festival_year");
      },
      fetchSubs(selVideo) {
        if (selVideo.subtitlesFile) {
          fetch(selVideo.subtitlesFile)
            .then((response) => response.text())
            .then((data) => {
              selVideo.parsedSubs = data;
            })
            .catch((error) => console.error(error));
        }
      },
      sortArrow(col) {
        return this.sortCol === col ? this.sortArrowIcon : "";
      },
      filter(filters) {
        this.curPage = 1;
        if (filters.length > 0) {
          this.videos = this.allVideos.filter((video) =>
            filters.includes(video.festival_year)
          );
        } else {
          this.videos = this.allVideos;
        }
      },
      sort(col) {
        const up = "↑";
        const dn = "↓";

        if (this.sortCol === col) this.sortAsc = !this.sortAsc;
        this.sortCol = col;

        if (this.sortCol == "festival_year")
          this.sortArrowIcon = this.sortAsc ? dn : up;
        else this.sortArrowIcon = this.sortAsc ? up : dn;

        this.videos.sort((a, b) => {
          if (a[this.sortCol] < b[this.sortCol]) return this.sortAsc ? 1 : -1;
          if (a[this.sortCol] > b[this.sortCol]) return this.sortAsc ? -1 : 1;
          return;
        });
      },
      nextPage() {
        if (this.curPage * this.pageSize < this.videos.length) this.curPage++;
      },
      previousPage() {
        if (this.curPage > 1) this.curPage--;
      },
      pagedVideos() {
        if (this.videos) {
          return this.videos.filter((row, index) => {
            let start = (this.curPage - 1) * this.pageSize;
            let end = this.curPage * this.pageSize;
            if (index >= start && index < end) return true;
          });
        } else return [];
      },
    }));
  });
};

DOMContentLoaded();
