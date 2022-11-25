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
      </div>
    );
  }
}

export default Results;
