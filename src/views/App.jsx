import '../styles/app.css'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import MiniPlayer from '../components/MiniPlayer'
import SideBar from '../components/SideBar'
import { setCustomCssProps } from '../lib/utils'
import { PlayQueue } from '../components/PlayQueue'
import { EVENTS } from '../lib/constants'

function App() {
  const [showQueue, setShowQueue] = useState(false)
  useEffect(()=> {
    function onQueue(ev) { setShowQueue(ev.detail) }
    document.addEventListener(EVENTS.queue, onQueue)
    window.onresize = setCustomCssProps
    setCustomCssProps()

    return ()=> {
      window.onresize = null
      document.removeEventListener(EVENTS.queue, onQueue)
    }
  }, [])

  return (
  <div className='_columns main'>
    <SideBar />
    <div className='_column floor'>
      <Header />
      <Outlet />
    </div>
    <MiniPlayer />
    {showQueue && <PlayQueue />}
  </div>
  )
}

export default App