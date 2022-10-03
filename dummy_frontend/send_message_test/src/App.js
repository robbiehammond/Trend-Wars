import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import React, { useEffect } from 'react'; 


function App()  {
  const socket = io('http://localhost:8080', {reconnection:false}); //connect to server
  function sendCreateLobbyMessage() {
    socket.emit('message', {type: 'CREATE_LOBBY', data: "meme"});
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={sendCreateLobbyMessage}>Create Lobby</button>
        <button onClick={() => {}}>Join Lobby</button>
        <button onClick={() => {}}>Ready Up</button>
        <button onClick={() => {}}>Submit "test"</button>
      </header>
    </div>
  );
}

export default App;
