import '../styles/cards.css'
import { useDispatch } from 'react-redux'
import { Actions, fetchAlbumTracks, fetchArtistTracks, fetchTrack, playTrack } from '../slice'
import { parseTime, pickImage } from '../lib/utils'
import { LikeButton, PlayIcon } from './Shorts'
import dayjs from 'dayjs'



export function Artist({artist}) {
  const dispatch = useDispatch()
  function playArtistSongs() { dispatch(fetchArtistTracks(artist.id)) }
  function gotoArtist(ev) {
    console.log('hecho')
  }
  function onPointer(ev) {
    const target = ev.currentTarget
    function onUp() {
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointermove', onMove)
      if (ev.target.nodeName === 'I') return
      gotoArtist(ev)
    }
    function onMove() {
      target.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointermove', onMove)
    }
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onUp)
  }

  return (
  <a className='_column' onPointerDown={onPointer} >
    <div className='card circle'>
    <div className='_ratio _1-1'>
      <img src={pickImage(artist.images, 'm')} alt={artist.name} />
      <PlayIcon onTap={playArtistSongs} />
    </div>
    <p className='name'>{artist.name}</p>
    <p className="type">Artist</p>
    </div>
  </a>
  )
}

export function Track({track, source=null, onLiked=null, index=null, minimal=false, likeTime=false}) {
  const dispatch = useDispatch()
  async function playThisTrack() {
    // dispatch(Actions.playTrack(minimal ? await fetchTrack(track.id) : track))
    dispatch(playTrack(minimal ? await fetchTrack(track.id) : track))
  }

  return (
  <div className="track">
    {index && <p className='enum'>{index}</p>}
    <div className="name">
      <div className="play">
        <button onPointerUp={playThisTrack}><i className="fas fa-play"></i></button>
      </div>
      <img src={pickImage(minimal ? track.images : track.album.images)} alt={track.name} />
      <div>
        <p>{track.name}</p>
        <p>{track.artists.map(a=> a.name).join(', ')}</p>
      </div>
    </div>
    {!minimal && <p className='album'>{track.album.name}</p>}
    {likeTime && <p className='time'>{dayjs(track.PlaylistTrack.created_at).fromNow()}</p>}
    <div className="like"><LikeButton track={track} source={source} onLiked={onLiked} /></div>
    {track.duration && <p className="duration">{parseTime(track.duration, true)}</p>}
  </div>
  )
}

export function Album({album}) {
  const dispatch = useDispatch()
  function playAlbumSongs() { dispatch(fetchAlbumTracks(album.id)) }
  function gotoAlbum(ev) {}

  return (
  <a className='_column card circle' onPointerUp={gotoAlbum}>
    <div className='_ratio _1-1'>
      <img src={pickImage(album.images, 'm')} alt={album.name} />
      <PlayIcon onTap={playAlbumSongs} />
    </div>
    <p className='name'>{album.name}</p>
    <p className="sub-name">{album.artists.map(a=> a.name).join(', ')}</p>
    <p className="type">Album</p>
  </a>
  )
}

export function Card({track, source}) {
  const dispatch = useDispatch()
  
  function setTrack() { dispatch(playTrack(track, source)) }
  return (
  <div className='_column card figure' onPointerUp={setTrack}>
    <LikeButton track={track} source={source} />
    <div className='_ratio _1-1'>
      <img src={pickImage(track.album.images, 'm')} alt={track.name} />
      <div className="play-cover"><i className="fas fa-play"></i></div>
    </div>
    <div className="text">
      <p className='name'>{track.name}</p>
      <p className='artist'>{track.artists.map(a=> a.name).join(', ')}</p>
    </div>
  </div>
  )
}