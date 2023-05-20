import React from 'react'
import { NavContainer, Logo, NavbarLinks, NavbarItem, NavLink } from '../styles/NavLanding'
import logo from '../assets/logo.png'
import { useAuth0 } from "@auth0/auth0-react"
import { Link } from 'react-scroll';


function NavLanding() {

    const { loginWithRedirect } = useAuth0()
    return (
        <NavContainer>
            <Logo src={logo} alt="Logo" />
            <h2>H <span>MUSIC</span> </h2>
            <NavbarLinks>
                <NavbarItem>
                    <Link  to="footer" smooth={true} duration={1000}>
                        <NavLink>¿Quiénes somos?</NavLink>
                    </Link>

                </NavbarItem>
                <NavbarItem>
                    <NavLink href="#"><button onClick={() => loginWithRedirect()}>Iniciar sesión</button></NavLink>
                </NavbarItem>
            </NavbarLinks>
        </NavContainer>
    )
}

export default NavLanding
