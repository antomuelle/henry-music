import styled from 'styled-components';

export const NosotrosContainer = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom, #434343 0%, black 70%);

  p {
    color: whitesmoke;
    font-size: 17px;
    width: 80%;
    padding-bottom: 80px;
  }

  @media (max-width: 768px) {
    height: auto;

    width: 100%;
  }
`;

export const Image = styled.img`
  width: 550px;
  max-width: 900px;
  height: 400px;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-width: 500px;
  }
`;

export const Text = styled.h1`
  font-family: Impact, sans-serif;
  font-size: 50px;
  color: whitesmoke;
  text-align: center;

  span {
    color: #78f3f3;
  }

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;
