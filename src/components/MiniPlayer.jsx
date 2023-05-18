import '../styles/miniplayer.css'
import defaultCover from '../assets/album.png'
import { useEffect, useRef, useState } from 'react'
import { parseTime, pickImage, setCustomCssProps, showToast, useOnMounted, useOnUpdate } from '../lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Actions, likeCurrentTrack } from '../slice'
import { EVENTS, audio } from '../lib/constants'
import { Link, useNavigate } from 'react-router-dom'
import tinycolor from 'tinycolor2'
import { Tap } from './Shorts'

const MIN_TIME_PREV = 5
const shared = {
  dispatch: null,
  playAgain: false,
  repeat: false,
  showQueue: false
}

export function PlayerControls({audio}) {
  const dispatch = useDispatch()
  const repeat = useSelector(state=> state.repeat)
  const shuffle = useSelector((state)=> state.shuffle)
  const [playing, setPlaying] = useState(!audio.paused)

  useOnMounted(()=> {
    shared.dispatch = dispatch

    audio.addEventListener('pause', updatePlaying)
    audio.addEventListener('play', updatePlaying)

    return function clear() {
      audio.removeEventListener('pause', updatePlaying)
      audio.removeEventListener('play', updatePlaying)
    }
  })

  function updatePlaying() { setPlaying(!audio.paused) }
  function setRepeat() {
    const value = (repeat + 1) % 3
    audio.loop = (value === 1)
    shared.repeat = value
    shared.playAgain = (value === 2)
    dispatch(Actions.setRepeat(value))
  }

  return (
  <div className='_flex _content-center buttons play-buttons'>
    <button onPointerUp={()=> dispatch(Actions.toogleShuffle())}>
      <i className={'fas fa-shuffle'+(shuffle ? ' selected' : '')}></i></button>
    <button onPointerUp={Media.prevTrackOrRestart}><i className='fas fa-backward-step'></i></button>
    <Tap onTap={Media.togglePlay} elem={<button className='play-pause'>
      <i className={'fas fa-circle-' + (playing ? 'pause' : 'play')}></i></button>} />
    <button onPointerUp={Media.nextTrack}><i className='fas fa-forward-step'></i></button>
    <button onPointerUp={setRepeat}>
      <i className={'fas fa-repeat'+(repeat ? ' selected' : '')}>
      {repeat === 2 && <span className='repeat-once'>1</span>}</i></button>
  </div>
  )
}

export default function MiniPlayer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentTrack = useSelector((state)=> state.currentTrack)
  const trackColor = useSelector(state=> state.trackColor)
  const meta = useRef(null)
  const [state, setState] = useState({
    playing: false,
    liked: false,
    color: '#161616'
  })

  const mounted = useOnMounted(()=> {
    shared.dispatch = dispatch
    meta.playing = false
    meta.lastTrackId = null

    audio.addEventListener('pause', updatePlaying)
    audio.addEventListener('play', updatePlaying)
    audio.oncanplay = ()=> { meta.playing && audio.play() }
    audio.onvolumechange = () => { setState(state=> ({ ...state, muted: audio.muted })) }
    audio.onerror = () => { showToast("We can't play this song"); dispatch(Actions.playNext()) }
    audio.onended = onPlayEnd

    return ()=> {
      audio.removeEventListener('pause', updatePlaying)
      audio.removeEventListener('play', updatePlaying)
      audio.oncanplay = null
      audio.onvolumechange = null
      audio.onended = null
      audio.onerror = null
      audio.pause()
    }
  })

  useOnUpdate(()=> {
    if (!currentTrack) return
    if (meta.lastTrackId === currentTrack.id) {
      // mejorar la siguiente linea pra trabajar solo con currentTrack y no con el estado y liked
      setState(state=> ({ ...state, liked: currentTrack.liked }))
      return
    }
    if (!meta.firtsTime) {
      setCustomCssProps()
      meta.firtsTime = true
    }
    meta.lastTrackId = currentTrack.id
    shared.playAgain = (shared.repeat === 2)
    audio.src = currentTrack.play_url
    setState(state=> ({ ...state, liked: currentTrack.liked, playing: (meta.playing = true) }))
    updateMediaMetadata(currentTrack)
    updatePositionState(audio)
  }, [currentTrack], mounted)

  useEffect(()=> {
    if (!trackColor) return
    let color = '#161616'
    if (window.innerWidth <= 420) {
      const tiny = tinycolor({
        r: trackColor.darkvibrant[0],
        g: trackColor.darkvibrant[1],
        b: trackColor.darkvibrant[2],
      })
      tiny.setAlpha(0.95)
      color = tiny.toRgbString()
      document.querySelector('meta[name="theme-color"]').setAttribute('content', color)
    }
    setState(state=> ({ ...state, color: color }))
  }, [trackColor])

  function updatePlaying() { setState(state=> ({ ...state, playing: !audio.paused })) }
  function onPlayEnd() {
    if (shared.repeat === 2 && shared.playAgain) {
      // entra aqui solo cuando state.repeat es 0 ó 2, cuando es 1 la propiedad audio.loop se encarga
      // de repetir el track y el evento onended no se dispara
      audio.currentTime = 0
      audio.play()
      shared.playAgain = false
      return
    }
    dispatch(Actions.playNext())
  }
  function toggleLiked(ev) {
    ev.stopPropagation()
    dispatch(likeCurrentTrack(currentTrack, !state.liked))
    setState(state=> ({ ...state, liked: !state.liked }))
    document.dispatchEvent(new CustomEvent(EVENTS.liked, {detail: currentTrack}))
  }
  function toggleQueue(ev) {
    ev.currentTarget.classList.toggle('active')
    shared.showQueue = !shared.showQueue
    document.dispatchEvent(new CustomEvent(EVENTS.queue, {detail: (shared.showQueue)}))
  }
  function onPlayerPointed(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    if (window.innerWidth <= 420)
      navigate('player')
  }
  const volume = audio ? (audio.muted ? 0 : audio.volume) : 0

  if (!currentTrack) return <div className="miniplayer"></div>
  return (
  <div className="miniplayer visible"
    style={{backgroundColor: state.color}}>
    <div onPointerUp={onPlayerPointed} className="data">
      {currentTrack && <>
      <Link to='player' onPointerUp={stopProp} className="cover"><img src={pickImage(currentTrack.album.images)} alt={currentTrack.name} /></Link>
      <div className="_text-left info">
        <div className="title"><Link to='player' onPointerUp={stopProp}>{currentTrack.name}</Link></div>
        <div className="artist">{currentTrack.artists.map(a=> a.name).join(', ')}</div>
      </div>
      <div>
        <p onPointerUp={toggleLiked} className='shine bubble liked' tabIndex="0">
          <i className={'fa'+(state.liked?'s':'r')+' fa-heart'}></i></p>
      </div>
      <div className='play'>
        <button onPointerUp={Media.togglePlay} className='play-pause'>
          <i className={'fas fa-circle-' + (state.playing ? 'pause' : 'play')}></i></button>
      </div></>}
    </div>
    <div className="controls">
      <TimeTabProgress audio={audio} />
      <PlayerControls audio={audio} />
    </div>
    <div className="extra">
      <div className="volume-control">
        <i onClick={()=> {audio.muted = !audio.muted}} className={'fas fa-volume-' + (state.muted || !audio?.volume ? 'xmark' : 'low')}></i>
        <TabProgress total={1} value={volume}
          onDrag={(value)=> {audio.volume = value; value > 0 && (audio.muted = false)}} />
      </div>
      <Tap onTap={toggleQueue} elem={<button className='queue-link'><i className="fas fa-list"></i></button>} />
    </div>
  </div>
  )
}

export function VolumeControl({ audio }) {
  const [muted, setMuted] = useState(audio.muted)
  useEffect(()=> {
    function onVolumeChange() { setMuted(audio.muted) }
    audio.addEventListener('volumechange', onVolumeChange)

    return ()=> { audio.removeEventListener('volumechange', onVolumeChange) }
  }, [])

  const volume = audio ? (audio.muted ? 0 : audio.volume) : 0

  return (
  <div className="volume-control">
    <i onClick={()=> {audio.muted = !audio.muted}} className={'fas fa-volume-' + (muted || !audio?.volume ? 'xmark' : 'low')}></i>
    <TabProgress total={1} value={volume}
      onDrag={(value)=> {audio.volume = value; value > 0 && (audio.muted = false)}} />
  </div>
  )
}

const stopProp = (ev)=> {ev.stopPropagation()}
const Media = {
  nextTrack() { shared.dispatch(Actions.playNext()) },
  togglePlay(ev) {
    if (ev.stopPropagation) ev.stopPropagation()
    audio.paused ? audio.play() : audio.pause()
  },
  prevTrackOrRestart() {
    if (audio.currentTime <= MIN_TIME_PREV) shared.dispatch(Actions.playPrevious())
    else audio.currentTime = 0
  },
}
function updateMediaMetadata(track) {
  if (!('mediaSession' in navigator)) return
  const artwork = track.album.images.map(img=> ({ src: img.url, sizes: img.width + 'x' + img.height, type: 'image/jpeg' }))
  if (!artwork.length) artwork.push({ src: defaultCover, sizes: '262x262', type: 'image/png' })
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.name,
    artist: track.artists.map(a=> a.name).join(', '),
    album: track.album.name,
    artwork: artwork,
  })
  navigator.mediaSession.setActionHandler('nexttrack', Media.nextTrack)
  navigator.mediaSession.setActionHandler('previoustrack', Media.prevTrackOrRestart)
  navigator.mediaSession.setActionHandler('play', Media.togglePlay)
  navigator.mediaSession.setActionHandler('pause', Media.togglePlay)
  navigator.mediaSession.setActionHandler('stop', ()=> { audio.pause(); audio.currentTime = 0 })
  navigator.mediaSession.setActionHandler('seekto', (details)=> {
    if (details.fastSeek && ('fastSeek' in audio)) {
      audio.fastSeek(details.seekTime)
      return
    }
    audio.currentTime = details.seekTime
  })
}

export function TimeTabProgress({audio}) {
  const touching = useRef(false)
  const [state, setState] = useState({
    time: 0,
    timeSeek: 0,
    duration: 0,
    loaded: 0,
    timeSeekable: 0
  })

  const isMounted = useOnMounted(()=> {
    function onTimeUpdate() { update('time', audio.currentTime) }
    function onProgress() {
      if (audio.buffered.length > 0)
        update('loaded', audio.buffered.end(audio.buffered.length - 1))
      else
        update('loaded', audio.duration)
    }

    audio.addEventListener('durationchange', setDuration)
    audio.addEventListener('loadedmetadata', setDuration)
    audio.addEventListener('playing', setDuration)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('progress', onProgress)
    audio.duration && update('duration', audio.duration)
    onTimeUpdate()
    onProgress()

    return ()=> {
      audio.removeEventListener('durationchange', setDuration)
      audio.removeEventListener('loadedmetadata', setDuration)
      audio.removeEventListener('playing', setDuration)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('progress', onProgress)
    }
  })
  useOnUpdate(()=> {
    if (touching.current) return
    update('timeSeek', state.time)
  }, [state.time], isMounted)

  function update(prop, value) { setState(state=> ({ ...state, [prop]: value})) }
  function setDuration(value = 0) {
    // value can be null, number or an event
    if (isNaN(audio.duration)) value = 0
    if (typeof value !== 'number') value = audio.duration
    updatePositionState(value)
    setState(state=> ({ ...state, duration: value }))
  }

  return (
  <div className='time-progress'>
    <div className="text">{parseTime(state.timeSeek)}</div>
    <TabProgress value={state.time} total={state.duration} meter={state.loaded}
      onDragStart={()=> touching.current = true}
      onDragEnd={(value)=> {audio.currentTime = value; touching.current = false} }
      onDrag={(value)=> update('timeSeek', value)} />
    <div className="text">{parseTime(state.duration)}</div>
  </div>
  )
}

export function TabProgress({value, total, meter=null, onDragStart=null, onDrag=null, onDragEnd=null }) {
  const touching = useRef(false)
  const element = useRef(null)
  const [slicer, setSlicer] = useState(0)
  const [advanced, setAdvanced] = useState(value)
  
  useEffect(()=> ()=> {
    element.current && (element.current.onmousedown = null)
    window.onmousemove = null
    window.onmouseup = null
  }, [])
  useEffect(()=> {
    // if (total === 0) {value = 0, total = 1;}
    setAdvanced(value)
    if (touching.current) return
    setSlicer(value / total * 100)
  }, [value, total])
  
  function onMouseDown(ev) {
    ev.preventDefault()
    startDrag(ev)
    window.onmousemove = moveSlicer
    window.onmouseup = (event)=> {
      window.onmousemove = null
      window.onmouseup = null
      endDrag(event)
    }
  }
  function startDrag(ev) {
    touching.current = true
    element.current.classList.add('dragging')
    moveSlicer(ev)
    typeof onDragStart === 'function' && onDragStart()
  }
  function endDrag(ev) {
    touching.current = false
    element.current.classList.remove('dragging')
    const percent = ev.type.startsWith('touch') ? slicer : moveSlicer(ev)
    setAdvanced(percent * total / 100)
    typeof onDragEnd === 'function' && onDragEnd(percent * total / 100, percent)
  }
  function moveSlicer(ev) {
    if (ev.type.startsWith('touch')) ev = ev.touches[0]
    const { left, width } = element.current.getBoundingClientRect()
    let percent = (ev.clientX - left) / width * 100
    percent = percent < 0 ? 0 : percent > 100 ? 100 : percent
    typeof onDrag === 'function' && onDrag(percent * total / 100, percent)
    setSlicer(percent)
    return percent
  }

  if (total <= 0) return <div className='tab-progress'><div className="progress"></div></div>
  return (
  <div className='tab-progress' ref={element}
    onMouseDown={onMouseDown}
    onTouchStart={startDrag}
    onTouchEnd={endDrag}
    onTouchMove={moveSlicer}>
    <Progress value={advanced} total={total} meter={meter} />
    <div style={{left: slicer + '%'}} className="slicer"><p></p></div>
  </div>
  )
}

export function Progress({ value, total = 100, meter = null }) {
  // if (total === 0) value = 0, total = 1
  if (total <= 0) return <div className='progress'></div>
  return (
  <div className='progress'>
    {meter != null && <p className="meter" style={{width: (meter / total * 100 + '%')}}></p>}
    <p className="progress-bar" style={{width: (value / total * 100) + '%'}}></p>
  </div>
  )
}

function updatePositionState(audio, duration = 0) {
  if (!('setPositionState' in navigator.mediaSession)) return

  if (isNaN(audio.duration) || audio.duration === Infinity || duration === 0) {
    navigator.mediaSession.setPositionState()
    return
  }
  navigator.mediaSession.setPositionState({
    duration: audio.duration,
    playbackRate: audio.playbackRate,
    position: audio.currentTime
  })
}