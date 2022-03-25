import React from 'react'
import { useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import helvFont from '../assets/fonts/helvetiker_bold.typeface.json'

function Label(props) {
    const font = useLoader(FontLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json')
    const parameters = {'font': font}

    return (
        <mesh
            visible
            {...this.props}
            >
                <textGeometry args={[props.label,parameters]}/>
                <meshStandardMaterial color={'red'}/>
        </mesh>
    )
}

export default Label