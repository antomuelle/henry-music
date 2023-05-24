import React from 'react'

import { FooterContainer, CopyRight, SocialMediaLinks, CompanyName, ContactInfo, Imagenes, Container } from '../../styles/FooterLanding'
import { Element } from 'react-scroll';
import yt from '../../assets/yt.png'
import fb from '../../assets/fb.png'
import git from '../../assets/github.png'
import juan from '../../assets/team/bianchi.jpg'
import antonio from '../../assets/team/antonio.jpg'


function FooterLanding() {
    return (
        <>
            <Element name="footer">
                <FooterContainer>
                    <CompanyName>
                        HMusic
                        <p>
                            HMusic es un proyecto en conjunto como programadores Full-Stack junior, diseñado para captar la atención de posibles reclutadores y mostrar nuestras habilidades y pasión por la programación.
                        </p>
                    </CompanyName>
                    {/* <Imagenes>
                        <div>
                            <img src={antonio} alt="muelle" />
                            <p>Antonio Muelle</p>
                            <p style={{ color: '#333' }}> Back-End</p>
                            <a href="https://www.linkedin.com/in/antoniomuelle/" target="_blank">LinkedIn</a>
                        </div>
                        <div>
                            <img src={juan} alt="bianchi" />
                            <p>Juan Bianchi</p>
                            <p style={{ color: '#333' }}> Front-End</p>
                            <a href="https://www.linkedin.com/in/juan-jose-bianchi/" target="_blank">LinkedIn</a>
                        </div>
                    </Imagenes> */}
                </FooterContainer>
                <Container>
                    <ContactInfo>
                        <span>¡Descubre las diversas formas de utilizar nuestra API en tus proyectos!</span>
                        <p> hmusic@gmail.com</p>
                    </ContactInfo>
                    <SocialMediaLinks>
                        <li>
                            <a href="#"><img src={yt} alt="" /></a>
                        </li>
                        <li>
                            <a href="#"><img src={fb} alt="" /></a>
                        </li>
                        <li>
                            <a href="#"><img src={git} alt="" /></a>
                        </li>
                    </SocialMediaLinks>
                    <CopyRight>&copy; 2023 Henry Music. Todos los derechos reservados.</CopyRight>
                </Container>
            </Element>
        </>

    )
}

export default FooterLanding