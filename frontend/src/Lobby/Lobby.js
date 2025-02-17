import "./Lobby.css";
import React from "react";
import PlayerList from "../PlayerList/PlayerList.js";
import Game from "../Game/Game.js";
import Landing from "../Landing/Landing.js";
import { ws } from "../socketConfig.js";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import ErrorPage from "../ErrorPage/Error";
import Results from "../Results/Results";

class Lobby extends React.Component {
	constructor(props) {
		super();
		this.state = {
			players: this.props && this.props.players ? this.props.players : [],
			hasGameStarted: false,
			lobbyDoesntExist: false,
			playerListShouldShow: true,
			firstStartingWord: "N/A",
			results: "",
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
						this.setState({
							hasGameStarted: true,
							firstStartingWord: message.msgData["firstStartingWord"],
						});
						break;
					case "LOBBY_DOESNT_EXIST":
						this.setState({
							lobbyDoesntExist: true,
						});
						break;
					case "LOBBY_CLOSING":
						// insert some logic to kick myself back to homepage.
						break;
					case "RESULTS":
						this.setState({
							results: message.msgData.scores,
						});
						break;
					default:
						break;
				}
			}.bind(this)
		);

		let lobbyContent;
		let playerList;

		if (this.state.lobbyDoesntExist) {
			lobbyContent = <ErrorPage></ErrorPage>;
		} else if (this.state.hasGameStarted) {
			lobbyContent = <Game startingWord={this.state.firstStartingWord}></Game>;
			playerList = <PlayerList players={this.state.players}></PlayerList>;
		} else {
			lobbyContent = <Landing></Landing>;
			playerList = <PlayerList players={this.state.players}></PlayerList>;
		}
		if (this.state.results !== "") {
			console.log(this.state.results);
			return <Results res={this.state.results} />;
		} else {
			return (
				<div className="Lobby">
					<div className="Lobby-div">{lobbyContent}</div>
					<div className="PlayerList-div">{playerList}</div>
				</div>
			);
		}
	}
}

export default Lobby;
