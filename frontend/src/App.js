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
      position : {coords : {latitude : 0, longitude : 0}},
    }
    this.geolocationOptions = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true
    }
    this.updatePosition = this.updatePosition.bind(this)
    this.updatePositionError = this.updatePositionError.bind(this)
    this.updateUserLocations = this.updateUserLocations.bind(this)
  }

  updatePosition(position) {
    if ((position.coords.latitude !== this.state.position.coords.latitude) || (position.coords.longitude !== this.state.position.coords.longitude)) {
      console.log('Position Update')
      console.log('Latitude is :', position.coords.latitude);
      console.log('Longitude is :', position.coords.longitude);
      this.setState({
        position: position
      })

      const requestOptions = {
        method : 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }
      fetch('/geolocation', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data.response))
    }
  }

  updatePositionError(error) {
    console.log("Geolocation Error")
  }

  updateUserLocations() {
    fetch('/userlocations')
    .then(response => response.json())
    .then(data => {
      let userLocationCoords = {latitude : data.latitude, longitude : data.longitude}
      this.setState({ userLocation : {coords : userLocationCoords }})
      this.updatePointer(userLocationCoords,this.state.position.coords)
    })
  }

  calculateBearing(destLat,destLon,startLat,startLon) {
    const toRadians = (degrees) => degrees * Math.PI / 180
    const toDegrees = (radians) => radians * 180 / Math.PI

    destLat = toRadians(destLat)
    destLon = toRadians(destLon)
    startLat = toRadians(startLat)
    startLon = toRadians(startLon)

    let X = Math.cos(destLat) * Math.sin(destLon - startLon)
    let Y = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon)
    let bearing = toDegrees(Math.atan2(X,Y))
    return bearing
  }

  updatePointer(userLocationCoords, positionCoords) {
    let bearing = this.calculateBearing(userLocationCoords.latitude, userLocationCoords.longitude, positionCoords.latitude, positionCoords.longitude)
    console.log("Bearing Update")
    console.log(bearing)
  }

  componentDidMount() {
    console.log("Mounting")
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(this.updatePosition)
      navigator.geolocation.watchPosition(this.updatePosition, this.updatePositionError, this.geolocationOptions)
    }

    this.timerID = setInterval(
      () => this.updateUserLocations(),
      5000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
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