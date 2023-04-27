const _databaseFilename = "./data/db.json";
const filterYearStrings = [
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
];
const filterSortByStrings = [
  "Title",
  "Date"
]

const onReady = () => { };
const DOMContentLoaded = () => {
  if (document.readyState !== "loading") {
    onReady();
    return;
  }
  document.addEventListener("DOMContentLoaded", onReady);
  document.addEventListener("alpine:init", () => {
    Alpine.data("videoData", () => ({
      allVideos: [],
      videos: [], // Alpine.$persist([]),
      filters: [], // Alpine.$persist([]),
      filtersYear: [],
      filtersSortBy: [],
      filtersSortBySel: "",
      selVideo: "",
      sortAsc: true,
      sortCol: "",
      pageSize: 10,
      curPage: 1,
      async init() {
        const _db = await fetch(_databaseFilename).then((response) =>
          response.json()
        );
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
        }
      },
      filterSortByRadioClick(e) {
        if (this.filtersSortBySel == e.currentTarget.value) {
          document.querySelectorAll("#filterSortBy ul li input").forEach((el => {
            el.checked = false;
          }))
        }
        this.filtersSortBySel = e.currentTarget.value;
      },
      filterSortBy(sortFilter) {
        switch (sortFilter) {
          case "Date": this.sort("festival_year", false); break;
          case "Title": this.sort("title", true); break;
        }
      },
      filter(selectedFilters) {
        this.curPage = 1;
        if (selectedFilters.length > 0) {
          this.videos = this.allVideos.filter((video) =>
            selectedFilters.includes(video.festival_year)
          );
        } else {
          this.videos = this.allVideos;
        }
      },
      sort(col, asc = true) {
        this.sortCol = col;
        this.videos.sort((a, b) => {
          if (a[this.sortCol] < b[this.sortCol]) return asc ? -1 : 1;
          if (a[this.sortCol] > b[this.sortCol]) return asc ? 1 : -1;
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
