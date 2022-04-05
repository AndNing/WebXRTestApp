import './App.css'
import React from 'react'
import { Canvas, useThree } from '@react-three/fiber'
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
      // Device Name
      deviceName: 'unnamed',
      // Geolocation of device
      deviceLocation: {coords : {latitude : 0, longitude : 0}},
      //Location Name
      destinationName: '',
      // Geolocation of desired destination
      destinationLocation: {coords : {latitude : 0, longitude : 0}},
      // Angle towards destination
      destinationAngle: {ax: 0, ay: 0, az: 0},
      // Device pose - alpha => z axis
      devicePose: { orientation: {alpha: 0, beta: 0, gamma: 0 }, position : {x : 0, y : 0, z : 0}},
      // Virtual pose
      virtualPose: {orientation: {ax: 0, ay: 0, az: 0}, position: {px : 0, py : 0, pz : 0}},
      // Desired bearing in world space
      realBearing: 0,
      // Desired bearing in virtual space
      virtualBearing: 0,
      destinationNumber: 0,
      numDestinations: 4
    }

    this.geolocationOptions = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true
    }

    this.rotationEvent = (event) =>  {
      this.setState({devicePose: {orientation: {alpha : event.alpha, beta : event.beta, gamma : event.gamma} }})
    }

    this.updatePosition = this.updatePosition.bind(this)
    this.updatePositionError = this.updatePositionError.bind(this)
    this.updateUserLocations = this.updateUserLocations.bind(this)
    this.rotationEvent = this.rotationEvent.bind(this)
    this.handleOrientationUpdate = this.handleOrientationUpdate.bind(this)
    this.handleDestinationUpdate = this.handleDestinationUpdate.bind(this)
    this.handleDeviceNameChange = this.handleDeviceNameChange.bind(this)
    this.handleXRSessionStart = this.handleXRSessionStart.bind(this)
    this.handleXRSessionEnd = this.handleXRSessionEnd.bind(this)
  }

  updatePosition(position) {
    if ((position.coords.latitude !== this.state.deviceLocation.coords.latitude) || (position.coords.longitude !== this.state.deviceLocation.coords.longitude)) {
      this.setState({
        deviceLocation: position
      })

      const requestOptions = {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: this.state.deviceName,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      }
      fetch('/device/' + this.state.deviceName, requestOptions)
      .then(response => response.json())
      // .then(data => console.log(data.response))
    }
  }

  updatePositionError(error) {
    console.log("Geolocation Error")
  }

  updateUserLocations() {
    fetch('/destinationlocations/' + this.state.destinationNumber)
    .then(response => response.json())
    .then(data => {
      let destinationLocationCoords = {latitude : data.latitude, longitude : data.longitude}
      this.setState({destinationName : data.name})
      this.setState({ destinationLocation : {coords : destinationLocationCoords }})
      this.setState({numDestinations: data.numDestinations})
      this.updatePointer(destinationLocationCoords,this.state.deviceLocation.coords)
    })
  }

  toRadians(degrees) {
    return degrees * Math.PI / 180
  }

  toDegrees(radians) {
    return radians * 180 / Math.PI
  }

  calculateBearing(destLat,destLon,startLat,startLon) {
    destLat = this.toRadians(destLat)
    destLon = this.toRadians(destLon)
    startLat = this.toRadians(startLat)
    startLon = this.toRadians(startLon)

    let X = Math.cos(destLat) * Math.sin(destLon - startLon)
    let Y = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon)

    let bearing = this.toDegrees(Math.atan2(X,Y))
    if (bearing < 0) {
      bearing = 360 + bearing
    }

    // Correct for difference in positive rotation direction between mobile and calculation method
    bearing = 360 - bearing
    return bearing
  }

  updatePointer(userLocationCoords, positionCoords) {
    let bearing = this.calculateBearing(userLocationCoords.latitude, userLocationCoords.longitude, positionCoords.latitude, positionCoords.longitude)
    this.setState({realBearing: bearing})
  }

  handleOrientationUpdate(viewerOrientation) {
    let correctedViewerOrientation = viewerOrientation.z
    if (correctedViewerOrientation < 0) {
      correctedViewerOrientation = 360 + correctedViewerOrientation
    }

    this.setState({virtualPose: {orientation: {ax: viewerOrientation.x, ay: viewerOrientation.y, az: correctedViewerOrientation}}})

    let differenceAngle = this.state.devicePose.orientation.alpha - correctedViewerOrientation
    let virtualBearingAngle = this.state.realBearing - differenceAngle
    if (virtualBearingAngle > 360) {
      virtualBearingAngle = (virtualBearingAngle) % 360
    }
    else if (virtualBearingAngle < 0) {
      virtualBearingAngle = 360 + virtualBearingAngle
    }

    this.setState({virtualBearing: virtualBearingAngle})
    this.setState({destinationAngle: {ax: 0, ay: this.toRadians(virtualBearingAngle), az: 0}})
  }

  handleDestinationUpdate() {
    this.setState((state) => ({
      destinationNumber: (state.destinationNumber + 1) % state.numDestinations
    }))
    this.updateUserLocations()
  }

  handleDeviceNameChange(event) {
    this.setState({deviceName: event.target.value})
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.updatePosition)
      // navigator.geolocation.watchPosition(this.updatePosition, this.updatePositionError, this.geolocationOptions)
    }
  }

  handleXRSessionStart(event) {
    const requestOptions = {
      method : 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.deviceName,
        latitude: this.state.deviceLocation.coords.latitude,
        longitude: this.state.deviceLocation.coords.longitude
      })
    }
    fetch('/device/' + this.state.deviceName, requestOptions)
    .then(response => response.json())
    // .then(data => console.log(data.response))
  }

  handleXRSessionEnd(event) {
    const requestOptions = {
      method : 'DELETE',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: this.state.deviceName
      })
    }
    fetch('/device/' + this.state.deviceName, requestOptions)
    .then(response => response.json())
    // .then(data => console.log(data.response))
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

    window.addEventListener('deviceorientationabsolute', this.rotationEvent)

    // const { gl, camera } = useThree()
    // const cam = gl.xr.isPresenting ? gl.xr.getCamera(camera) : camera
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  render() {
    return (
      <div className='App' style={{ width: '100vw', height: '100vh'}}>
          <form onSubmit={this.handleDeviceNameUpdate}>
              <label>
                Device Name:
                <input type="text" value={this.state.deviceName} onChange={this.handleDeviceNameChange} />
              </label>
          </form>
          <ARCanvas>
            <CameraControls/>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <User orientation={{ax : this.state.destinationAngle.ax, ay: this.state.destinationAngle.ay, az : this.state.destinationAngle.az}} deviceOrientation={{alpha: this.state.devicePose.orientation.alpha, beta: this.state.devicePose.orientation.beta, gamma: this.state.devicePose.orientation.gamma}}/>
            {/* <ObjectHelper axesHelper={4} gridHelperSize={5} gridHelperDivisions={10}/> */}
            <ComponentHelper onOrientationUpdate={this.handleOrientationUpdate} onDestinationUpdate={this.handleDestinationUpdate} onXRSessionEnd={this.handleXRSessionEnd} onXRSessionStart={this.handleXRSessionStart}></ComponentHelper>
            <React.Suspense fallback={null}>
              <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.5,0]}>
                <Text
                  scale={[0.1, 0.1, 1]}>
                  {'Device Name | ' + this.state.deviceName}
                  {'\nDestination Name | ' + this.state.destinationName}
                  {'\nDestination Coordinates | ' + this.state.destinationLocation.coords.latitude + ', ' + this.state.destinationLocation.coords.longitude}
                  {'\nDevice Orientation | ' + 'alpha: ' + this.state.devicePose.orientation.alpha.toFixed(1) + ' | beta: ' + this.state.devicePose.orientation.beta.toFixed(1) + ' | gamma: ' + this.state.devicePose.orientation.gamma.toFixed(1)}
                  {'\nVirtual Orientation | ' + ' x: ' + this.state.virtualPose.orientation.ax.toFixed(1) + ' | y: ' + this.state.virtualPose.orientation.ay.toFixed(1) + ' | z: ' + this.state.virtualPose.orientation.az.toFixed(1)}
                  {'\nReal Bearing | ' + this.state.realBearing.toFixed(3)}
                  {'\nVirtual Bearing | ' + this.state.virtualBearing.toFixed(3)}
                </Text>
              </mesh>
            </React.Suspense>
          </ARCanvas>

          {/* <h3>{'Latitude: ' + this.state.devicePosition.coords.latitude + ' Longitude: ' + this.state.devicePosition.coords.longitude}</h3>
          <h3>{'alpha: ' + this.state.deviceOrientation.alpha.toFixed(1) + ' beta: ' + this.state.deviceOrientation.beta.toFixed(1) + ' gamma: ' + this.state.deviceOrientation.gamma.toFixed(1)}</h3>
          <h3>{'ax: ' + this.state.virtualPose.orientation.ax + ' ay: ' + this.state.virtualPose.orientation.ay + ' az: ' + this.state.virtualPose.orientation.az}</h3> */}
      </div>
    )
  }
}

export default App