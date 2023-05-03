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
const filterSortByStrings = ["Title", "Date"];
const filtersTopicStrings = [
  "Topic 1",
  "Topic 2",
  "Topic 3",
  "Topic 4",
  "Topic 5",
];

const onReady = () => {};
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
      filtersTopic: [],
      filtersTopicSel: "",
      filtersSortBy: [],
      filtersSortBySel: "",
      selVideo: {},
      showViewer: false,
      sortAsc: true,
      sortCol: "",
      pageSize: 24,
      curPage: 1,
      async init() {
        // load from flatfile json db
        const _db = await fetch(_databaseFilename).then((response) =>
          response.json()
        );
        this.videos = this.allVideos = _db.videos;

        // select Date filter to start
        document.querySelectorAll(
          '#filterSortBy ul li input[value="Date"]'
        )[0].checked = true;
        this.filterSortBy("Date");
      },
      async fetchSubs(selVideo) {
        if (selVideo.subtitlesFile) {
          selVideo.parsedSubs = fetch(selVideo.subtitlesFile).then((response) => response.text())
        }
      },
      filterSortBy(sortFilter) {
        switch (sortFilter) {
          case "Date":
            this.sort("festival_year", false);
            break;
          case "Title":
            this.sort("title", true);
            break;
        }
      },
      filterTopic(topic) {
        console.log(`filter => '${topic}'`);
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
