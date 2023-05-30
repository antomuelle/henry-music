import React from 'react'

import { FooterContainer, CopyRight, SocialMediaLinks, CompanyName, ContactInfo, Imagenes, Container } from '../../styles/landing/FooterLanding'
import { Element } from 'react-scroll';
import yt from '../../assets/yt.png'
import fb from '../../assets/fb.png'
import git from '../../assets/github.png'
import juan from '../../assets/team/bianchi.jpg'
import antonio from '../../assets/team/antonio.jpg'
import abigail from '../../assets/team/abi.jpg'
import erick from '../../assets/team/erick.jpg'

function FooterLanding() {
    return (
        <>
            <Element name="footer">
                <FooterContainer>
                    <CompanyName>
                        HMusic
                        <p>
                            HMusic es un proyecto liberado al mundo con fines academicos y con mucho 🤍.
                            Esta desarrollado por un equipo de programadores que buscan hacerse un espacio en el mundo <b>"IT" </b>
                            y mostrar sus habilidades en este apasionante mundo.
                            No dudes en contactarnos!
                            {/* HMusic es un proyecto en conjunto como programadores Full-Stack junior, diseñado para captar la atención de posibles reclutadores y mostrar nuestras habilidades y pasión por la programación. */}
                        </p>
                    </CompanyName>
                    <Imagenes>
                        <div>
                            <img src={antonio} alt="muelle" />
                            <p>Antonio Muelle</p>
                            <p>Team Lead &<br />Main Developer</p>
                            <a href="https://www.linkedin.com/in/antoniomuelle/" target="_blank">LinkedIn</a>
                        </div>
                        <div>
                            <img src={juan} alt="bianchi" />
                            <p>Juan Bianchi</p>
                            <p>Frontend</p>
                            <a href="https://www.linkedin.com/in/juan-jose-bianchi/" target="_blank">LinkedIn</a>
                        </div>
                        <div>
                            <img src={abigail} alt="abigail" />
                            <p>Abigail Cortes</p>
                            <p>Backend</p>
                            <a href="https://www.linkedin.com/in/abigail-cort%C3%A9s-s%C3%A1nchez/" target="_blank">LinkedIn</a>
                        </div>
                        <div>
                            <img src={erick} alt="erick" />
                            <p>Erick Espinoza</p>
                            <p>Frontend</p>
                            <a href="https://www.linkedin.com/in/ericks-espinoza-g%C3%B3mez-58b9b8231/" target="_blank">LinkedIn</a>
                        </div>
                        
                    </Imagenes>
                </FooterContainer>
                <Container>
                    <p className="_py-1"></p>
                    <ContactInfo>
                        {/* <span>¡Descubre las diversas formas de utilizar nuestra API en tus proyectos!</span> */}
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