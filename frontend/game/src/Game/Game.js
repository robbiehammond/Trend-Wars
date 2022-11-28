import "./Game.css";
import React from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import {ws} from "../socketConfig.js";
import { Alert } from "@mui/material";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.submitWordMsg = this.submitWordMsg.bind(this);
    this.state = {
      wordThisTurn: this.props.startingWord,
      userWord: "",
      duplicateWordSubmitted: false
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

  handleChange = (e) =>
    this.setState({
      userWord: e.target.value,
    });

  render() {
    ws.on("message", function(json) {
        let message = Message.fromJSON(json);
        switch (message.msgType) {
          case "LOBBY_STATE":
            this.setState({
              wordThisTurn: message.msgData.startingWord
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
    if (this.state.duplicateWordSubmitted) {
      warning = <Alert severity="error">This word has already been submitted by someone else!</Alert>
      this.state.duplicateWordSubmitted = false;
    }
    return (
      <div className="Game">
        {warning}
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
      </div>
    );
  }
}

export default Game;
