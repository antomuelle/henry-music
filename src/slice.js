import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const { DEV, VITE_SERVER_PORT } = import.meta.env;
const URL = DEV ? `http://localhost:${VITE_SERVER_PORT}/api` : "https://henrymusic.tech/api/";

const initialState = {
  token: null,
  authenticated: null,
  frontPage: null,
  queue: [],
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
  setQueue: (state, action) => { state.queue = action.payload; },
}

// Async thunks ----------
export const fetchQueue = () => async (dispatch) => {
  const { data } = await axios.get(`${URL}/queue`);
  dispatch(Actions.setQueue(data));
}

export const fetchFrontPage = () => async (dispatch) => {
  const { data } = await axios.get(`${URL}/front`);
  dispatch(Actions.setFrontPage(data));
}

export const fetchArtistTracks = (artistId) => async (dispatch, getState) => {
  console.log(dispatch)
  const { data } = await axios.get(`${URL}/artist/${artistId}/tracks`);
  dispatch(Actions.setQueue(data.tracks));
  dispatch(Actions.playTrack(data.tracks[0]));
}

// Slice creation ----------
export const rootSlice = createSlice({
  name: 'henry',
  initialState,
  reducers,
})

export const Actions = rootSlice.actions;
export const Reducer = rootSlice.reducer;