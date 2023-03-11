import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Player from '../components/Player'
import SideBar from '../components/SideBar'
import '../styles/app.css'

function App() {

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

export default App
