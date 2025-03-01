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
			round: 1,
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
					case "LOBBY_STATE":
						this.setState({
							round: message.msgData.turnNumber
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
				<div className="game-wrapper">
					<div className="game-logo">
						<h1>TREND WARS</h1>
					</div>
					<div className="game-bar">
						{this.state.hasGameStarted
							? `Round ${this.state.round} of 5`
							: `Waiting for players to ready up...`}
					</div>
					<div className="game-content">{lobbyContent}</div>
					<div className="game-players">{playerList}</div>
				</div>
			);
		}
	}
}

export default Lobby;
