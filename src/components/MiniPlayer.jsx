import '../styles/miniplayer.css'
import defaultCover from '../assets/album.png'
import { useEffect, useRef, useState } from 'react'
import { parseTime, pickImage, setCustomCssProps, showToast, useOnMounted, useOnUpdate } from '../lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Actions, likeCurrentTrack } from '../slice'
import { EVENTS, audio } from '../lib/constants'
import { Link } from 'react-router-dom'
import tinycolor from 'tinycolor2'

const MIN_TIME_PREV = 5

export function PlayerControls({audio}) {
  const dispatch = useDispatch()
  const currentTrack = useSelector((state)=> state.currentTrack)
  const shuffle = useSelector((state)=> state.shuffle)
  const meta = useRef(null)
  const [state, setState] = useState({
    repeat: 0,
    playing: !audio.paused,
  })

  function update(prop, value) { setState(state=> ({ ...state, [prop]: value})) }

  const isMounted = useOnMounted(()=> {

  }, [])
  useOnMounted(()=> {
    meta.playing = false
    meta.playAgain = false
    meta.repeat = 0
    meta.lastTrackId = null

    function onCanPlay() { meta.playing && audio.play() }
    function onVolumeChange() { update('muted', audio.muted) }

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('pause', setPlaying)
    audio.addEventListener('play', setPlaying)
    audio.addEventListener('volumechange', onVolumeChange)

    return function clear() {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('pause', setPlaying)
      audio.removeEventListener('play', setPlaying)
      audio.removeEventListener('volumechange', onVolumeChange)
    }
  }, [currentTrack], isMounted)

  function prevTrackOrRestart() {
    if (audio.currentTime <= MIN_TIME_PREV) dispatch(Actions.playPrevious())
    else audio.currentTime = 0
  }
  function nextTrack() { dispatch(Actions.playNext()) }
  function togglePlay() { audio.paused ? audio.play() : audio.pause() }
  function setRepeat() {
    setState(state=> {
      const repeat = (state.repeat + 1) % 3
      audio.loop = repeat === 1
      meta.playAgain = repeat === 2
      return { ...state, repeat: (meta.repeat = repeat) }
    })
  }
  function setPlaying(value = null) {
    (typeof value !== 'boolean') && (value = !audio.paused)
    setState((state)=> ({ ...state, playing: (meta.playing = value) }))
  }

  return (
  <div className="play-controls">
    <div className='_flex _content-center buttons'>
      <button onPointerUp={()=> dispatch(Actions.toogleShuffle())}>
        <i className={'fas fa-shuffle'+(shuffle ? ' selected' : '')}></i></button>
      <button onPointerUp={prevTrackOrRestart}><i className='fas fa-backward-step'></i></button>
      <button onClick={togglePlay} className='play-pause'>
        <i className={'fas fa-circle-' + (state.playing ? 'pause' : 'play')}></i></button>
      <button onPointerUp={nextTrack}><i className='fas fa-forward-step'></i></button>
      <button onPointerUp={setRepeat}>
        <i className={'fas fa-repeat'+(state.repeat ? ' selected' : '')}>
        {state.repeat === 2 && <span className='repeat-once'>1</span>}</i></button>
    </div>
  </div>
  )
}

export default function MiniPlayer() {
  const dispatch = useDispatch()
  const currentTrack = useSelector((state)=> state.currentTrack)
  const trackColor = useSelector(state=> state.trackColor)
  const shuffle = useSelector((state)=> state.shuffle)
  const meta = useRef(null)
  const [state, setState] = useState({
    playing: false,
    duration: 0,
    muted: false,
    repeat: 0,// 0: off, 1: on, 2: once
    liked: false,
  })

  const mounted = useOnMounted(()=> {
    // audio = new Audio()
    meta.playing = false
    meta.playAgain = false
    meta.repeat = 0
    meta.lastTrackId = null
    meta.color = '#161616'
    setPlaying(false)
    audio.oncanplay = () => { meta.playing && audio.play() }
    audio.onpause = setPlaying
    audio.onplay = setPlaying
    audio.onvolumechange = () => { setState(state=> ({ ...state, muted: audio.muted })) }
    audio.onended = onPlayEnd
    audio.onerror = () => { showToast("Can't play this song"); dispatch(Actions.playNext()) }
    audio.onstalled = () => console.log('onstalled')
    audio.onabort = () => console.log('onabort')
    // audio.onseeked = () => console.log('onseeked')
    // audio.onloadstart = () => console.log('onloadstart')
    // audio.onloadeddata = () => console.log('onloadeddata')
    return ()=> {
      audio.oncanplay = null
      audio.onpause = null
      audio.onplay = null
      audio.onplaying = null
      audio.onended = null
      audio.onerror = null
      audio.onstalled = null
      audio.onabort = null
      audio.pause()
      audio.src = null
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
    setPlaying(true)
    setState(state=> ({ ...state, liked: currentTrack.liked }))
    meta.playAgain = meta.repeat === 2
    audio.src = currentTrack.play_url
    updateMediaMetadata(currentTrack)
  }, [currentTrack], mounted)

  useEffect(()=> {
    if (!trackColor) return
    if (window.innerWidth <= 420) {
      console.log('tamare')
      const color = tinycolor({
        r: trackColor.darkvibrant[0],
        g: trackColor.darkvibrant[1],
        b: trackColor.darkvibrant[2],
      })
      color.setAlpha(0.95).darken(5).toRgbString()
      meta.color = color
    }
    else {meta.color = '#161616'}
  }, [trackColor])

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
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
    navigator.mediaSession.setActionHandler('previoustrack', prevTrackOrRestart)
    navigator.mediaSession.setActionHandler('play', togglePlay)
    navigator.mediaSession.setActionHandler('pause', togglePlay)
    navigator.mediaSession.setActionHandler('stop', ()=> { audio.pause(); audio.currentTime = 0 })
    navigator.mediaSession.setActionHandler('seekto', (details)=> {
      if (details.fastSeek && ('fastSeek' in audio)) {
        audio.fastSeek(details.seekTime)
        return
      }
      audio.currentTime = details.seekTime
    })
  }

  function prevTrackOrRestart() {
    if (audio.currentTime <= MIN_TIME_PREV) dispatch(Actions.playPrevious())
    else audio.currentTime = 0
  }
  function nextTrack() { dispatch(Actions.playNext()) }
  function onPlayEnd() {
    // entra aqui solo cuando state.repeat es 0 ó 2, cuando es 1 la propiedad audio.loop se encarga
    // de repetir el track y el evento onended no se dispara
    if (meta.repeat === 2 && meta.playAgain) {
      audio.currentTime = 0
      audio.play()
      meta.playAgain = false
      return
    }
    dispatch(Actions.playNext())
  }
  function togglePlay() { audio.paused ? audio.play() : audio.pause() }
  function setRepeat() {
    setState(state=> {
      const repeat = (state.repeat + 1) % 3
      audio.loop = repeat === 1
      meta.playAgain = repeat === 2
      return { ...state, repeat: (meta.repeat = repeat) }
    })
  }
  function setPlaying(value = null) {
    (typeof value !== 'boolean') && (value = !audio.paused)
    setState((state)=> ({ ...state, playing: (meta.playing = value) }))
  }
  function toogleLiked() {
    dispatch(likeCurrentTrack(currentTrack, !state.liked))
    setState(state=> ({ ...state, liked: !state.liked }))
    document.dispatchEvent(new CustomEvent(EVENTS.liked, {detail: currentTrack}))
  }
  const volume = audio ? (audio.muted ? 0 : audio.volume) : 0

  if (!currentTrack) return <div className="miniplayer"></div>
  return (
  <div className="miniplayer visible"
    style={{backgroundColor: meta.color}}>
    <div className="data">
      {currentTrack && <>
      <div className="cover"><img src={pickImage(currentTrack.album.images)} alt={currentTrack.name} /></div>
      <div className="_text-left info">
        <div className="title"><Link to={'player/'+currentTrack.id}>{currentTrack.name}</Link></div>
        <div className="artist">{currentTrack.artists.map(a=> a.name).join(', ')}</div>
      </div>
      <div>
        <p onPointerUp={toogleLiked} className='shine bubble liked' tabIndex="0">
          <i className={'fa'+(state.liked?'s':'r')+' fa-heart'}></i></p>
      </div>
      <div className='play'>
        <button onClick={togglePlay} className='play-pause'>
          <i className={'fas fa-circle-' + (state.playing ? 'pause' : 'play')}></i></button>
      </div></>}
    </div>
    <div className="controls">
      <TimeTabProgress audio={audio} />
      <div className='_flex _content-center buttons'>
        <button onPointerUp={()=> dispatch(Actions.toogleShuffle())}>
          <i className={'fas fa-shuffle'+(shuffle ? ' selected' : '')}></i></button>
        <button onPointerUp={prevTrackOrRestart}><i className='fas fa-backward-step'></i></button>
        <button onClick={togglePlay} className='play-pause'>
          <i className={'fas fa-circle-' + (state.playing ? 'pause' : 'play')}></i></button>
        <button onPointerUp={nextTrack}><i className='fas fa-forward-step'></i></button>
        <button onPointerUp={setRepeat}>
          <i className={'fas fa-repeat'+(state.repeat ? ' selected' : '')}>
          {state.repeat === 2 && <span className='repeat-once'>1</span>}</i></button>
      </div>
      
    </div>
    <div className="extra">
      <div className="volume">
        <i onClick={()=> {audio.muted = !audio.muted}} className={'fas fa-volume-' + (state.muted || !audio?.volume ? 'xmark' : 'low')}></i>
        <TabProgress total={1} value={volume}
          onDrag={(value)=> {audio.volume = value; value > 0 && (audio.muted = false)}} />
      </div>
    </div>
  </div>
  )
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
  function setDuration(value = null) {
    console.log('call duration')
    // value can be null, number or an event
    if (isNaN(audio.duration)) value = 0
    if (typeof value !== 'number') value = audio.duration
    // updatePositionState(value)
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
  useEffect(()=> {
    return ()=> {
      element.current && (element.current.onmousedown = null)
      window.onmousemove = null
      window.onmouseup = null
    }
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

function updatePositionState(audio, duration = null) {
  if (!('setPositionState' in navigator.mediaSession)) return
  if (isNaN(audio.duration) || audio.duration === Infinity || duration === 0) {
    navigator.mediaSession.setPositionState(null)
    return
  }
  navigator.mediaSession.setPositionState({
    duration: audio.duration,
    playbackRate: audio.playbackRate,
    position: audio.currentTime
  })
}