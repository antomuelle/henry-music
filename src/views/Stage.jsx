import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Actions, shared } from "../slice"
import App from "./App"
import LandingOne from "./LandingOne"

export default function Stage() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [ready, setReady] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoading) return
    (async () => {
      shared.dispatch ??= dispatch
      if (isAuthenticated) {
        const token = await getAccessTokenSilently()
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        dispatch(Actions.setToken(token))
      }
      setReady(true)
      dispatch(Actions.setAuthenticated(isAuthenticated))
    })()
  }, [isLoading])

  return (
  <>
    {!ready ?
      <Loading /> :
      (isAuthenticated ? <App /> : <LandingOne />)}
  </>
  )
}

function Loading() {
  return (
  <div className="_flex-center _100h">
    <div style={{color: 'var(--yellow6)'}}>
      <h3 style={{paddingBottom: '.5em'}}>Loading...</h3>
      <i className="fas fa-circle-notch fa-spin _size-2" style={{"--fa-animation-duration":"1s"}}></i>
    </div>
  </div>
  )
}