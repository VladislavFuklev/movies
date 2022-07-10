import {
  addMovieToList,
  clearMoviesMarkup,
  createMarkup,
  createStyle,
  inputSearch,
  moviesList,
  triggerMode,
} from "./dom.js";

let siteUrl = null;
let searchLast = null;


const getData = (url) =>
  fetch(url).then((res) =>
    res.json().then((json) => {
      if (!json || !json.Search)
        throw Error("сервер вернул неправильный обьект");
      return json.Search;
    })
  );


const debounce = (() => {
  let timer = null;

  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(cb, ms);
  };
})();

const inputSearchHandler = (e) => {
  debounce(() => {
    const searchStr = e.target.value.trim();

    if (searchStr && searchStr.length > 3 && searchStr !== searchLast) {
      if (!triggerMode) clearMoviesMarkup(moviesList);
      getData(`${siteUrl}?s=${searchStr}&apikey=18b8609f`)
        .then((movies) =>
          movies.forEach((movie) => {
            addMovieToList(movie);
          })
        )
        .catch((err) => console.error(err));
    }
    searchLast = searchStr;
  }, 2000);
};

export const appInit = (url) => {
    createStyle();
    createMarkup();
    siteUrl = url || "https://omdbapi.com/"
    inputSearch.addEventListener("keyup", inputSearchHandler);
}




