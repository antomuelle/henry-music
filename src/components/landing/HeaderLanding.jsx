import React from 'react'
import { HeaderContainer, TextContainer, HeaderText, ImageContainer } from '../../styles/HeaderLanding'
import mujer from '../../assets/mujer.jpg'
import { Slide, Fade } from 'react-reveal';
import { useAuth0 } from "@auth0/auth0-react"


function HeaderLanding() {

    const { loginWithRedirect } = useAuth0()
    return (
        <HeaderContainer>
            <Slide left>
                <ImageContainer>
                    <img src={mujer} alt="Imagen grande" />
                </ImageContainer>
            </Slide>
            <TextContainer>
                <HeaderText>
                    ESCUCHA LA MÚSICA COMO DEBERÍA SONAR.
                </HeaderText>
                <button onClick={() => loginWithRedirect()}>Disfrutar gratis</button>
                <p>
                    Streaming sin suscripciones y sin anuncios
                </p>
            </TextContainer>
        </HeaderContainer>
    )
}

export default HeaderLanding