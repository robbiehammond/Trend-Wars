import React from "react";
import ws from "../socketConfig.js";
import Message from "../Message/Message";
import { List } from "@mui/material";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        results: this.props.res
    };
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
      </div>
    );
  }
}

export default Results;
