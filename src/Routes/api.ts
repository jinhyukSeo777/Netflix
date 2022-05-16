const API_KEY = "dcbad9ac7abbeb5a64c3012897391ecb";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genre_ids: number[];
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetLatestResult {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
}

export interface ITV {
  poster_path: string;
  id: number;
  backdrop_path: string;
  overview: string;
  name: string;
  genre_ids: number[];
  vote_average: number;
}

export interface IGetTVResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITV[];
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IGenres {
  genres: IGenre[];
}

export interface ITrailer {
  key: string;
}

export interface ITrailers {
  results: ITrailer[];
}

export function getNowPlayingMovie() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopLatedMovie() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovie() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getLatestMovie() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopLatedTV() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getOnTheAirTV() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAiringTodayTV() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovieGenres() {
  return fetch(`${BASE_PATH}/genre/movie/list?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTVGenres() {
  return fetch(`${BASE_PATH}/genre/tv/list?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetMovieDetail(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetMovieCredits(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/casts?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetMovieTrailer(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetSimilarMovie(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetTVDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function GetTVCredits(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}/credits?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetTVTrailer(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}/videos?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function GetSimilarTV(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}/similar?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
