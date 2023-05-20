import { Navigation, Pagination } from "swiper";

const { PROD, VITE_SERVER_PORT } = import.meta.env;
//const BASE_URL = PROD ? '/api' : `http://localhost:${VITE_SERVER_PORT}/api`;
 const BASE_URL = "https://henrymusic.tech/api"

export const audio = new Audio()

export const URL = Object.freeze({
  api: BASE_URL,
  likedTracks: `${BASE_URL}/playlist/liked`,
})

export const ROUTES = Object.freeze({
  liked: 'liked',
})

export const EVENTS = Object.freeze({
  liked: 'liked',
  queue: 'queue'
})

export const swiperOpts = {
  slidesPerView: 2,
  spaceBetween: 16,
  modules: [Pagination, Navigation],
  navigation: true,
  pagination: {type: 'progressbar'},
  breakpoints: {
    640: {slidesPerView: 3},
    1024: {slidesPerView: 4},
    1200: {slidesPerView: 5},
    1400: {slidesPerView: 8},
    1600: {slidesPerView: 10}
  }
}