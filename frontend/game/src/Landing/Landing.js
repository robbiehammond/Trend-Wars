import "./Landing.css";
import React from "react";
import {ws} from "../socketConfig.js";
import Button from "@mui/material/Button";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { Box } from "@mui/system";
import { useState } from "react";
import { CssTextField } from "../Homepage/Homepage";
import { useLocation } from "react-router-dom";

function Landing() {
  const location = useLocation();
  const [lobbyID] = useState(location.state.lobbyID)
  const [username, setUsername] = useState('');

  function sendReadyMsg() {
    const msg = new Message(MessageType.READY, { data: "meme" });
    ws.emit("message", msg.toJSON());
  }

  function sendStartGameMsg() {
    const msg = new Message(MessageType.START_GAME, { data: "meme" });
    ws.emit("message", msg.toJSON());
  }

  function sendUsernameMessage() {
    const msg = new Message(MessageType.USERNAME, { data: username });
    ws.emit("message", msg.toJSON());
  }

  function sendRandomizeMessage() {
    const msg = new Message(MessageType.RANDOMIZE_BIGHEAD, { data: "meme" });
    ws.emit("message", msg.toJSON());
  }

    return (
      <div className="Landing">
            <p>{lobbyID}</p>
            <Box m={1} sx={{width: '45%'}}>
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
          <Button
            className="Button"
            variant="contained"
            onClick={sendRandomizeMessage}
          >
            Randomize Avatar
          </Button>
        </Box>
        <Box m={1}>
          <Button
            className="Button"
            variant="contained"
            onClick={sendReadyMsg}
          >
            Ready Up
          </Button>
        </Box>
        <Box m={1}>
          <Button
            className="Button"
            variant="contained"
            onClick={sendStartGameMsg}
          >
            Start Game
          </Button>
        </Box>
      </div>
    );
}

export default Landing;
