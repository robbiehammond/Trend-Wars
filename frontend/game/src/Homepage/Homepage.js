import './Homepage.css';
import React from 'react'; 
import { useNavigate }from 'react-router-dom';
import ws from '../socketConfig.js';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Message from '../Message/Message';
import MessageType from '../Message/MessageType';

function Homepage()  {
  ws.on('message', (message) => {
    console.log(message);
    
    switch (message.msgType) {
      case "LOBBY_CREATED":
        rerouteToLobby(message.msgData);
        break;
      default:
        break;
    }
  });
  
  const navigate = useNavigate();

  function rerouteToLobby(data){
    navigate(`/lobby/${data.lobbyID}`, {replace: true});
    console.log('tried to join lobby');
  }

  function sendCreateLobbyMessage() {
    const msg = new Message(MessageType.CREATE_LOBBY, {data: "test"});
    ws.emit('message', msg.toJSON());
  }


  function sendJoinLobbyMessage() {
    const msg = new Message(MessageType.PLAYER_JOIN, {data: {lobbyID: "AAAAAA"}});
    ws.emit('message', msg.toJSON());
  }

  function sendReadyMsg() {
    const msg = new Message(MessageType.READY, {data: "meme"});
    ws.emit('message', msg.toJSON());
  }

  function sendStartGameMsg() {
    const msg = new Message(MessageType.START_GAME, {data: "meme"});
    ws.emit('message', msg.toJSON());
  }

  function submitWordMsg() {
    const msg = new Message(MessageType.SUBMIT_WORD, {data: "meme", word: "test"});
    ws.emit('message', msg.toJSON());
  }
  return (
    <div className="Homepage">
      <header className="Homepage-header">
        <Box m={1}>
          <Button className="Button" variant='contained' onClick={sendCreateLobbyMessage}>Create Lobby</Button>
        </Box>
        <Box m={1}>
          <Button className="Button" variant='contained' onClick={sendJoinLobbyMessage}>Join Lobby</Button>
        </Box>
        <Box m={1}>
         <Button className="Button" variant='contained' onClick={sendReadyMsg}>Ready Up</Button>
        </Box>
        <Box m={1}>
         <Button className="Button" variant='contained' onClick={sendStartGameMsg}>Start Game</Button>
        </Box>
        <Box m={1}>
         <Button className="Button" variant='contained' onClick={submitWordMsg}>Submit "test"</Button>
        </Box>
        <Box m={1}>
          <Button className="Button" variant='contained' onClick={() => navigate(`/lobby/`, {replace: true})}>go to lobby</Button>
        </Box>
      </header>
    </div>
  );
}

export default Homepage;
