import React from 'react'
import Pointer from './Pointer'
import ObjectHelper from './ObjectHelper'


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
        </mesh>
    )
}

export default User