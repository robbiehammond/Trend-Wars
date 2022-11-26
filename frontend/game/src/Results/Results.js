import React from "react";
import ws from "../socketConfig.js";
import Message from "../Message/Message";
import { Button, List, ListItem } from "@mui/material";
import { Box, Container } from "@mui/system";
import { Navigate } from "react-router-dom";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        results: this.props.res
    };
  }

  handleClick() {
    window.location = 'http://localhost:3000'
  }



  render() {
    ws.on(
      "message",
      function (json) {
        let message = Message.fromJSON(json);
        console.log(message);

        switch (message.msgType) {
            
        }
      }
    );
    return (
      <div className="GameResults-div">
        <List dense>
          {(this.state.results).map((player) => {
            // This needs to be made to look better
            return (
              <Container key={player.id}>
                <Container>
                  {player.username}
                </Container>
                <Container>
                  {player.score}
                </Container>
                <Container>
                  {player.bestWord}
                </Container>
                <Container>
                  {player.rank}
                </Container>
                <Box sx={{padding: 10}}></Box>
              </Container>
            )
          })}
        </List>
        <Button onClick={this.handleClick}>
          Back to Menu
        </Button>
      </div>
    );
  }
}

export default Results;
