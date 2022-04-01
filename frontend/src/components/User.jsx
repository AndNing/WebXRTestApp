import React from 'react'
import Pointer from './Pointer'
import ObjectHelper from './ObjectHelper'
import { Html, Text } from "@react-three/drei"


function User(props) {
    // console.log('User')
    // console.log(props.orientation.ax + ' ' + props.orientation.ay + ' ' + props.orientation.az)
    

    return (
        <mesh
            position={[0, -0.5, 0]}
            rotation={[props.orientation.ax, props.orientation.ay, props.orientation.az]}>
                <ObjectHelper axesHelper={2} gridHelperSize={5} gridHelperDivisions={4}></ObjectHelper>
            <Pointer 
                position={[0, -0.5, 0]}
                rotation={[-Math.PI/2, 0, 0]}
                />
            {/* <Html distanceFactor={10}>
            <div className="content">
                <h3>{'Device : ' + props.deviceOrientation.alpha.toFixed(1) + ' ' + props.deviceOrientation.beta.toFixed(1) + ' ' + props.deviceOrientation.gamma.toFixed(1)}</h3>
            </div>
            </Html> */}
        </mesh>
    )
}

export default User