import './App.css'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ARCanvas } from '@react-three/xr'
import { VRCanvas } from '@react-three/xr'
import User from './components/User'
import CameraControls from './components/CameraControls'
import ObjectHelper from './components/ObjectHelper'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position : {coords : {latitude : 0, longitude : 0}}
    }
    this.geolocationOptions = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true
    }
    this.updatePosition = this.updatePosition.bind(this)
    this.updatePositionError = this.updatePositionError.bind(this)

  }

  updatePosition(position) {
    // console.log('Position Update')
    // console.log('Latitude is :', position.coords.latitude);
    // console.log('Longitude is :', position.coords.longitude);

    this.setState({
      position: position
    })
  }

  updatePositionError(error) {
    console.log("Geolocation Error")
  }

  componentDidMount() {
    console.log("Mounting")
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(this.updatePosition)
      navigator.geolocation.watchPosition(this.updatePosition, this.updatePositionError, this.geolocationOptions)
    }
  }

  render() {
    return (
      <div className='App' style={{ width: '100vw', height: '100vh'}}>
          <Canvas>
            <CameraControls/>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <User/>
            <ObjectHelper/>
          </Canvas>
          <h1>{'Latitude: ' + this.state.position.coords.latitude + ' Longitude: ' + this.state.position.coords.longitude}</h1>
      </div>
    )
  }
}

export default App