import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png'
import '../styles/sidebar.css'
let init = 0

export default function SideBar() {
  function minimize(event) {
    document.querySelector('.sidebar').classList.toggle('minimize')
    // event.currentTarget.querySelector('i').classList.toggle('rotate')
    init = init === 180 ? 0 : 180
    event.currentTarget.querySelector('i').style.transform = 'rotate(' + init + 'deg)'
  }

  return (
  <div className='_column sidebar'>
    <img className="logo" src={logo} alt="music logo" />
    <div className="menu">
      <NavLink to="/">
        <i className="fas fa-home"></i>
        <span>Home</span></NavLink>
      <NavLink to="/search">
        <i className="fas fa-search"></i>
        <span>Search</span></NavLink>
      <NavLink to="/collection">
        <i className="fas fa-layer-group"></i>
        <span>Your Library</span></NavLink>
      <NavLink to="/collection/liked">
        <i className="fas fa-heart"></i>
        <span>Liked Songs</span></NavLink>
    </div>
    <div onClick={minimize} className="shink">
      <i className="fas fa-square-caret-left"></i></div>
  </div>
  )
}