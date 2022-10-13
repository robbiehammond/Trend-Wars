import './App.css';
import React from 'react'; 
import { Routes, Route } from 'react-router-dom';
import Lobby from './Lobby/Lobby';
import Homepage from './Homepage/Homepage.js';

function App()  {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TREND WARS</h1>
      </header>
      <div className='main'>
        <Routes>
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
