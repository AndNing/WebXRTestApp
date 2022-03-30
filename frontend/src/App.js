import './App.css'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ARCanvas } from '@react-three/xr'
import { VRCanvas } from '@react-three/xr'
import User from './components/User'
import CameraControls from './components/CameraControls'
import ObjectHelper from './components/ObjectHelper'
import ComponentHelper from './components/ComponentHelper'
import { Html, Text } from "@react-three/drei"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position : {coords : {latitude : 0, longitude : 0}},
      deviceOrientation: {alpha: 0, beta: 0, gamma: 0 },
      userLocation: {coords : {latitude : 0, longitude : 0}},
      pose: {ax: 0, ay: 0, az: 0},
      userAngle: {ax: 0, ay: 0, az: 0},
      bearing: 0,
      virtualBearing: 0
    }
    this.geolocationOptions = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true
    }

    this.rotationEvent = (event) =>  {
      // console.log('rotate')
      // console.log(event.alpha + ', ' + event.beta + ',' + event.gamma)
      this.setState({deviceOrientation: {alpha : event.alpha, beta : event.beta, gamma : event.gamma} })
      // console.log('Absolute Orientation: ' + event.absolute)
      // console.log('Device: ' + event.alpha + ' : ' + event.beta + ' : ' + event.gamma)
    }

    this.updatePosition = this.updatePosition.bind(this)
    this.updatePositionError = this.updatePositionError.bind(this)
    this.updateUserLocations = this.updateUserLocations.bind(this)
    this.rotationEvent = this.rotationEvent.bind(this)
    this.handleOrientationUpdate = this.handleOrientationUpdate.bind(this)
  }

  updatePosition(position) {
    if ((position.coords.latitude !== this.state.position.coords.latitude) || (position.coords.longitude !== this.state.position.coords.longitude)) {
      // console.log('Position Update')
      // console.log('Latitude is :', position.coords.latitude);
      // console.log('Longitude is :', position.coords.longitude);
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
      // .then(data => console.log(data.response))
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

  toRadians(degrees) {
    return degrees * Math.PI / 180
  }

  toDegrees(radians) {
    return radians * 180 / Math.PI
  }

  calculateBearing(destLat,destLon,startLat,startLon) {
    // const toRadians = (degrees) => degrees * Math.PI / 180
    // const toDegrees = (radians) => radians * 180 / Math.PI

    destLat = this.toRadians(destLat)
    destLon = this.toRadians(destLon)
    startLat = this.toRadians(startLat)
    startLon = this.toRadians(startLon)

    // console.log(destLat + ' ' + destLon + ' ' + startLat + ' ' + startLon)

    let X = Math.cos(destLat) * Math.sin(destLon - startLon)
    let Y = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon)
    let bearing = this.toDegrees(Math.atan2(X,Y))
    console.log('Bearing Real: ' + bearing)
    if (bearing < 0) {
      bearing = 360 + bearing
      console.log('Bearing real nonnegative: ' + bearing)
    }

    // Correct for difference in positive rotation direction between mobile and calculation method
    bearing = 360 - bearing
    return bearing
  }

  updatePointer(userLocationCoords, positionCoords) {
    let bearing = this.calculateBearing(userLocationCoords.latitude, userLocationCoords.longitude, positionCoords.latitude, positionCoords.longitude)
    this.setState({bearing: bearing})
    console.log("Bearing Update " + bearing)
  }

  handleOrientationUpdate(viewerOrientation) {
    let correctedViewerOrientation = viewerOrientation.z
    if (correctedViewerOrientation < 0) {
      correctedViewerOrientation = 360 + correctedViewerOrientation
    }

    this.setState({pose: {ax: viewerOrientation.x, ay: viewerOrientation.y, az: correctedViewerOrientation}})

    // console.log('Device: ' + this.state.deviceOrientation.alpha + ' : ' + 'Viewer: ' + viewerOrientation.z)
    // console.log('Device: ' + this.state.deviceOrientation.alpha + ' : ' + this.state.deviceOrientation.beta + ' : ' + this.state.deviceOrientation.gamma)




    let differenceAngle = this.state.deviceOrientation.alpha - correctedViewerOrientation
    let virtualBearingAngle = this.state.bearing - differenceAngle
    if (virtualBearingAngle > 360) {
      virtualBearingAngle = (virtualBearingAngle) % 360
    }
    else if (virtualBearingAngle < 0) {
      virtualBearingAngle = 360 + virtualBearingAngle
    }


    // console.log('Orientation Update')
    // console.log('Device Orientation: ' + this.state.deviceOrientation.alpha + ' Viewer Orientation: ' + correctedViewerOrientation)
    // console.log('Virtual Bearing: ' + virtualBearingAngle + ' Difference Angle: ' + differenceAngle)
    // virtualBearingAngle = virtualBearingAngle * Math.PI / 180


    this.setState({virtualBearing: virtualBearingAngle})
    this.setState({userAngle: {ax: 0, ay: this.toRadians(virtualBearingAngle), az: 0}})
    // this.setState({userAngle: {ax: 0, ay: this.toRadians(viewerOrientation.z), az: 0}})
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

    // rotationEvent = rotationEvent.bind(this)

    window.addEventListener('deviceorientationabsolute', this.rotationEvent)


  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  render() {
    return (
      <div className='App' style={{ width: '100vw', height: '100vh'}}>
          <ARCanvas>
            <CameraControls/>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <User orientation={{ax : this.state.userAngle.ax, ay: this.state.userAngle.ay, az : this.state.userAngle.az}} deviceOrientation={{alpha: this.state.deviceOrientation.alpha, beta: this.state.deviceOrientation.beta, gamma: this.state.deviceOrientation.gamma}}/>
            <ObjectHelper axesHelper={4} gridHelperSize={5} gridHelperDivisions={10}/>
            <ComponentHelper onOrientationUpdate={this.handleOrientationUpdate}></ComponentHelper>
            <React.Suspense fallback={null}>
              <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.5,0]}>
                <Text
                  scale={[0.1, 0.1, 1]}>
                  {'Device : ' + this.state.deviceOrientation.alpha.toFixed(1) + ' ' + this.state.deviceOrientation.beta.toFixed(1) + ' ' + this.state.deviceOrientation.gamma.toFixed(1)}
                  {'\nViewer : ' + this.state.pose.ax.toFixed(1) + ' ' + this.state.pose.ay.toFixed(1) + ' ' + this.state.pose.az.toFixed(1)}
                  {'\nBearing : ' + this.state.bearing}
                  {'\n Virtual Bearing : ' + this.state.virtualBearing}
                </Text>
              </mesh>
            </React.Suspense>
          </ARCanvas>

          {/* <h3>{'Latitude: ' + this.state.position.coords.latitude + ' Longitude: ' + this.state.position.coords.longitude}</h3>
          <h3>{'alpha: ' + this.state.deviceOrientation.alpha.toFixed(1) + ' beta: ' + this.state.deviceOrientation.beta.toFixed(1) + ' gamma: ' + this.state.deviceOrientation.gamma.toFixed(1)}</h3>
          <h3>{'ax: ' + this.state.pose.ax + ' ay: ' + this.state.pose.ay + ' az: ' + this.state.pose.az}</h3> */}
      </div>
    )
  }
}

export default App