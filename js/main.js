const _festivalData = [
  './data/2020.json',
  './data/2021.json',
  './data/2022.json',
  './data/2023.json'
];

function documentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
    return;
  }
  document.addEventListener('DOMContentLoaded', fn);
  document.addEventListener('alpine:init', () => {
    Alpine.data('videoData', () => ({
      videos: [],
      async init() {
        this.videos = await fetchAndCombineFestivalVideoData(_festivalData);
      },
    }))
  });  
}  
documentReady(onReady)

function onReady() {
  console.info('document ready');
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



