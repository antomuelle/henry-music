import React, { useRef, useEffect } from 'react';
import { MainContainer, LeftPanel, RightPanel, Texto } from '../styles/MainLanding'
import deportivo from '../assets/deportivo.jpg'
// import laboral from '../assets/laboral.jpg'
import listas from '../assets/listas.png'
import { Slide, Zoom } from 'react-reveal';



function MainLanding() {


    return (
        <MainContainer> 
            <LeftPanel>
                <Texto>
                    "ENERGIZA TUS ENTRENAMIENTOS CON MÚSICA SIN INTERRUPCIONES"
                </Texto>
                <img src={listas} alt="listas" />
            </LeftPanel>
            <RightPanel>
                <Zoom >
                    <img src={deportivo} alt="deporte" />
                </Zoom >
            </RightPanel>
        </MainContainer>
    )
}

export default MainLanding