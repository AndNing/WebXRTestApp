import './App.css'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ARCanvas } from '@react-three/xr'
import { VRCanvas } from '@react-three/xr'
import User from './components/User'
import CameraControls from './components/CameraControls'
import ObjectHelper from './components/ObjectHelper'

function App() {

  return (
    <div className="App" style={{ width: "100vw", height: "100vh"}}>
        <Canvas>
          <CameraControls/>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <User/>
          <ObjectHelper/>
        </Canvas>
    </div>
  );
}

export default App
