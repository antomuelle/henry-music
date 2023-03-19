import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { filterItem, removeItem, shuffleArray } from "./lib/utils";

const { PROD, VITE_SERVER_PORT } = import.meta.env;
const URL = PROD ? '/api' : `http://localhost:${VITE_SERVER_PORT}/api`;
// const URL = "https://henrymusic.tech/api/";

const initialState = {
  token: null,
  authenticated: null,
  shuffle: false,
  frontPage: null,
  queue: [],
  playedQueue: [],
  currentTrack: null,
}

const reducers = {
  setToken: (state, action) => { state.token = action.payload; },
  setAuthenticated: (state, action) => { state.authenticated = action.payload; },
  setFrontPage: (state, action) => { state.frontPage = action.payload; },
  playTrack: (state, action) => { state.currentTrack = action.payload; },
  addToQueue: (state, action) => { state.queue.push(action.payload); },
  removeFromQueue: (state, action) => { state.queue = state.queue.filter((track) => track.id !== action.payload); },
  clearQueue: (state) => { state.queue = []; },
  setQueue: (state, action) => {
    state.queue = action.payload;
    state.playedQueue = [];
    state.currentTrack = null;
    setPositions(state.queue);
    if (state.shuffle) shuffleArray(state.queue);
  },
  toogleShuffle: (state) => {
    state.shuffle = !state.shuffle;
    if (state.shuffle) shuffleArray(state.queue);
    else state.queue.sort((a, b) => a.position - b.position);
  },
  playNext: (state) => {
    if (!state.queue.length) return;
    state.currentTrack && state.playedQueue.push(state.currentTrack);
    state.currentTrack = state.queue.shift();
  },
  playPrevious: (state) => {
    if (!state.playedQueue.length) return;
    state.queue.unshift(state.currentTrack);
    state.currentTrack = state.playedQueue.pop();
  }
}

// Async thunks ----------
export const fetchFrontPage = () => async (dispatch) => {
  const { data } = await axios.get(`${URL}/front`);
  dispatch(Actions.setFrontPage(data));
}

export const fetchArtistTracks = (artistId) => async (dispatch, getState) => {
  const { data } = await axios.get(`${URL}/artist/${artistId}/tracks`);
  dispatch(Actions.setQueue(data.tracks));
  dispatch(Actions.playNext());
}

// Helpers --------------
function setPositions(queue) {
  queue.forEach((track, index) => {
    track.position = index;
  });
}

// Slice creation ----------
export const rootSlice = createSlice({
  name: 'henry',
  initialState,
  reducers,
})

export const Actions = rootSlice.actions;
export const Reducer = rootSlice.reducer;