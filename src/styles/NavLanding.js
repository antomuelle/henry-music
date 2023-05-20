import styled from 'styled-components';

export const NavContainer = styled.nav`
  background-color: black;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  height: auto;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  letter-spacing: 1px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999; 

  h2 {
    font-size: 30px;
    color: white;
    font-weight: 300;
    display: flex;
    justify-content: start;
    width: 100%;
    margin-left: 5px;
    letter-spacing: 1px;
  }

  span {
    font-weight: 500;
    font-size: 30px;
    margin: 0;
    letter-spacing: 3px;
  }

  @media (max-width: 768px) {
   display: flex;
   justify-content: space-between;
    align-items: center;
    padding: 0px;
    height: auto;
    width: 100%;
    letter-spacing: 0px;

    h2 {
      display: none;
    }
  }
`;

export const Logo = styled.img`
  width: 70px;
  margin-left: 50px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 60px;
    margin-left: 25px;
  }
`;

export const NavbarLinks = styled.ul`
  display: flex;
  justify-content: end;
  list-style: none;
  padding-right: 30px;
  width: 100%;
  @media (max-width: 768px) {
    padding-right: 15px;

  }
`;

export const NavbarItem = styled.li`
  margin-right: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-right: 20px;
  }
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  justify-content: center;

  button {
    background-color: white;
    color: black;
    width: 220px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #eaeaea;
    }
  }

  @media (max-width: 768px) {
           font-size: 13px;
           display: flex;
          
           
           button{
            width: auto;
            height: auto;
           }
           
  }
;
`