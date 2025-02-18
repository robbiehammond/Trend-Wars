import "./Homepage.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ws } from "../socketConfig.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayerList from "../PlayerList/PlayerList";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export const CssTextField = styled(TextField)({
	"& label.Mui-focused": {
		color: "#8FBB90",
	},
	"& .MuiInput-underline:after": {
		borderBottomColor: "#8FBB90",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#8FBB90",
		},
		"&:hover fieldset": {
			borderColor: "#8FBB90",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#8FBB90",
		},
	},
});

function Homepage() {
	const [player, setPlayer] = useState({
		bestWord: "",
		bigHead: {
			accessory: "shades",
			body: "chest",
			circleColor: "blue",
			clothing: "naked",
			clothingColor: "white",
			eyebrows: "concerned",
			eyes: "content",
			facialHair: "none",
			graphic: "none",
			hair: "afro",
			hairColor: "pink",
			hat: "turban",
			hatColor: "white",
			lashes: "false",
			lipColor: "purple",
			mask: [true],
			faceMask: [true],
			mouth: "serious",
			skinTone: "dark",
		},
		id: 0,
		rank: -1,
		ready: false,
		score: 0,
		username: "?",
		wordSubmittedThisTurn: false,
	});

	const [username, setUsername] = useState("");
	const [yourId, setYourId] = useState(-37);
	const [lobbyID, setLobbyID] = useState("");
	const [loaded, setLoaded] = useState(false);
	const navigate = useNavigate();

	function rerouteToLobby(data) {
		navigate(`/lobby/${data.lobbyID}`, {
			replace: true,
			state: {
				players: data.lobby_state.players,
				yourId: yourId,
				lobbyID: data.lobbyID,
			},
		});
	}

	function sendCreateLobbyMessage() {
		const msg = new Message(MessageType.CREATE_LOBBY, { data: "test" });
		ws.emit("message", msg.toJSON());
	}

	function sendJoinLobbyMessage() {
		const msg = new Message(MessageType.PLAYER_JOIN, {
			data: { lobbyID: lobbyID.toUpperCase() },
		});
		ws.emit("message", msg.toJSON());
	}

	function sendUsernameMessage() {
		const msg = new Message(MessageType.USERNAME, { data: username });
		ws.emit("message", msg.toJSON());
	}

	ws.on("message", (json) => {
		let message = Message.fromJSON(json);
		console.log(message);
		switch (message.msgType) {
			case "PLAYER_ID":
				setYourId(message.msgData.your_id);
				break;
			case "LOBBY_CREATED":
				rerouteToLobby(message.msgData);
				break;
			case "USERNAME_CHANGED":
				break;
			//if you wanna visually show that the username has been changed or somethin, do that here
			case "PLAYER_STATE":
				setLoaded(true);
				setPlayer(message.msgData);
				break;
			case "LOBBY_JOINED":
				rerouteToLobby(message.msgData);
				break;
			default:
				break;
		}
	});

	return (
		<div className="Homepage">
			{loaded ? (
				<header className="Homepage-header">
					<p>
						This is You <ArrowDownwardIcon></ArrowDownwardIcon>
					</p>
					<PlayerList
						players={[player]}
						yourId={player.id}
						isOnHomepage={true}
					></PlayerList>
					<Box m={1} sx={{ width: "80%" }}>
						<p style={{ fontSize: "1rem" }}>
							Trend Wars is a multiplayer game with 2 to 5 players. You will be
							given a word each round. Come up with a trendy phrase to pair with
							it.
							<br></br>Based on Google Trends, your phrase will be scored from 0
							to 100. The player with the most points after 5 round wins.
							<br></br>
							<br></br>
							You can set your username, join a lobby, or create a lobby below.
							Good luck Soldier.
						</p>
					</Box>
					<CssTextField
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						label="Username"
						InputLabelProps={{
							style: { color: "#8FBB90", borderColor: "#8FBB90" },
						}}
						FormHelperTextProps={{
							style: { color: "#8FBB90", borderColor: "#8FBB90" },
						}}
						helperText="Press enter to set your username"
						sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
						onKeyDown={(e) => {
							if (e.key === "Enter") sendUsernameMessage();
						}}
					></CssTextField>
					<CssTextField
						sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
						value={lobbyID}
						onChange={(e) => {
							setLobbyID(e.target.value);
						}}
						label="Lobby Code"
						color="secondary"
						InputLabelProps={{
							style: { color: "#8FBB90", borderColor: "#8FBB90" },
						}}
						helperText="Press enter to join the lobby"
						FormHelperTextProps={{
							style: { color: "#8FBB90", borderColor: "#8FBB90" },
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") sendJoinLobbyMessage();
						}}
					></CssTextField>
					<Button
						className="Button"
						variant="contained"
						onClick={sendCreateLobbyMessage}
						sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
					>
						Create Lobby
					</Button>
				</header>
			) : (
				<CircularProgress />
			)}
		</div>
	);
}

export default Homepage;
