import '../styles/playlist.css'
import album_img from '../assets/album.png'
import { useDispatch, useSelector } from "react-redux";
import { Loading, PlayIcon, TracksTable } from "../components/Shorts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ROUTES, URL } from '../lib/constants';
import axios from 'axios';
import { Actions } from '../slice';
import { Track } from '../components/Cards';

export default function Playlist() {
  const likedTracks = useSelector((state) => state.likedTracks);
  const { id } = useParams()
  const dispatch = useDispatch()
  const [state, setState] = useState({
    playlist: null,
    loading: false,
  })
  const isLiked = id === ROUTES.liked
  useEffect(()=> {
    if (isLiked) {
      if (likedTracks === null) {
        setLoading(true)
        fetchLiked()
      }
      else setState({ playlist: {tracks: likedTracks}, loading: false })
    }
    else {
      // setLoading(true)
    }
  }, [id])

  function setLoading(value) { setState((state)=> ({ ...state, loading: value})) }
  function playLikedList() {
    dispatch(Actions.setQueue(likedTracks))
    dispatch(Actions.playNext())
  }
  async function fetchLiked() {
    const { data } = await axios.get(URL.likedTracks)
    dispatch(Actions.setLikedTracks(data.tracks))
    setState({ playlist: data, loading: false})
  }

  if (!state.playlist) return <div className="playlist _100h"><Loading show={true} /></div>
  const playlistTitle = isLiked ? 'Songs you like' : state.playlist.name
  return (
  <div className="playlist">
    <Loading show={state.loading} />
    <div className="_columns header">
      <img src={album_img} alt="playlist" className='_column _narrow' />
      <div className='_column data'>
        <p>Playlist, {isLiked ? likedTracks.length : state.playlist.tracks.length} songs</p>
        <h2>{playlistTitle}</h2>
        <p><PlayIcon onTap={playLikedList} /> <i>Play this list</i></p>
      </div>
    </div>
    <div className='like-songs'>
      {likedTracks.map((track, i)=> <Track track={track} index={i+1} likeTime={true} key={i} />)}
    </div>
  </div>
  )
}