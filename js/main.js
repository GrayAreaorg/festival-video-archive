const filterYearStrings = [
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
];
const filterSortByStrings = ["Date", "Title"];
const filtersTopicsDir = "./data/topics";
const filtersTopicStrings = [
  { topic: "AI", data: "ai.json" },
  { topic: "Art", data: "art.json" },
  { topic: "Biology", data: "biology.json" },
  { topic: "Decolonialism", data: "decolonialism.json" },
  { topic: "Design", data: "design.json" },
  { topic: "Ecology", data: "ecology.json" },
  { topic: "History", data: "history.json" },
  { topic: "Indigenous Wisdom", data: "indigenous.json" },
  { topic: "Machine Learning", data: "machine-learning.json" },
  { topic: "Metaverse", data: "metaverse.json" },
  { topic: "Music", data: "music.json" },
  { topic: "Philosophy", data: "philosophy.json" },
  { topic: "Software", data: "software.json" },
  { topic: "Systems", data: "systems.json" },
];

const fetchJSON = async (url) => {
  const res = await fetch(url);
  return res.json();
};

const loadAndCombineJSONFiles = async(fileUrls) => {
  try {
    const jsonFiles = await Promise.all(fileUrls.map(fetchJSON));
    const allVideos = jsonFiles.flatMap((file) => file.videos);
    const videoMap = new Map();
    allVideos.forEach((video) => {
      if (!videoMap.has(video.id) || videoMap.get(video.id).num < video.num)
        videoMap.set(video.id, video);
    });
    return Array.from(videoMap.values()).sort((a, b) => b.num - a.num);
  } catch (error) {
    console.error("Error loading and combining JSON files:", error);
    return [];
  }
}

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
      topicFilteredVideos: [],
      videos: [], // Alpine.$persist([]),
      filters: {},
      filtersYear: [],
      filtersTopic: [],
      filtersSortBy: [],
      selectedFilters: [],
      topic: [],
      selVideo: {},
      showViewer: false,
      sortAsc: true,
      sortCol: "",
      sortFilter: "",
      pageSize: 24,
      curPage: 1,
      async init() {
        // load from flatfile json db
        const _db = await fetchJSON("./data/db.json");
        this.videos = this.allVideos = _db.videos;

        // select Date filter to start
        document.querySelectorAll('#filterSortBy ul li input[value="Date"]')[0].checked = true;
        this.filterSortBy("Date");
      },
      async fetchSubs(selVideo) {
        if (selVideo.subtitlesFile) {
          selVideo.parsedSubs = fetch(selVideo.subtitlesFile).then((response) =>
            response.text()
          );
        }
      },
      filterVideos(filters) {
        console.log(filters);

        /*

        // TODO;
        - each filter function sets their own setting, and then
        - store one outputlist that gets filtered in a single filter function
        - this manages stage and order of operations better.

        the filter order is:

        - sort
        - filter year
        - filter topic
        - filter title/description

        each setting is set discretely, and then a single filter function is hit.

        reset the pagination when filtering is changed.

        */


        // filter by year






      },
      filterTitleDesc(e) {
        const search = e.target.value;

        this.filters.search = search;
        this.filterVideos(this.filters);
        return;

        if (!search) {
          console.log('empty');
          this.videos = this.allVideos;
        }

        const filtered = this.allVideos.filter(obj =>
            (obj.title && obj.title.toLowerCase().includes(search.toLowerCase())) ||
            (obj.description && obj.description.toLowerCase().includes(search.toLowerCase()))
          );

        console.log(filtered);
        console.log(this.topic);

        this.videos = filtered;
        this.filter(this.selectedFilters);
      },
      filterSortBy(sortFilter) {

        this.filters.sortBy = sortFilter;
        this.filterVideos(this.filters);
        return;

        console.log('filters', this.filters);

        this.sortFilter = sortFilter;
        switch (sortFilter) {
          case "Date":
            this.sort("festival_year", false);
            break;
          case "Title":
            this.sort("title", true);
            break;
        }



      },
      async filterTopic(topics) {
        this.filters.topics = topics;
        this.filterVideos(this.filters);
        return;


        // console.log(`filter => '${topic}'`);



        const vids = prefilteredVids ? prefilteredVids : this.allVideos;

        if (topic.length == 0) {
          this.videos = this.allVideos;
          this.topic = [];
          this.topicFilteredVideos = [];
          this.filter(this.selectedFilters);
          return;
        }

        this.topic = topic;

        const fileUrls = [];
        for (var i = 0; i < topic.length; i++) {
          const t = topic[i];
          const foundObject = filtersTopicStrings.find((obj) => obj.topic === t);
          if (foundObject)
            fileUrls.push(`${filtersTopicsDir}/${foundObject.data}`);
        }

        loadAndCombineJSONFiles(fileUrls).then((combinedVideos) => {
          const filteredVideos = combinedVideos
            .map((videoIdObj) => {
              const videoMatch = this.allVideos.find((video) => video.id === videoIdObj.id);
              return videoMatch ? videoMatch : null;
            })
            .filter((video) => video !== null);

          this.topicFilteredVideos = filteredVideos;
          this.filter(this.selectedFilters, this.topicFilteredVideos);
        });
      },
      filterYear(festivalYears) {
        this.filters.years = festivalYears;
        this.filterVideos(this.filters);

        return
        this.selectedFilters = festivalYears;
        this.curPage = 1;
        const vids = this.videos > 0 ? this.videos : this.allVideos;
        if (festivalYears.length > 0) {
          this.videos = vids.filter((video) => festivalYears.includes(video.festival_year));
        } else {
          this.videos = vids;
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
