import "./Lobby.css";
import React from "react";
import PlayerList from "../PlayerList/PlayerList.js";
import Game from "../Game/Game.js";
import Landing from "../Landing/Landing.js";
import ws from "../socketConfig.js";

class Lobby extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hasGameStarted: false,
    };
  }

  render() {
    let component = this;
    ws.on(
      "message",
      function (message) {
        console.log(message);

        switch (message.msgType) {
          case "GAME_STARTED":
            this.setState({
              hasGameStarted: true,
            });
            break;
          default:
            break;
        }
      }.bind(this)
    );

    let gameOrLanding;
    console.log(this.state);
    if (this.state.hasGameStarted) {
      gameOrLanding = <Game></Game>;
    } else {
      gameOrLanding = <Landing></Landing>;
    }
    return (
      <div className="Lobby">
        <div className="Lobby-div">{gameOrLanding}</div>
        <PlayerList></PlayerList>
      </div>
    );
  }
}

export default Lobby;