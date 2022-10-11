import './Homepage.css';
import React from 'react'; 
import { useNavigate }from 'react-router-dom';
import ws from '../socketConfig.js';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
         <Button className="Button" variant='contained' onClick={() => {}}>Submit "test"</Button>
        </Box>
        <Box m={1}>
          <Button className="Button" variant='contained' onClick={() => navigate('/lobby', {replace: true})}>go to lobby</Button>
        </Box>
      </header>
    </div>
  );
}

export default Homepage;
