import '../styles/player.css'
import { useEffect, useRef, useState } from 'react'
import { parseTime, pickImage, useOnMounted, useOnUpdate } from '../lib/utils'
import { useSelector } from 'react-redux'

let audio

export default function Player() {
  const currentTrack = useSelector((state)=> state.currentTrack)
  const meta = useRef(null)// { playing: false, }
  const [currentTime, setCurrentTime] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [state, setState] = useState({
    playing: false,
    duration: 0,
    muted: false,
  })

  const mounted = useOnMounted(()=> {
    console.log('player mounted')
    audio = new Audio()
    setCurrentTime(0)
    setPlaying(false)
    audio.ondurationchange = setDuration
    audio.onloadedmetadata = setDuration
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime)
    audio.onloadstart = () => console.log('onloadstart')
    audio.onloadeddata = () => console.log('onloadeddata')
    audio.oncanplay = () => { meta.playing && audio.play() }
    audio.onprogress = () => { setLoaded(audio.buffered.end(audio.buffered.length - 1)) }
    audio.onpause = () => { setPlaying() }
    audio.onplay = () => { setPlaying() }
    audio.onvolumechange = () => { setState(state=> ({ ...state, muted: audio.muted })) }
    audio.onplaying = () => console.log('onplaying')
    audio.onseeked = () => console.log('onseeked')
    audio.onended = () => console.log('onended')
    audio.onerror = () => console.log('onerror')
    audio.onstalled = () => console.log('onstalled')
    audio.onabort = () => console.log('onabort')
    return ()=> {
      console.log('player unmounted')
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
    audio.src = currentTrack.play_url
    audio.play().then(()=> updateMediaMetadata(currentTrack))
  }, [currentTrack], mounted)

  function updateMediaMetadata(track) {
    if (!('mediaSession' in navigator)) return
    // navigator.mediaSession.setActionHandler('nexttrack', ()=> console.log('nexttrack'))
    const artwork = track.album.images.map(img=> ({ src: img.url, sizes: img.width + 'x' + img.height, type: 'image/jpeg' }))
    console.log('artwork', artwork)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: track.artists.map(a=> a.name).join(', '),
      album: track.album.name,
      artwork: artwork,
    })
  }

  function togglePlay() { audio.paused ? audio.play() : audio.pause() }
  function setDuration(value = null) {
    setState(state=> ({ ...state, duration: (typeof value === 'number' ? value : audio.duration) }))
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
        <button><i className='fas fa-shuffle'></i></button>
        <button><i className='fas fa-backward-step'></i></button>
        <button onClick={togglePlay} className='play-pause'>
          <i className={'fas fa-circle-' + (state.playing ? 'pause' : 'play')}></i></button>
        <button><i className='fas fa-forward-step'></i></button>
        <button><i className='fas fa-repeat'></i></button>
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