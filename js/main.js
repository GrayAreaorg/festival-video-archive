const filterSortByStrings = ["Date", "Title"];
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
      videos: [],
      filters: {},
      filtersYear: [],
      filtersTopic: [],
      filtersSortBy: [],
      selVideo: {},
      showViewer: false,
      pageSize: 24,
      curPage: 1,
      async init() {
        // load from flatfile json db
        const _db = await fetchJSON("./data/db.json");
        this.videos = this.allVideos = _db.videos;

        // init with sortBy: Date
        document.querySelectorAll('#filterSortBy ul li input[value="Date"]')[0].checked = true;
        this.filterSortBy("Date");

        // check location hash for video link and load it
        var hash = window.location.hash;
        var match = hash.match(/^#v=(.+)/);
        if (match) {
          document.querySelector("a[name='viewer']").scrollIntoView();
            var someString = match[1];
            var video = this.allVideos.find(video => video.id === someString);
            this.selVideo = video;
            this.showViewer = true; 
            this.fetchSubs(this.selVideo); 
        }       
      },
      async fetchSubs(selVideo) {
        if (selVideo.subtitlesFile) {
          selVideo.parsedSubs = fetch(selVideo.subtitlesFile).then((response) =>
            response.text()
          );
        }
      },
      async filterVideos(filters) {
        this.curPage = 1;

        // filter by topic
        if (filters.topics && filters.topics.length > 0) {
          // if we have a topic, they are sorted by relevance, so we deselect 'sortBy'
          const sortBy = document.querySelectorAll('#filterSortBy ul li input').forEach(el => {
            el.checked = false;
          });
          // get all file urls for the selected topics
          const fileUrls = [];
          for (var i = 0; i < filters.topics.length; i++) {
            const foundTopic = filtersTopicStrings.find((obj) => obj.topic === filters.topics[i]);
            if (foundTopic) fileUrls.push(`./data/topics/${foundTopic.data}`);
          }
          // parse appropriate topic json files
          const combinedVideos = await loadAndCombineJSONFiles(fileUrls);
          // filter videos from results
          this.videos = combinedVideos.map((videoIdObj) => {
              const videoMatch = this.allVideos.find((video) => video.id === videoIdObj.id);
              return videoMatch ? videoMatch : null;
          }).filter((video) => video !== null);
        } else {
          this.videos = this.allVideos;
        }

        // filter by year
        if (filters.years && filters.years.length > 0) {
          this.videos = this.videos.filter((video) => filters.years.includes(video.festival_year));
        }

        // filter by title/desc string fragment
        if (filters.search) {
          this.videos = this.videos.filter(obj =>
            (obj.title && obj.title.toLowerCase().includes(filters.search.toLowerCase())) ||
            (obj.description && obj.description.toLowerCase().includes(filters.search.toLowerCase()))
          );
        }
      },
      setSelVideo(videoDisplayId) {
        // set the window hash to the video display id, after navigating to the viewer
        setTimeout(() => {
          window.location.hash = videoDisplayId
        }, 150);
      },
      filterYear(festivalYears) {
        this.filters.years = festivalYears;
        this.filterVideos(this.filters);
        return;
      },
      filterTopic(topics) {
        this.filters.topics = topics;
        this.filterVideos(this.filters);
        return;
      },
      filterTitleDesc(e) {
        this.filters.search = e.target.value;
        this.filterVideos(this.filters);
        return;
      },
      filterSortBy(sortFilter) {
        this.curPage = 1;
        switch (sortFilter) {
          case "Date":
            this.sort("festival_year", false);
            break;
          case "Title":
            this.sort("title", true);
            break;
        }
      },
      sort(col, asc = true) {
        this.videos.sort((a, b) => {
          if (a[col] < b[col]) return asc ? -1 : 1;
          if (a[col] > b[col]) return asc ? 1 : -1;
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
