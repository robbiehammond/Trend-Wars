import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import React, { useEffect } from 'react'; 

function App()  {
  useEffect(() => {
    const socket = io('http://localhost:8080');
    socket.emit('message', {
      type: 'CREATE_LOBBY',
      data: "Yeah pls create lobby"
    });
    socket.on('connect', () => {
      console.log('connected');
    })
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
