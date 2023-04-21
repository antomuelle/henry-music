import { useDispatch, useSelector } from 'react-redux'
import '../styles/player.css'
import { parseTime, pickImage, setCustomCssProps, useOnMounted, useOnUpdate } from '../lib/utils'
import { useRef, useState } from 'react'
import { playTrack } from '../slice'
import axios from 'axios'
import { URL, audio } from '../lib/constants'
import { useParams } from 'react-router-dom'
import { PlayerControls, TimeTabProgress } from '../components/MiniPlayer'

function getStyle(color) {
  const rgb = color.darkvibrant.join(', ')
  return {
    backgroundImage: `linear-gradient(180deg, rgb(${rgb}) 0, rgba(0, 0, 0, 0) 80%)`
  }
}

export default function Player() {
  const dispatch = useDispatch()
  const { trackId } = useParams()
  const currentTrack = useSelector(state=> state.currentTrack)
  const trackColor = useSelector(state=> state.trackColor)
  const cover = useRef(null)
  const [style, setStyle] = useState({ backgroundImage: 'none' })
  const isMounted = useOnMounted(()=> {
    if (!currentTrack) {
      axios.get(URL.api + '/track/' + trackId)
        .then(response=> { dispatch(playTrack(response.data))})
    }
    trackColor && setStyle(getStyle(trackColor))
    const miniplayer = document.querySelector('.main')
    miniplayer.classList.add('hide-mini')
    setCustomCssProps()

    return function() {
      console.log('repeti')
      miniplayer.classList.remove('hide-mini')
      setCustomCssProps()
    }
  }, [])
  useOnUpdate(()=> {
    if (!trackColor) return
    setStyle(getStyle(trackColor))
  }, [trackColor], isMounted)

  function onImgLoad() { setStyle(getStyle(cover.current)) }

  if (!currentTrack) return <div className="player"></div>
  return (
  <div className='player' style={style}>
    <div className="limit content">
      <p className='_text-center image'>
        <img ref={cover} src={pickImage(currentTrack.album.images, 1000)} alt="track image" crossOrigin='anonymous' />
      </p>
      <div className="meta">
        <div className="wrapper">
          <p>Reproduciendo:</p>
          <h1 className='text-dots'>{currentTrack.name}</h1>
          <div className="_mb-1 data">
            <p>{currentTrack.artists.map(a=> a.name).join(', ')}</p>
            <p>{currentTrack.album.name}</p>
            <p><i className="fas fa-clock"></i> {parseTime(currentTrack.duration, true)}</p>
          </div>
        </div>
        <PlayerControls audio={audio} />
        <TimeTabProgress audio={audio} />
      </div>
    </div>
  </div>
  )
}