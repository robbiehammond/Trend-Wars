import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import React from 'react'; 
import { Routes, Route, useNavigate } from 'react-router-dom';
import Lobby from './Lobby/Lobby';
import Homepage from './Homepage/Homepage.js';
import ws from './socketConfig.js';


function App()  {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TREND WARS</h1>

        <Routes>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
