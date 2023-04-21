import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";
import { pickImage, shuffleArray } from "./lib/utils";
import { URL } from "./lib/constants";
import "../node_modules/node-vibrant/dist/vibrant";

const Vibrant = window.Vibrant
// const URL = PROD ? '/api' : `http://localhost:${VITE_SERVER_PORT}/api`;
// const URL = "https://henrymusic.tech/api/";

const initialState = {
  token: null,
  authenticated: null,
  shuffle: false,
  frontPage: null,
  queue: [],
  playedQueue: [],
  currentTrack: null,
  trackColor: null,
  likedTracks: null,
  playerSource: null
}

const reducers = {
  setToken: (state, action) => { state.token = action.payload; },
  setAuthenticated: (state, action) => { state.authenticated = action.payload; },
  setFrontPage: (state, action) => { state.frontPage = action.payload; },
  addToQueue: (state, action) => { state.queue.push(action.payload); },
  removeFromQueue: (state, action) => { state.queue = state.queue.filter((track) => track.id !== action.payload); },
  clearQueue: (state) => { state.queue = []; },
  setQueue: (state, action) => {
    state.queue = action.payload.map(ob=> ({...ob}))
    setInitialPositions(state.queue);
    state.playedQueue = [];
    state.currentTrack = null;
    if (state.shuffle) shuffleArray(state.queue);
  },
  toogleShuffle: (state) => {
    state.shuffle = !state.shuffle;
    if (state.shuffle) shuffleArray(state.queue);
    else state.queue.sort((a, b) => a.position - b.position);
  },
  setTrackColor: (state, action)=> { state.trackColor = action.payload },
  playTrack: {
    reducer: (state, action) => {
      state.currentTrack = action.payload.track
      state.playerSource = action.payload.source
    },
    prepare: (track, source = null)=> ({ payload: {track, source} })
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
  },
  setLikedTracks: (state, action) => { state.likedTracks = action.payload; },
  updateLikedList: {
    reducer: (state, action)=> {
      if (state.likedTracks === null) return
      const {track, type} = action.payload
      if (type === 'add')
        state.likedTracks.unshift(track)
      else if (type === 'remove')
        state.likedTracks = state.likedTracks.filter((elem)=> elem.id !== track.id)
    },
    prepare: (track, type)=> ({payload: {track, type}})
  },
  updateLikeTrackSource: {
    reducer: (state, action)=> {
      const {track, source, value} = action.payload
      likeSourceTrack(state, source, track, value)
    },
    prepare: (track, source, value)=> ({ payload: {track, source, value} })
  },
  likePlayingTrack: (state, action)=> {
    state.currentTrack.liked = action.payload
    if (state.playerSource === null) return
    likeSourceTrack(state, state.playerSource, state.currentTrack, action.payload)
  },
  likeCurrentTrack: (state, action)=> { state.currentTrack.liked = action.payload }
}

// Async thunks ----------
export const fetchFrontPage = () => async (dispatch) => {
  const { data } = await axios.get(`${URL.api}/front`);
  dispatch(Actions.setFrontPage(data));
}

export const fetchArtistTracks = (artistId) => async (dispatch) => {
  const { data } = await axios.get(`${URL.api}/artist/${artistId}/tracks`);
  dispatch(Actions.setQueue(data.tracks));
  dispatch(Actions.playNext());
}

export const fetchAlbumTracks = (albumId)=> async (dispatch)=> {
  const { data } = await axios.get(`${URL.api}/album/${albumId}`);
  data.tracks.forEach(track=> {
    track.album = { images: data.images }
    track.artists = data.artists
  })
  console.log(data.tracks)
  dispatch(Actions.setQueue(data.tracks));
  dispatch(Actions.playNext());
}

export const playTrack = (track, source=null) => async (dispatch)=> {
  dispatch(Actions.playTrack(track, source))
  const palette = await Vibrant.from(pickImage(track.album.images)).getPalette()
  const colors = {}
  Object.keys(palette).forEach(color=> {
    colors[color.toLowerCase()] = palette[color].getRgb()
  })
  dispatch(Actions.setTrackColor(colors))
}

export const likeTrack = (track, value, source=null)=> async (dispatch, getState)=> {
  const savedTrack = await saveLikeTrack(track, value)
  dispatch(Actions.updateLikedList(savedTrack, value ? 'add' : 'remove'))
  if (source !== null) dispatch(Actions.updateLikeTrackSource(savedTrack, source, value))
  const currentTrack = getState().currentTrack
  if (currentTrack && track.id === currentTrack.id)
    dispatch(Actions.likeCurrentTrack(value))
}

export const likeCurrentTrack = (track, value)=> async (dispatch)=> {
  const savedTrack = await saveLikeTrack(track, value)
  dispatch(Actions.updateLikedList(savedTrack, value ? 'add' : 'remove'))
  dispatch(Actions.likePlayingTrack(value))
}

export const saveLikeTrack = async (track, value)=> {
  const { data } = await axios.post(URL.api + '/playlist/track/liked', {
    track_id: track.id,
    add: !!value,
  })
  // const copy = { ...track, liked: !!value }
  // value && (copy.PlaylistTrack = { created_at: data.time })
  return data.track
}

// Api request ----------
export const fetchTrack = async (id)=> {
  const {data} = await axios.get(URL.api + '/track/' + id)
  return data
}

// Helpers --------------
function setInitialPositions(queue) {
  queue.forEach((track, index) => {
    track.position = index;
  });
}

function likeSourceTrack(state, source, track, value) {
  const [pointer, lastProp] = getPointer(state, source)
  console.log('pointer called')
  const index = pointer[lastProp].findIndex(elem=> elem.id === track.id)
  pointer[lastProp][index].liked = value
}

function getPointer(state, source) {
  const props = source.split('.')
  let pointer, lastProp
  if (props.length > 1) {
    pointer = state
    for (let i=0; i<props.length-1; i++)
      pointer = pointer[props[i]]
    lastProp = props[props.length - 1]
  }
  else { pointer = state; lastProp = source }
  return [pointer, lastProp]
}

// Slice creation ----------
export const rootSlice = createSlice({
  name: 'henry',
  initialState,
  reducers,
})

export const Actions = rootSlice.actions;
export const Reducer = rootSlice.reducer;