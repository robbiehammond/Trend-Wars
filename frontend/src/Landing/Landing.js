import "./Landing.css";
import React from "react";
import { ws } from "../socketConfig.js";
import Button from "@mui/material/Button";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { useState } from "react";
import { CssTextField } from "../Homepage/Homepage";
import { useLocation } from "react-router-dom";

function Landing() {
	const location = useLocation();
	const [lobbyID] = useState(location.state.lobbyID);
	const [username, setUsername] = useState("");

	function sendReadyMsg() {
		const msg = new Message(MessageType.READY, { data: "meme" });
		ws.emit("message", msg.toJSON());
	}

	function sendStartGameMsg() {
		const msg = new Message(MessageType.START_GAME, { data: "meme" });
		ws.emit("message", msg.toJSON());
	}

	function sendUsernameMessage() {
		const msg = new Message(MessageType.USERNAME, { data: username });
		ws.emit("message", msg.toJSON());
	}

	function sendRandomizeMessage() {
		const msg = new Message(MessageType.RANDOMIZE_BIGHEAD, { data: "meme" });
		ws.emit("message", msg.toJSON());
	}

	return (
		<div className="Landing">
			<p> Your Lobby ID is {lobbyID}</p>
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
			<Button
				className="Button"
				variant="contained"
				onClick={sendRandomizeMessage}
				sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
			>
				Randomize Avatar
			</Button>
			<Button
				className="Button"
				variant="contained"
				onClick={sendReadyMsg}
				sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
			>
				Ready Up
			</Button>
			<Button
				className="Button"
				variant="contained"
				onClick={sendStartGameMsg}
				sx={{ margin: 1, maxWidth: "350px", width: "80%" }}
			>
				Start Game
			</Button>
		</div>
	);
}

export default Landing;
