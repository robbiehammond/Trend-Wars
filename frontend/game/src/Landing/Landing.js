import './Landing.css';
import React from 'react'; 
import ws from '../socketConfig.js';
import Button from '@mui/material/Button';
import Message from '../Message/Message';
import MessageType from '../Message/MessageType';
import { Box } from '@mui/system';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.sendReadyMsg = this.sendReadyMsg.bind(this);
    this.sendStartGameMsg = this.sendStartGameMsg.bind(this);
  }

  sendReadyMsg() {
    const msg = new Message(MessageType.READY, {data: "meme"});
    ws.emit('message', msg.toJSON());
  }

  sendStartGameMsg() {
    const msg = new Message(MessageType.START_GAME, {data: "meme"});
    ws.emit('message', msg.toJSON());
  }


  render() {
    return (
      <div className="Landing">
        <Box m={1}>
          <Button className="Button" variant="contained" onClick={this.sendReadyMsg}>
            Ready Up
          </Button>
        </Box>
      <Box m={1}>
          <Button
            className="Button"
            variant="contained"
            onClick={this.sendStartGameMsg}
          >
            Start Game
          </Button>
      </Box>

      </div>
    );
  }
}

export default Landing;
