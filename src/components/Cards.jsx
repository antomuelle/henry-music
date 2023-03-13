import { useDispatch } from 'react-redux'
import { Actions, fetchArtistTracks } from '../slice'
import '../styles/cards.css'
import { pickImage } from '../lib/utils'

export function Circle({artist}) {
  const dispatch = useDispatch()
  return (
  <div className='_column circle' onClick={()=> { dispatch(fetchArtistTracks(artist.id)) }}>
    <div className='_ratio _1-1'>
      {!artist.images.length && console.log(artist)}
      <img src={pickImage(artist.images)} alt={artist.name} />
    </div>
    <p className='name'>{artist.name}</p>
  </div>
  )
}

export function Card({track}) {
  const dispatch = useDispatch()
  
  function setTrack() { dispatch(Actions.playTrack(track))}
  return (
  <div className='_column card' onClick={setTrack}>
    <div className='_ratio _1-1'>
      <img src={pickImage(track.album.images, 'm')} alt={track.name} />
    </div>
    <div className="text">
      <p className='name'>{track.name}</p>
      <p className='artist'>{track.artists.map(a=> a.name).join(', ')}</p>
    </div>
  </div>
  )
}