import { AxesHelper, GridHelper } from 'three'
import { PerspectiveCamera, useHelper } from '@react-three/drei'
import React from 'react'


function ObjectHelper(props) {

    // const camera = useRef()
    // useHelper(camera, THREE.CameraHelper, 1, 'hotpink')

    // const user = useRef()
    // useHelper(user, THREE.AxesHelper, 10)

    return (
        <mesh>
            <primitive object={new AxesHelper(props.axesHelper != undefined ? props.axesHelper : 10)} />
            <primitive 
                object={new GridHelper(props.gridHelperSize != undefined ? props.gridHelperSize : 10,
                props.gridHelperDivisions != undefined ? props.gridHelperDivisions : 10)} />
            {/* <PerspectiveCamera ref={camera}/> */}
        </mesh>
    )
}

export default ObjectHelper