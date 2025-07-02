import "./Landing.css";
import React from "react";
import { ws } from "../socketConfig.js";
import Button from "@mui/material/Button";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { useState } from "react";
import { CssTextField } from "../Homepage/Homepage";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";

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
		<Grid container spacing={2} className="mb-4">
			<Grid item xs={12}>
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xs={12} sm={6} className="*:w-full">
						<CssTextField
							autoComplete="off"
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
							helperText="Press enter or hit 'SET' to set your username"
							onKeyDown={(e) => {
								if (e.key === "Enter") sendUsernameMessage();
							}}
						></CssTextField>
					</Grid>
					<Grid item xs={12} sm={6} className="*:w-full">
						<Button
							className="Button"
							variant="contained"
							onClick={sendUsernameMessage}
						>
							Set
						</Button>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xs={6} className="*:w-full">
						<Button
							className="Button"
							variant="contained"
							onClick={sendReadyMsg}
						>
							Ready Up
						</Button>
					</Grid>
					<Grid item xs={6} className="*:w-full">
						<Button
							className="Button"
							variant="contained"
							onClick={sendStartGameMsg}
						>
							Start Game
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default Landing;
