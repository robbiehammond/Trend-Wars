import "./Homepage.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ws from "../socketConfig.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { TextField } from "@mui/material";

function Homepage() {
  const [username, setUsername] = useState('');
  const [lobbyID, setLobbyID] = useState('');
  const navigate = useNavigate();

  function rerouteToLobby(data) {
    navigate(`/lobby/${data.lobbyID}`, { replace: true });
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
    switch (message.msgType) {
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
          <Button
            className="Button"
            variant="contained"
            onClick={sendUsernameMessage}
          >
            Set Username
          </Button>
        </Box>
        <TextField value= {username} onChange={(e) => { setUsername(e.target.value)}}></TextField>
      </header>
    </div>
  );
}

export default Homepage;
