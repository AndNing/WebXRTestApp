import { useXRFrame } from '@react-three/xr'
import * as THREE from 'three'
import React, {useState} from 'react'

const throttle = (context, func, limit) => {
    let lastFunc;
    let lastRan;
    return (...args) => {
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

function ComponentHelper(props) {
    let counter = 0
    const [attachedListener, setAttachedListener] = useState(false)

    const toDegrees = (radians) => radians * 180 / Math.PI

    const onSelect = function(event) {
        props.onDestinationUpdate()
    }

    const onEnd = function(event) {
      props.onXRSessionEnd()
    }

    useXRFrame((time, xrFrame) => {
        // do something on each frame of an active XR session
        // if (!gotTransform) {
        if ((Math.floor(time)) % 100 == 0) {
          const xrsession = xrFrame.session

          if (!attachedListener) {
              xrsession.addEventListener('select', onSelect)
              xrsession.addEventListener('end', onEnd)
              props.onXRSessionStart()
              setAttachedListener(true)
          }
          
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

              // let position = rigidtransform.position
              // console.log('Position: ' + position.x + ' : ' + position.y + ' : ' + position.z)
          })
        }
      })

      return (
          <mesh visible={false}></mesh>
      )
}

export default ComponentHelper