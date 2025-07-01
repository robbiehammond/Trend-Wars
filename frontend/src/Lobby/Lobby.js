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
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

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
			messages: [],
			currentMessage: "",
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
					case "CHAT":
						// Handle chat messages here if needed
						if (message.msgData.text === "") {
							return; // Ignore empty messages
						}
						this.setState((prevState) => ({
							messages: [...prevState.messages, message.msgData.text],
						}));
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
							round: message.msgData.turnNumber,
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
				<div className="mx-auto max-w-screen-lg h-[90vh] p-4 text-sm">
					<Card className="mb-4">
						<header className="logo-text">
							<h1>TREND WARS</h1>
						</header>
					</Card>
					<Card>
						<div className="game-bar mt-4">
							<p>
								{" "}
								Lobby ID:{" "}
								{window.location.pathname.split("/").pop().toUpperCase()}
							</p>

							{this.state.hasGameStarted
								? `Round ${this.state.round} of 5`
								: `Waiting for players to ready up...`}
						</div>
						<Container className="p-4 !max-w-[870px] mx-auto">
							<Grid container spacing={2} className="h-full">
								<Grid item xs={6}>
									{playerList}
								</Grid>
								<Grid item xs={6}>
									{!this.state.lobbyDoesntExist && <Card className="my-4 !bg-[#908fbb] h-[370px] flex flex-col">
										<Stack spacing={2} className="text-left overflow-y-scroll p-4">
											{ this.state.messages.length === 0 ? (
												<p>No messages yet.</p>
											) : (
												this.state.messages.map((msg, index) => (
													<p key={index}>{msg}</p>
												))
											)}
										</Stack>
										<div className=" flex px-2 py-2 gap-2">
											<TextField fullWidth variant="filled" autoComplete="off" onChange={(e) => {
												this.setState({ currentMessage: e.target.value });
											}}></TextField>
											<Button variant="contained" endIcon={<SendIcon />} onClick={() => {
												const msg = new Message(MessageType.CHAT, {
													text: this.state.currentMessage
												});
												ws.emit("message", msg.toJSON());
											}}>
												Send
											</Button>
										</div>
									</Card>}
								</Grid>
								<Grid item xs={12}>
									{lobbyContent}
								</Grid>
							</Grid>
						</Container>
					</Card>
				</div>
			);
		}
	}
}

export default Lobby;
