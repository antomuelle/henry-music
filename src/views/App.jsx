import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import MiniPlayer from '../components/MiniPlayer'
import SideBar from '../components/SideBar'
import { setCustomCssProps } from '../lib/utils'
import '../styles/app.css'

function App() {
  useEffect(()=> {
    window.onresize = setCustomCssProps
    setCustomCssProps()
    return ()=> (window.onresize = null)
  }, [])

  return (
  <div className='_columns main'>
    <SideBar />
    <div className='_column floor'>
      <Header />
      <Outlet />
    </div>
    <MiniPlayer />
  </div>
  )
}

export default App