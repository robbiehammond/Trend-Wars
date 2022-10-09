import './Homepage.css';
import React from 'react'; 
import { useNavigate }from 'react-router-dom';
import ws from '../socketConfig.js';

function Homepage()  {
  ws.on('message', (message) => {
    console.log(message);
  });
  const navigate = useNavigate();

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
    <div className="Homepage">
      <header className="Homepage-header">
      <button onClick={sendCreateLobbyMessage}>Create Lobby</button>
        <button onClick={sendJoinLobbyMessage}>Join Lobby</button>
        <button onClick={sendReadyMsg}>Ready Up</button>
        <button onClick={() => {}}>Submit "test"</button>
        <button onClick={() => navigate('/lobby', {replace: true})}>go to lobby</button>
      </header>
    </div>
  );
}

export default Homepage;
