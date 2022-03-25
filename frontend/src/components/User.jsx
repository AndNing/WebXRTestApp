import React from 'react'
import Pointer from './Pointer'


function User(props) {

    return (
        <mesh
            position={[0, 0, 0]}>
            <Pointer 
                position={[3, 2, 0]}
                rotation={[0 , 0, -Math.PI / 2]}/>
        </mesh>
    )
}

export default User