import '../styles/player.css'
import { useSelector } from 'react-redux'
import { pickImage, setCustomCssProps, useOnMounted, useOnUpdate } from '../lib/utils'
import { useRef, useState } from 'react'
import { audio } from '../lib/constants'
import { Link } from 'react-router-dom'
import { PlayerControls, TimeTabProgress, VolumeControl } from '../components/MiniPlayer'
import { LikeButton, Loading } from '../components/Shorts'

function getStyle(color) {
  const rgb = color.darkvibrant.join(', ')
  return {
    backgroundImage: `linear-gradient(180deg, rgb(${rgb}) 20%, rgba(0, 0, 0, 0) 80%)`
  }
}

export default function Player() {
  const currentTrack = useSelector(state=> state.currentTrack)
  const trackColor = useSelector(state=> state.trackColor)
  const cover = useRef(null)
  const [style, setStyle] = useState({ backgroundImage: 'none' })
  const [state, setState] = useState({
    loading: false
  })
  const isMounted = useOnMounted(()=> {
    trackColor && setStyle(getStyle(trackColor))
    let miniplayer
    if (window.innerWidth < 420) {
      miniplayer = document.querySelector('.main')
      miniplayer.classList.add('hide-mini')
      setCustomCssProps()
    }

    return function() {
      miniplayer?.classList.remove('hide-mini')
      setCustomCssProps()
    }
  }, [])
  useOnUpdate(()=> {
    if (!trackColor) return
    setStyle(getStyle(trackColor))
  }, [trackColor], isMounted)
  useOnUpdate(()=> {
    if (!currentTrack) return
    if (!cover.initiated) {
      cover.current.onload = ()=> { setState(state=> ({ ...state, loading: false })) }
      cover.initiated = true
    }
    !cover.current.complete && setState(state=> ({ ...state, loading: true }))
  }, [currentTrack], isMounted)

  if (!currentTrack) return <div className="player"></div>
  return (
  <div className='player' style={style}>
    <div className="limit content">
      <div className='_text-center image'>
        <div className="envelope">
          <img ref={cover} src={pickImage(currentTrack.album.images, 1000)} alt="track image" crossOrigin='anonymous' />
          {trackColor && <Loading show={state.loading} style={{backgroundColor: `rgb(${trackColor.darkvibrant.join(', ')})`}} />}
          <p className="text-dots album-mobile"><i className="fas fa-compact-disc fa-xs"></i> {currentTrack.album.name}</p>
        </div>
      </div>
      <div className="meta">
        <div className="_mb-1 titles">
          <div className="wrapper">
            <h6 className='text-dots'>{currentTrack.name}</h6>
            <div className="data">
              <p className='text-dots'>{currentTrack.artists.map(a=> a.name).join(', ')}</p>
              <p className='text-dots'><i className="fas fa-square fa-2xs"></i> {currentTrack.album.name}</p>
            </div>
          </div>
          <div className='like-mobile'><LikeButton track={currentTrack} /></div>
        </div>
        <div className="_on-mobile">
          <div className="_text-center"><TimeTabProgress audio={audio} /></div>
          <PlayerControls audio={audio} />
          <div className='tools'>
            <VolumeControl audio={audio} />
            <Link to="/queue" className='queue-link'><i className="fas fa-list"></i></Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}