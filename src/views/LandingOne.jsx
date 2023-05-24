import React, { useState, useEffect } from 'react'
import NavLanding from '../components/landing/NavLanding'
import HeaderLanding from '../components/landing/HeaderLanding'
import MainLanding from '../components/landing/MainLanding'
import styled from 'styled-components';
import NosotrosLanding from '../components/landing/NosotrosLanding';
import FooterLanding from '../components/landing/FooterLanding';

const Cursor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #254f48;
  pointer-events: none;
  z-index: 9999;
`;

function LandingOne() {

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <Cursor style={{ top: cursorPosition.y, left: cursorPosition.x }} />
      <NavLanding />
      < HeaderLanding />
      <NosotrosLanding />
      <MainLanding />
      <FooterLanding />

    </>
  )
}

export default LandingOne