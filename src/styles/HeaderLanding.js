import styled from 'styled-components'

export const HeaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  background: rgb(120,243,243);
  background: linear-gradient(0deg, rgba(120,243,243,1) 0%, rgba(23,25,25,1) 0%);
  margin-top: 90px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    width: 100%;
    padding-bottom: 20px;
    margin-top: 60px;
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  button{
  width: 380px;
  height: 45px;
  background-color: #0ff;
  color: black;
  font-weight: 600;
  font-size: 23px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 5px;
  }

  button:hover {
  background-color: #0af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

  p{
    color: #999999;
    align-items: center;
    text-align: center;
    width: 70%;
    font-size: 12px;
  }

  @media (max-width: 768px) {
        width: 100%;  
       display: flex;
       justify-content: start;
       margin-top: 10px;
       align-items: center;
       button {
        font-size: 15px;
        width: 90%;
        height: 30%;
       }
       p{
        font-size: 10px;
       }
    }

`;

export const HeaderText = styled.h1`
font-family: Impact,sans-serif;
font-size: 60px;
color: whitesmoke;   
text-align: center;
margin-bottom: 60px;
padding-right: 40px;

@media (max-width: 768px) {
     font-size: 30px;
     margin-bottom: 10px;
     text-align: center;
     padding: 0;
  }
`;


export const ImageContainer = styled.div`
  flex: 1;
  height: 100%;
  width: auto;
  clip-path: polygon(0% 0%, 85% 0%, 100% 100%, 100% 100%, 0% 100%);

  img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    clip-path: none;
  }
`;
