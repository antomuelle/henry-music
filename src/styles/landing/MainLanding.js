import styled from 'styled-components'

export const MainContainer = styled.div`
  display: flex;
  height: 90vh;
  width: 100%;
  overflow-x: auto; 
  padding-bottom: 0px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const Texto = styled.h1`
  font-family: Impact, sans-serif;
  font-size: 60px;
  color: whitesmoke;   
  text-align: center;
  margin-left: 10px;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 10px;
    margin-top: 30px;
    margin-left: 0;
  }
`;

export const LeftPanel = styled.div`
  flex: 1;
  background: rgb(12,20,20);
  background: linear-gradient(0deg, rgba(12,20,20,1) 0%, rgba(12,20,20,1) 100%);

 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 70%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    height: 50vh;
    align-items: center;
    order: 2
  }
`;

export const RightPanel = styled.div`
  flex: 2;
  background: rgb(12,20,20);
  background: linear-gradient(0deg, rgba(12,20,20,1) 0%, rgba(12,20,20,1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 25% 100%);
  }

  @media (max-width: 768px) {
    height: auto;

    img{
        clip-path: none;
        filter: grayscale(100%);

    }
  }

`