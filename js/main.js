const _festivalData = [
  "./data/2020.json",
  "./data/2021.json",
  "./data/2022.json",
  "./data/2023.json",
];

function documentReady(fn) {
  if (document.readyState !== "loading") {
    fn();
    return;
  }
  document.addEventListener("DOMContentLoaded", fn);
  document.addEventListener("alpine:init", () => {
    // get all videos and set as data object
    Alpine.data("videoData", () => ({
      videos: [],
      async init() {
        this.videos = await fetchAndCombineFestivalData(_festivalData);
      },
      sortArrow(col) {
        return this.sortCol === col ? this.sortArrowIcon : '';
      },
      sortCol: '',
      sort(col) {
        if (this.sortCol === col) this.sortAsc = !this.sortAsc;
        this.sortCol = col;
        this.sortArrowIcon = this.sortAsc ? '▲' : '▼',
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

function onReady() {
  console.info("document ready");
}

function fetchAndCombineFestivalData(urls) {
  const promises = urls.map((url) => {
    return fetch(url).then((response) => response.json());
  });
  return Promise.all(promises).then((data) => {
    return data.reduce((acc, cur) => {
      // concat festival metadata onto each video object
      const videos = cur.videos.map((element) => {
        return {
          ...element,
          festivalYear: cur.year,
          festivalDescription: cur.description,
          festivalTitle: cur.title,
        };
      });
      return acc.concat(videos);
    }, []);
  });
}
