import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import React, { useEffect } from 'react'; 
import ws from './socketConfig.js';


function App()  {
  ws.on('message', (message) => {
    console.log(message);
  });

  function sendCreateLobbyMessage() {
    ws.emit('message', {type: 'CREATE_LOBBY', data: "meme"});
  }


  function sendJoinLobbyMessage() {
    ws.emit('message', {type: 'PLAYER_JOIN', data: "meme"});
  }

  function sendReadyMsg() {
    ws.emit('message', {type: 'READY', data: "meme"});
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={sendCreateLobbyMessage}>Create Lobby</button>
        <button onClick={sendJoinLobbyMessage}>Join Lobby</button>
        <button onClick={sendReadyMsg}>Ready Up</button>
        <button onClick={() => {}}>Submit "test"</button>
      </header>
    </div>
  );
}

export default App;
