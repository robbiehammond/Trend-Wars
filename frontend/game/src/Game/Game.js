import "./Game.css";
import React from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import ws from "../socketConfig.js";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.submitWordMsg = this.submitWordMsg.bind(this);
    this.state = {
      wordThisTurn: "word", // todo: change this to be what the server gives us
      userWord: "",
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
      </div>
    );
  }
}

export default Game;
