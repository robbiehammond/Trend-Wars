import "./Lobby.css";
import React from "react";
import PlayerList from "../PlayerList/PlayerList.js";
import Game from "../Game/Game.js";
import Landing from "../Landing/Landing.js";
import ws from "../socketConfig.js";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import ErrorPage from "../ErrorPage/Error"

class Lobby extends React.Component {
  constructor(props) {
    super();
    this.state = {
      players: (this.props && this.props.players) ? this.props.players : [],
      hasGameStarted: false,
      lobbyDoesntExist: false,
      playerListShouldShow: true,
      firstStartingWord: "N/A"
    };
  }


  componentDidMount() {
    const msg = new Message(MessageType.URL, { data: window.location.href });
    ws.emit("message", msg.toJSON());

  }

  render() {
    ws.on(
      "message",
      function (json) {
        let message = Message.fromJSON(json);
        console.log(message);

        switch (message.msgType) {
          case "GAME_STARTED":
            console.log(message.msgData["firstStartingWord"])
            this.setState({
              hasGameStarted: true,
              firstStartingWord: message.msgData["firstStartingWord"]
            });
            break;
          case "LOBBY_DOESNT_EXIST":
            this.setState({
              lobbyDoesntExist: true
            })
            break;
          case "LOBBY_CLOSING":
            // insert some logic to kick myself back to homepage.
            break;
          case "GAME_ENDED":
            // insert some logic to display scores and whatnot, which should be a part of the msgData part of this message.
            break;
          default:
            break;
        }
      }.bind(this)
    );

    let gameLandingOrError;
    let playerList;
    if (this.state.lobbyDoesntExist) {
      gameLandingOrError = <ErrorPage></ErrorPage>
    }
    else if (this.state.hasGameStarted) {
      gameLandingOrError = <Game startingWord={this.state.firstStartingWord}></Game>;
      playerList = <PlayerList players={this.state.players}></PlayerList>
    } else {
      gameLandingOrError = <Landing></Landing>;
      playerList = <PlayerList players={this.state.players}></PlayerList>
    }
    return (
      <div className="Lobby">
        <div className="Lobby-div">{gameLandingOrError}</div>
        <div className="PlayerList-div">{playerList}</div>
      </div>
    );
  }
}

export default Lobby;
