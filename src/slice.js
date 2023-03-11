import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const { DEV, VITE_SERVER_PORT } = import.meta.env;
const URL = DEV ? `http://localhost:${VITE_SERVER_PORT}/api` : "https://henrymusic.tech/api/";

const initialState = {
  token: null,
  authenticated: null,
  frontPage: null,
  artists: [],
  albums: [],
  tracks: [],
  currentTrack: null,
}

const reducers = {
  setToken: (state, action) => { state.token = action.payload; },
  setAuthenticated: (state, action) => { state.authenticated = action.payload; },
  setFrontPage: (state, action) => { state.frontPage = action.payload; },
  setArtists: (state, action) => { state.artists = action.payload; },
  setAlbums: (state, action) => { state.albums = action.payload; },
  setTracks: (state, action) => { state.tracks = action.payload; },
  playTrack: (state, action) => { state.currentTrack = action.payload; },
}

// Async thunks ----------
export const fetchArtists = () => async (dispatch) => {
  const { data } = await axios.get(`${URL}/artist/all`);
  dispatch(Actions.setArtists(data));
}

export const fetchFrontPage = () => async (dispatch) => {
  const { data } = await axios.get(`${URL}/front`);
  dispatch(Actions.setFrontPage(data));
}

// Slice creation ----------
export const rootSlice = createSlice({
  name: 'henry',
  initialState,
  reducers,
})

export const Actions = rootSlice.actions;
export const Reducer = rootSlice.reducer;