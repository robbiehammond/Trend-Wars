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
    window.location = 'http://localhost:8080'
  }



  render() {
    let sortable = [];
    for (var r in this.state.results) {
      sortable.push(this.state.results[r]);
    }
    console.log(sortable);
    let resultsArray = [];
    sortable.sort((a,b) => b.score - a.score).forEach((a, index)=> {
      resultsArray.push(`${a.username} was number ${index+1} with a score of ${a.score}. Their best word was "${a.bestWord}".`);
    });
 
    console.log(resultsArray);

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
        { resultsArray.map(string => {
          return (
            <p>{string}</p>
          )
        }) }
        {/* <List dense>
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
        </List> */}
        <Button onClick={this.handleClick}>
          Back to Menu
        </Button>
      </div>
    );
  }
}

export default Results;
