import '../styles/search.css'
import axios from "axios"
import { useRef, useState } from "react"
import { EVENTS, URL, swiperOpts } from "../lib/constants"
import { Album, Artist, Track } from '../components/Cards'
import { useOnMounted } from '../lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'

const DELAY = 400, MIN_LEN = 2;

export default function Search() {
  const [state, setState] = useState({
    input: '',
    result: null,
    loading: false
  })
  const [tracks, setTracks] = useState([])
  const timer = useRef(0)
  useOnMounted(()=> {
    document.addEventListener(EVENTS.liked, onLike)
    return ()=> { document.removeEventListener(EVENTS.liked, onLike) }
  })
  
  function setLoading(value) { setState(state=> ({ ...state, loading: value })) }
  function onLike(ev) { updateLike(ev.detail); }
  function updateLike(track) {
    setTracks((tracks)=> {
      const index = tracks.findIndex(elem=> elem.id === track.id)
      if (index < 0) return tracks
      const copy = [...tracks]
      copy[index] = { ...tracks[index], liked: !track.liked }
      return copy
    })
  }
  function onKeyDown(ev) {
    if (ev.code === 'Enter' || ev.code === 13) { search(state.input) }
    else if (ev.code === 'Escape') { setState({ ...state, input: '' }) }
  }
  function onChange(ev) {
    const value = ev.target.value
    setState({ ...state, input: value })
    if (value.length >= MIN_LEN) {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        search(value)
      }, DELAY);
    }
    else { setState({ input: value, result: null, loading: false }) }
  }
  async function search(value) {
    if (value.target) value = state.input
    if (value.length < MIN_LEN) return
    try {
      setLoading(true)
      const {data} = await axios.get(URL.api + '/track/search', {params: {q: value}})
      setState(state=> ({ ...state, result: data, loading: false }))
      setTracks(data.tracks)
    }
    catch (_) { return null }
  }
  
  return (
  <div className='_text-left _p-1'>
    <div className="search-box">
      <p onPointerUp={search} className='_button'><i className="fas fa-search"></i></p>
      <p><input type="search" className='_input' placeholder='Search'
        value={state.input}
        onChange={onChange}
        onKeyUp={onKeyDown} /></p>
    </div>
    { state.result &&
    <div>
      { !!state.result.artists?.length &&
      <><h6 className='_mb-1'>Artists</h6>
        <Swiper { ...swiperOpts }>
        {state.result.artists.map(artist=> <SwiperSlide key={artist.id}><Artist artist={artist} /></SwiperSlide>)}
        </Swiper>
      </>}
      {tracks &&
      <><h6 className='_my-1'>Songs</h6>
        <div className='tracks'>
          {tracks.map(track=> <Track track={track} onLiked={updateLike} minimal={true} key={track.id} />)}
        </div>
      </>}
      {!!state.result.albums?.length &&
      <><h6 className='_my-1'>Albums</h6>
        <div className="_columns _have-2-onmobile flow">
        {state.result.albums.map(album=> <Album album={album} key={album.id} />)}
        </div>
      </>}
    </div>
    }
  </div>
  )
}