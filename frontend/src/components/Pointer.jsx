import React, { useRef } from 'react';
import { useHelper} from '@react-three/drei'
import {BoxHelper } from 'three'
import ObjectHelper from './ObjectHelper';

function Pointer(props) {
    const cone = useRef()
    useHelper(cone, BoxHelper, 'cyan')

    return (
        <mesh
            {...props}>
            <mesh
                visible
                ref={cone}
            >
                <coneGeometry args={[0.1,0.2,32]}/>
                <meshStandardMaterial color={'red'}/>
            </mesh>
            <ObjectHelper axesHelper={2} gridHelperSize={2} gridHelperDivisions={4}/>
        </mesh>
    )
}

export default Pointer