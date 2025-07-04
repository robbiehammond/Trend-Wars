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
import { useLocation } from "react-router-dom";

class Lobby extends React.Component {
	constructor({ players }) {
		super();
		this.state = {
			players: players || [],
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

		this.wsMessageHandler = (json) => {
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
					break;
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
		};

		ws.on("message", this.wsMessageHandler);
	}

	componentWillUnmount() {
		ws.off("message", this.wsMessageHandler);
	}

	render() {
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
				<div className="mx-auto max-w-[950px] sm:px-4 !bg-neutral-800 h-full bg-fixed text-xs md:text-sm  ">
					<div className="flex flex-col h-full">
						<Card className="my-4 hidden sm:block">
							<header className="logo-text">
								<h1>TREND WARS</h1>
							</header>
						</Card>
						<Card className="flex-grow mb-4">
							<div className="game-bar my-4">
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
									<Grid item xs={12}>
										{lobbyContent}
									</Grid>
									<Grid item xs={6}>
										{playerList}
									</Grid>
									<Grid item xs={6}>
										{!this.state.lobbyDoesntExist && (
											<Card className="mb-4 !bg-[#908fbb] h-[370px] flex flex-col">
												<Stack
													spacing={2}
													className="text-left overflow-y-scroll p-4 flex-grow"
												>
													{this.state.messages.length === 0 ? (
														<p>No messages yet.</p>
													) : (
														this.state.messages.map((msg, index) => (
															<p key={index}>{msg}</p>
														))
													)}
												</Stack>
												<div className="flex px-1 sm:px-2 py-2 gap-1 sm:gap-2">
													<TextField
														className="flex-grow"
														variant="filled"
														autoComplete="off"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																const msg = new Message(MessageType.CHAT, {
																	text: this.state.currentMessage,
																});
																ws.emit("message", msg.toJSON());
															}
														}}
														onChange={(e) => {
															this.setState({ currentMessage: e.target.value });
														}}
													></TextField>
													<Button
														size="small"
														className="flex-shrink-1 !min-w-0 !px-1 !sm:px-1 !sm:min-w-[64px]"
														variant="contained"
														onClick={() => {
															const msg = new Message(MessageType.CHAT, {
																text: this.state.currentMessage,
															});
															ws.emit("message", msg.toJSON());
														}}
													>
														<span className="hidden sm:block">Send</span>
														<SendIcon className="sm:ml-1" fontSize="small" />
													</Button>
												</div>
											</Card>
										)}
									</Grid>
								</Grid>
							</Container>
						</Card>
					</div>
				</div>
			);
		}
	}
}

export default Lobby;

export function LobbyWrapper() {
	const location = useLocation();
	const players = location.state ? location.state.players : [];
	return <Lobby players={players} />;
}
