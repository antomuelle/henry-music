import '../styles/header.css'
import { useAuth0 } from "@auth0/auth0-react"
import { useSelector } from "react-redux"

export default function Header() {
  const trackColor = useSelector(state=> state.trackColor)
  const { user, logout } = useAuth0()
  
  return (
  <header style={{backgroundColor: !trackColor ? '#ffffff26' : `rgb(${trackColor.darkvibrant.join(', ')})`}}>
    <div className="nav">
      <i className="fas fa-caret-left"></i>
      <i className="fas fa-caret-right"></i>
    </div>
    <div className="dinamic"></div>
    <div className="profile">
      {user.picture ? <img src={user.picture} alt="user avatar" /> : <i className="fas fa-user"></i>}
      <span>{user.given_name}</span>
      <div className="wrapper">
        <p><span className='caret'></span></p>
        <ul className="opts">
          <li onPointerDown={()=> logout({logoutParams: {returnTo: `${window.location.protocol}//${window.location.host}`}})}>Sign out</li>
        </ul>
      </div>
    </div>
  </header>
  )
}