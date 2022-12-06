import "./Homepage.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {ws} from "../socketConfig.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { TextField } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#8FBB90',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#8FBB90',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#8FBB90',
    },
    '&:hover fieldset': {
      borderColor: '#8FBB90',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8FBB90',
    },
  },
});


function Homepage() {
  const [username, setUsername] = useState('');
  const [yourId, setYourId] = useState(-37);
  const [lobbyID, setLobbyID] = useState('');
  const navigate = useNavigate();

  function rerouteToLobby(data) {
    navigate(`/lobby/${data.lobbyID}`, 
    { 
      replace: true,
      state: {
        players: data.lobby_state.players,
        yourId: yourId
      } 
    });
  }

  function sendCreateLobbyMessage() {
    const msg = new Message(MessageType.CREATE_LOBBY, { data: "test" });
    ws.emit("message", msg.toJSON());
  }

  function sendJoinLobbyMessage() {
    const msg = new Message(MessageType.PLAYER_JOIN, {
      data: { lobbyID: lobbyID },
    });
    ws.emit("message", msg.toJSON());
  }

  function sendUsernameMessage() {
    const msg = new Message(MessageType.USERNAME, { data: username });
    ws.emit("message", msg.toJSON());
  }

  ws.on("message", (json) => {
    let message = Message.fromJSON(json);
    console.log(message);
    switch (message.msgType) {
      case "PLAYER_ID":
        setYourId(message.msgData.your_id);
        break;
      case "LOBBY_CREATED":
        rerouteToLobby(message.msgData);
        break;
      case "USERNAME_CHANGED":
        break;
        //if you wanna visually show that the username has been changed or somethin, do that here
      case "LOBBY_JOINED":
        rerouteToLobby(message.msgData);
        break;
      default:
        break;
    }
  });

  return (
    <div className="Homepage">
      <header className="Homepage-header">
        <Box m={1}>
          <Button
            className="Button"
            variant="contained"
            onClick={sendCreateLobbyMessage}
          >
            Create Lobby
          </Button>
        </Box>
        
        <Box m={1}>
        <CssTextField value= {username} onChange={(e) => { setUsername(e.target.value)}} label="Username" InputLabelProps={{
  style: { color: '#8FBB90', borderColor: '#8FBB90'},
}} sx={{ marginRight: 2, width: '45%'}}></CssTextField>
          <Button
            sx={{ width: '50%'}}
            className="Button"
            variant="contained"
            onClick={sendUsernameMessage}
          >
            Set Username
          </Button>
        </Box>
        <Box m={1}>
        <CssTextField sx={{ marginRight: 2, width: '45%'}} value= {lobbyID} onChange={(e) => { setLobbyID(e.target.value)}} label="Lobby Code" color="secondary"
        InputLabelProps={{
          style: { color: '#8FBB90', borderColor: '#8FBB90'}}}></CssTextField>
          <Button
            sx={{ width: '50%'}}
            className="Button"
            variant="contained"
            onClick={sendJoinLobbyMessage}
          >
            Join Lobby
          </Button>
        </Box>
      </header>
    </div>
  );
}

export default Homepage;


// sx={{
//   color: "#30303E",
//   borderColor: '#30303E !important'
// }} 