import styled from 'styled-components'


 export const FooterContainer = styled.footer`
  background-color: #000;
  color: whitesmoke;
  padding: 20px;
  text-align: center;
  height: auto;
  display: flex;

  @media (max-width: 480px) {
    width: auto;
    flex-direction: column;
  }
`;

export const CompanyName = styled.h3`
  font-size: 60px;
  font-weight: 400;
  margin-bottom: 10px;
  text-align: start;
  color: #f1f1f1;
  margin-left: 20px;
   flex: 0 0 40%;


  p{
    font-size: 18px;
    width: 60%;
    color: gray;
    text-align: start;
  }

  @media (max-width: 768px) {
    flex: 1;
    font-size: 30px;
    p{
        font-size: 14px;
        width: 100%;
    }

  }



`;


export const Imagenes = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0px;
  padding-top: 30px;
  padding-right: 50px;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0px;
  }

  div p:first-of-type {padding-top: .5em}
  div p:last-of-type {color: gray}
  p{
    font-size: large;
    color: whitesmoke;
  }

  a{
    color: #0077B5;
  }
  img {
    object-fit: cover;
    width: 120px;
    height: 120px;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 70%);
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    align-items: center;
    text-align: center;
    padding: 0;
    margin-left: 30px;
    padding-top: 20px;

    img{
      width: 70px;
      height: 70px;
    }
    p{
      font-size: 13px;
    }

    a{
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0;
    div {width: calc(50% - 1rem);}
    img {width: 80%;height: 80%}
    p, a {font-size: 1rem;}
  }
`;


export const ContactInfo = styled.div`
  margin-bottom: 5px;
  color: #f1f1f1;
  font-size: 25px;

  span{
    font-size: 15px;
    color: #333;
  }

  @media (max-width: 768px) {

    span{
        font-size: 11px;
        color: #333;
    }
    p{
        font-size: 13px;
    }
  }
`;

export const SocialMediaLinks = styled.ul`
  list-style: none;
  padding: 0;


  img{
    filter: grayscale(50%);
    width: 40px;
  }

  li {
    display: inline-block;
    margin-right: 10px;
  }

`;

export const CopyRight = styled.p`
  font-size: 14px;
  color: gray;
  padding-bottom: 1rem;
  @media (max-width: 768px) {}
`;

export const Container = styled.div`
  background-color: #000;

`

