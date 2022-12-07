import "./Game.css";
import React from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import {ws} from "../socketConfig.js";
import { Alert } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.submitWordMsg = this.submitWordMsg.bind(this);
    this.finishTurnTimer = this.finishTurnTimer.bind(this);
    this.state = {
      wordThisTurn: this.props.startingWord,
      userWord: "",
      duplicateWordSubmitted: false,
      lastWord: ''
    };
  }

  submitWordMsg() {
    let userWord = this.state.userWord;
    const msg = new Message(MessageType.SUBMIT_WORD, {
      data: "meme",
      word: userWord
    });
    ws.emit("message", msg.toJSON());
  }

  startTurnTimer() {
    const msg = new Message(MessageType.TIME_OVER, {
      data: "",
    });
    ws.emit("message", msg.toJSON());

  }

  finishTurnTimer() {
    const msg = new Message(MessageType.TIME_OVER, {
    });
    ws.emit("message", msg.toJSON());
  }


  handleChange = (e) =>
    this.setState({
      userWord: e.target.value,
    });

  render() {
    ws.on("message", function(json) {
        let message = Message.fromJSON(json);
        switch (message.msgType) {
          case "LOBBY_STATE":
            let wordInput = document.getElementById('word-input');
            if(message.msgData.startingWord !== this.state.wordThisTurn){
              wordInput.value=''; 
              setTimeout(this.finishTurnTimer, 10000)
            }
            this.setState({
              wordThisTurn: message.msgData.startingWord,
              duplicateWordSubmitted: false
            });
            break;
          case "DUPLICATE_WORD":
            this.setState({
              duplicateWordSubmitted: true
            })
            break;
          default:
            break;
        }
      }.bind(this)
    )
    let warning = null;
    return (
      <div className="Game">
        <div className="word-container">
          <span className="word">{this.state.wordThisTurn}</span>{" "}
          <span className="word"> +</span>
          <Input
            onChange={this.handleChange}
            autoFocus
            sx={{
              color: "white",
              backgroundColor: "#8FBB90",
              borderRadius: "8px",
              width: "25%",
            }}
            className="word"
            id="word-input"
            variant="filled"
          ></Input>
        </div>
        <Button
          className="Button"
          variant="contained"
          sx={{ backgroundColor: "#8FBB90", border: "none" }}
          onClick={this.submitWordMsg}
        >
          Submit Word
        </Button>
        {this.state.duplicateWordSubmitted ? (<Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                this.setState({duplicateWordSubmitted: false });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, width: '200px' }}
        >
         This word has already been submitted by someone else!
        </Alert>) : ''}
      </div>
    );
  }
}

export default Game;
