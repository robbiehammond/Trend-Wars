import "./PlayerList.css";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ws from "../socketConfig.js";
import Message from "../Message/Message";
class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    // todo: make this what the server says the players are
    this.state = {
      players: (this.props && this.props.players) ? this.props.players : [],
    };
  }

  render() {
    ws.on(
      "message",
      function (json) {
        let message = Message.fromJSON(json);
        console.log(message);
        switch (message.msgType) {
          case "LOBBY_STATE":
            console.log("on lobby state");
            this.setState({
              players: message.msgData.players,
            });
            break;
          default:
            break;
        }
      }.bind(this)
    );
    return (
      <div className="playerList">
        <h2>Player List</h2>
        <List dense>
          {this.state.players.map((player) => {
            const labelId = `checkbox-list-secondary-label-${player}`;
            return (
              <ListItem key={player.id} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${player + 1}`}
                      src={`/static/images/avatar/${player + 1}.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={`${player.username} ${
                      player.word ? "wrote " + player.word : ""
                    }`}
                  />
                  <>
                    {player.submitted ? (
                      <CheckCircleIcon></CheckCircleIcon>
                    ) : (
                      ""
                    )}
                  </>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default PlayerList;
