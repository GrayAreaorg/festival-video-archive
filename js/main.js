const _festivalData = [
  './data/2020.json',
  './data/2021.json',
  './data/2022.json',
  './data/2023.json'
];

function onReady() {
  console.info('document ready');
  fetchAndCombineFestivalVideoData(_festivalData)
    .then(videos => {
      Alpine.store('videos', videos);
      console.log('vids', videos);
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchAndCombineFestivalVideoData(urls) {
  const promises = urls.map(url => {
    return fetch(url).then(response => response.json());
  });
  return Promise.all(promises)
    .then(data => {
      return data.reduce((acc, cur) => {
        // concat festival metadata onto each video object
        const videos = cur.videos.map(element => {
          return {
          ...element,
          "festival" : {
            "year": cur.year,
            "description": cur.description,
            "title": cur.title,
          }
        };
        });
        return acc.concat(videos);
      }, []);
    });
}

function load() {
  return {
    message: 'Videos Loaded',
    videos: [],
    videoDisplay: '',
    isLoading: false,
    fetchVideos: function () {
      this.videoDisplay = this.message;    
      this.isLoading = true;
      fetch('/data/2020.json')
        .then(res => res.json())
        .then(data => {
          this.isLoading = false;
          this.videos = data.videos
        })
    }
  }
}


function documentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
    return;
  }
  document.addEventListener('DOMContentLoaded', fn);
  document.addEventListener('alpine:init', () => {
    Alpine.store('videos', []);
  });  
}  
documentReady(onReady)
