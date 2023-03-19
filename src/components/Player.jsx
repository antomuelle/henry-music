import '../styles/player.css'
import defaultCover from '../assets/album.png'
import { useEffect, useRef, useState } from 'react'
import { parseTime, pickImage, useOnMounted, useOnUpdate } from '../lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Actions } from '../slice'

const MIN_TIME_PREV = 5
let audio

export default function Player() {
  const dispatch = useDispatch()
  const currentTrack = useSelector((state)=> state.currentTrack)
  const shuffle = useSelector((state)=> state.shuffle)
  const meta = useRef(null)// { playing: false, }
  const [currentTime, setCurrentTime] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [state, setState] = useState({
    playing: false,
    duration: 0,
    muted: false,
    repeat: 0,// 0: off, 1: on, 2: once
    playAgain: false,
  })

  const mounted = useOnMounted(()=> {
    audio = new Audio()
    setCurrentTime(0)
    setPlaying(false)
    audio.ondurationchange = setDuration
    audio.onloadedmetadata = setDuration
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
    audio.oncanplay = () => { meta.playing && audio.play() }
    audio.onprogress = () => { setLoaded(audio.buffered.end(audio.buffered.length - 1)) }
    audio.onpause = setPlaying
    audio.onplay = setPlaying
    audio.onvolumechange = () => { setState(state=> ({ ...state, muted: audio.muted })) }
    audio.onplaying = () => {console.log('onplaying');setDuration()}
    audio.onended = onPlayEnd
    audio.onseeked = () => console.log('onseeked')
    audio.onloadstart = () => console.log('onloadstart')
    audio.onloadeddata = () => console.log('onloadeddata')
    audio.onerror = () => console.log('onerror')
    audio.onstalled = () => console.log('onstalled')
    audio.onabort = () => console.log('onabort')
    return ()=> {
      audio.ondurationchange = null
      audio.onloadedmetadata = null
      audio.ontimeupdate = null
      audio.onloadstart = null
      audio.onloadeddata = null
      audio.oncanplay = null
      audio.onprogress = null
      audio.onpause = null
      audio.onplay = null
      audio.onplaying = null
      audio.onseeked = null
      audio.onended = null
      audio.onerror = null
      audio.onstalled = null
      audio.onabort = null
      audio.pause()
      audio.src = null
      audio = null
    }
  })

  useOnUpdate(()=> {
    if (!currentTrack) return
    setLoaded(0)
    setCurrentTime(0)
    setPlaying(true)
    setDuration(0)
    setState(state=> ({ ...state, playAgain: state.repeat === 2 }))
    audio.src = currentTrack.play_url
    updateMediaMetadata(currentTrack)
  }, [currentTrack], mounted)

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
  function updatePositionState(duration = null) {
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

  function prevTrackOrRestart() {
    if (audio.currentTime <= MIN_TIME_PREV) dispatch(Actions.playPrevious())
    else audio.currentTime = 0
  }
  function nextTrack() { dispatch(Actions.playNext()) }
  function onPlayEnd() {
    // entra aqui solo cuando state.repeat es 0 ó 2, cuando es 1 la propiedad audio.loop se encarga de repetir
    // el track y el evento onended no se dispara
    setState(state=> {
      if (state.repeat === 2 && state.playAgain) {
        audio.currentTime = 0
        audio.play()
        return { ...state, playAgain: false }
      }
      else {
        nextTrack()
        return { ...state }
      }
    })
  }
  function togglePlay() { audio.paused ? audio.play() : audio.pause() }
  function setRepeat() {
    setState(state=> {
      const repeat = (state.repeat + 1) % 3
      audio.loop = repeat === 1
      return { ...state, repeat, playAgain: repeat === 2 }
    })
  }
  function setDuration(value = null) {
    // value can be null, number or an event
    if (isNaN(audio.duration)) value = 0
    if (typeof value !== 'number') value = audio.duration
    updatePositionState(value)
    setState(state=> ({ ...state, duration: value }))
  }
  function setPlaying(value = null) {
    value ??= !audio.paused
    setState((state)=> ({ ...state, playing: (meta.playing = value) }))
  }
  const volume = audio ? (audio.muted ? 0 : audio.volume) : 0

  return (
  <div className='player'>
    <div className="data">
      {currentTrack && <>
      <div className="cover"><img src={pickImage(currentTrack.album.images)} alt={currentTrack.name} /></div>
      <div className="_text-left info">
        <div className="title">{currentTrack.name}</div>
        <div className="artist">{currentTrack.artists.map(a=> a.name).join(', ')}</div>
      </div>
      <p><i className='far fa-heart'></i></p> </>}
    </div>
    <div className="controls">
      <TimeProgress time={currentTime} total={state.duration} loaded={loaded} />
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

export function TimeProgress({ time, total, loaded, }) {
  const touching = useRef(false)
  const [timeSeekable, setTimeSeekable] = useState(0)
  useEffect(()=> {
    if (touching.current) return
    setTimeSeekable(time)
  }, [time])

  return (
  <div className='time-progress'>
    <div className="text">{parseTime(timeSeekable)}</div>
    <TabProgress value={time} total={total} meter={loaded}
      onDragStart={()=> touching.current = true}
      onDragEnd={(value)=> {audio.currentTime = value; touching.current = false} }
      onDrag={(value)=> setTimeSeekable(value)} />
    <div className="text">{parseTime(total)}</div>
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