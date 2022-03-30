import { useXRFrame } from '@react-three/xr'
import * as THREE from 'three'
import React, {useState} from 'react'

function ComponentHelper(props) {
    let counter = 0
    const [gotTransform, setGotTransform] = useState(false)

    const toDegrees = (radians) => radians * 180 / Math.PI

    useXRFrame((time, xrFrame) => {
        // do something on each frame of an active XR session
        // if (!gotTransform) {
        if ((Math.floor(time)) % 10 == 0) {
            const xrsession = xrFrame.session
            xrsession.requestReferenceSpace('local').then((refspace) => {
                let viewerPose = xrFrame.getViewerPose(refspace)
                let rigidtransform = viewerPose.transform
                // if (rigidtransform !== null) {
                //     // console.log('Got transform')
                //     setGotTransform(true)
                // }
                // else {
                //     return
                // }

                let orientation = rigidtransform.orientation
                const quaternion = new THREE.Quaternion()
                quaternion.set(orientation.x,orientation.y,orientation.z,orientation.w)
                const euler = new THREE.Euler()
                euler.setFromQuaternion(quaternion)
                let x = toDegrees(euler.x)
                let y = toDegrees(euler.y)
                let z = toDegrees(euler.z)

                // let x = euler.x
                // let y = euler.y
                // let z = euler.z

                // console.log('Viewer: ' + x + ' : ' + y + ' : ' + z)
                props.onOrientationUpdate({x:x,y:y,z:z})

            })
        }
      })

      return (
          <mesh visible={false}></mesh>
      )
}

export default ComponentHelper