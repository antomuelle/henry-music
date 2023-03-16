import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Player from '../components/Player'
import SideBar from '../components/SideBar'
import '../styles/app.css'

function App() {
  useEffect(()=> {
    window.onresize = setVarProperties
    setVarProperties()
    return ()=> (window.onresize = null)
  }, [])

  return (
  <div className='_columns main'>
    <SideBar />
    <div className='_column floor'>
      <Header />
      <Outlet />
    </div>
    <Player />
  </div>
  )
}

// set css custom properties for vh and vw according to window size and the height of the player and sidebar
let properties
function setVarProperties() {
  properties = [
    ['--vh', window.innerHeight / 100 + 'px'],
    ['--vw', window.innerWidth / 100 + 'px'],
    ['--player-height', document.querySelector('.player').offsetHeight + 'px'],
    ['--sidebar-height', document.querySelector('.sidebar .wrapper').offsetHeight + 'px']
  ]
  properties.forEach(([key, value])=> { document.documentElement.style.setProperty(key, value) })
}

export default App