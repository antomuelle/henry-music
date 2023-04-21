import '../styles/shorts.css'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { parseTime, pickImage } from '../lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useDispatch } from 'react-redux'
import { likeTrack } from '../slice'
dayjs.extend(relativeTime)

export const Table = ({ headers, data, actions, className = '' })=> {
  return (
  <table className={'table ' + className}>
    <thead>
      <tr>
        { headers.map((header, index)=> <th key={index}>{header}</th>) }
        { actions && <th></th> }
      </tr>
    </thead>
    <tbody>
      { data && data.map((row, index)=>
        <tr key={index}>
          { Object.keys(row).map((key, index)=>
            <td key={index}>{row[key]}</td>
          )}
          { actions && <td>{actions(row)}</td> }
        </tr>
      )}
    </tbody>
  </table>
  )
}

export const TracksTable = ({data, className = ''})=> {  
  return (
  <table className={'table ' + className}>
    <thead>
      <tr>
        <th className='_text-right'>#</th>
        <th></th>
        <th>Title</th>
        <th>Album</th>
        <th>Date Added</th>
        <th><i className="fas fa-clock"></i></th>
      </tr>
    </thead>
    <tbody>
      { data && data.map((track, index)=>
        <tr key={index}>
          <td className='_text-right'>{index + 1}</td>
          <td><LikeButton track={track} /></td>
          <td className='title'>
            <img src={pickImage(track.album.images)} alt={track.name} />
            <div>
            <p>{track.name}</p>
            <p>{track.artists.map(a=> a.name).join(', ')}</p>
            </div>
          </td>
          <td>{track.album.name}</td>
          <td>{dayjs(track.PlaylistTrack.created_at).fromNow()}</td>
          <td>{parseTime(track.duration, true)}</td>
        </tr>
      )}
    </tbody>
  </table>
  )
}

export const PlayIcon = ({play = true, onTap=null})=> {
  return (
  <span className='play-pause' onPointerUp={(ev)=> {onTap && onTap()}}>
    <i className={'fas fa-circle-' + (play ? 'play' : 'pause')}></i>
  </span>
  )
}

export const LikeButton = ({ track, source=null, onLiked=null })=> {
  const dispatch = useDispatch()
  function toogleLiked(ev) {
    ev.stopPropagation()
    dispatch(likeTrack(track, !track.liked, source))
    onLiked && onLiked(track)
  }

  return (
  <p onPointerUp={toogleLiked} className='shine bubble liked' tabIndex="0">
    <i className={'fa'+(track.liked?'s':'r')+' fa-heart'}></i></p>
  )
}

export const Modal = ({children, redirect})=> {
  const navigate = useNavigate()
  function outerClose(ev) {
    if (ev.currentTarget === ev.target) {
      document.dispatchEvent(new Event('modal:close'))
      redirect && navigate(redirect)
    }
  }

  return (
  <div onClick={outerClose} className="_modal _flex-center modal">
    <div className="content">
      <p className="close-btn">X</p>
      { children }
    </div>
  </div>
  )
}

export const Loading = ({ show })=> {
  if (!show) return null
  return (
  <div className="_flex-center loading">
    <div className="loader-wraper">
      <div className="loader">
        <p className="loader loader-inner"></p>
      </div>
    </div>
  </div>
  )
}

export const Toast = ({ time = 2500 })=> {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  function showToast(ev) {
    setShow(true)
    setMessage(ev.detail)
    setTimeout(() => {
      setShow(false);
    }, time);
  }

  useEffect(()=> {
    document.addEventListener('toast', showToast)
    return ()=> { document.removeEventListener('toast', showToast) }
  })
  return <span className={'toast' + (show ? ' show' : ' none')}>{message}</span>
}

export const Errors = ({ errors })=> {
  if (errors === null || !Object.keys(errors).length)
    return null
  if (typeof errors === 'string')
    return <div className="row errors"><p className='cell'></p><p className='cell'><i className="danger">!</i> {errors}</p></div>
  return Object.keys(errors).map((key)=>
    <div className='row errors' key={key}>
      <p className="cell"><i className="danger">!</i> { key }</p>
      <ul className="cell _font-300">
        { errors[key].map((error, index)=> <li key={index}>{ error }</li>) }
      </ul>
    </div>
  )
}