import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARCanvas } from '@react-three/xr';
import Box from './components/Box';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="App" style={{ width: "100vw", height: "100vh"}}>
      {/* <p>Current time {currentTime} </p> */}
        <ARCanvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </ARCanvas>
    </div>
  );
}

export default App;
