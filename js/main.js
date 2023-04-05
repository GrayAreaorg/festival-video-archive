const _databaseFilename = "./data/db.json";

const onReady = () => {};

const filterStrings = ["2015", "2016", "2017", "2018", "2019", "2020", "2021"];

const DOMContentLoaded = () => {
  if (document.readyState !== "loading") {
    onReady();
    return;
  }
  document.addEventListener("DOMContentLoaded", onReady);
  document.addEventListener("alpine:init", () => {
    Alpine.data("videoData", () => ({
      allVideos: [],
      videos: [],
      selVideo: "",
      sortAsc: true,
      sortCol: "",
      async init() {
        this.videos = this.allVideos = await fetch(_databaseFilename).then(
          (response) => response.json()
        );
        this.sort("festival_year");
      },
      async fetchSubs(subsFile) {
        try {
          const response = await fetch(subsFile);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.text();
        } catch (error) {
          console.error(error);
        }        
        // if (subsFile) {
        //   let subs = ""
        //   fetch((subsFile))
        //   .then(response => response.text())
        //   .then(data => {
        //     subs = data;
        //     // return data;
        //   })
        //   .catch(error => console.error(error));
        //   return subs;
        // }
      },
      sortArrow(col) {
        return this.sortCol === col ? this.sortArrowIcon : "";
      },
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
    }));
  });
};

DOMContentLoaded();
