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

const isEmpty = (str) => (str === undefined || str === null || str === '');

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
      curSort: "",
      selVideo: {},
      showViewer: false,
      pageSize: 24,
      curPage: 1,
      version: "",
      async init() {

        // preamble
        const _package = await fetchJSON("./package.json");
        console.log(_package.name);
        console.log('license:', _package.license);
        console.log('version:', _package.version);
        this.version = _package.version;
        console.log('---');

        // load from flatfile json db
        const _db = await fetchJSON("./data/db.json");
        this.videos = this.allVideos = _db.videos;
        
        this.setStatefromURL();
      },
      setURLState () {
        const urlState = {
          selVideo: this.selVideo,
          filters: this.filters,
          sort: this.curSort,
          page: this.curPage
        }

        let hash = "";

        // selected video
        if (!isEmpty(urlState.selVideo && urlState.selVideo.display_id)) {
          hash += `v=${urlState.selVideo.display_id}&`
        }

        // filters
        if (!isEmpty(urlState.filters)) {
          if (!isEmpty(urlState.filters.topics)) {
            hash += `filterTopics=${urlState.filters.topics.join()}&`
          }
          if (!isEmpty(urlState.filters.years)) {
            hash += `filterYears=${urlState.filters.years.join()}&`
          }          
          if (!isEmpty(urlState.filters.search)) {
            hash += `filterSearch=${urlState.filters.search}&`
          }                    
        }

        // sort
        if (!isEmpty(urlState.sort)) {
          hash += `sort=${urlState.sort}&`
        }

        // page
        if (!isEmpty(urlState.page)) {
          hash += `page=${urlState.page}&`
        }

        // use a timeout here to allow the interface to use to anchor tags
        setTimeout(() => {
          window.location.hash = hash;
        }, 100);
      },
      setStatefromURL () {
        const params = new URLSearchParams(window.location.hash.split('#')[1]);

        const splitParams = (str) => {
          return typeof str === 'string' && str !== '' ? str.split(',') : null;
        }

        const urlState = {
          display_id: params.get('v'),
          filters: {
            topics: splitParams(params.get('filterTopics')),
            years: splitParams(params.get('filterYears')),
            search: params.get('filterSearch')
          },
          sort: params.get('sort'),
          page: params.get('page')
        }

        // load video from state
        if (urlState.display_id) {
          document.querySelector("a[name='viewer']").scrollIntoView();
          var video = this.allVideos.find(video => video.id === urlState.display_id);
          this.selVideo = video;
          this.showViewer = true; 
          this.fetchSubs(this.selVideo);           
        }

        // set sort
        if (urlState.sort) {
          document.querySelectorAll(`#filterSortBy ul li input[value="${urlState.sort}"]`)[0].checked = true;
          this.filterSortBy(urlState.sort)
        }

        // set filter topic elements
        if (urlState.filters.topics) {
          urlState.filters.topics.map((v) => {
            document.querySelectorAll(`#filterTopic ul li input[value="${v}"]`)[0].checked = true;
          })
          this.filtersTopic = urlState.filters.topics;
          this.filterTopic(urlState.filters.topics);
        }

        // set filter years
        if (urlState.filters.years) {
          urlState.filters.years.map((v) => {
            document.querySelectorAll(`#filterYear ul li input[value="${v}"]`)[0].checked = true;
          })
          this.filtersYear = urlState.filters.years;
          this.filterYear(urlState.filters.years);
        }       
        
        // set filter str search
        if (urlState.filters.search) {
          const input = document.querySelectorAll(`#filterSearch input`)[0];
          input.value = urlState.filters.search;
          this.filters.search = urlState.filters.search;
          this.filterVideos(this.filters);
        }

        // set page num
        if (urlState.page) {
          this.curPage = urlState.page;
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

        this.setURLState();
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
        this.curSort = sortFilter;
        this.setURLState();
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
        this.setURLState();
      },
      previousPage() {
        if (this.curPage > 1) this.curPage--;
        this.setURLState();
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
