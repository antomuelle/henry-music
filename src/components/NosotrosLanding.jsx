import React from 'react'
import tablet from '../assets/tablet.png'
import { NosotrosContainer, Image, Text } from '../styles/NosotrosLanding'

function NosotrosLanding() {
    return (
        <NosotrosContainer>
            <Image src={tablet} alt="Description" />
            <Text>ESCUCHA EN TODOS TUS <span>DISPOSITIVOS</span>.</Text>
            <p>Disfruta de tu música favorita en tu teléfono, tablet y computadora. Accede a una amplia biblioteca de canciones y crea tus propias listas de reproducción para cada ocasión</p>
        </NosotrosContainer>
    )
}

export default NosotrosLanding