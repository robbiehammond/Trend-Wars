import "./Game.css";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import { ws } from "../socketConfig.js";
import Slide from "@mui/material/Slide";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material";

function Game(props) {
	const location = useLocation();
	const [wordThisTurn, setWordThisTurn] = useState(props.startingWord);
	const [userWord, setUserWord] = useState("");
	const [duplicateWordSubmitted, setDuplicateWordSubmitted] = useState(false);
	const [lastPhrase, setLastPhrase] = useState("");
	const [pointIncrease, setPointIncrease] = useState(0);
	const [yourId] = useState(location.state.yourId);
	const [showPointInc, setShowPointInc] = useState(false);
	const [lastTurnNum, setLastTurnNum] = React.useState(1);
	const containerRef = React.useRef(null);

	function submitWordMsg() {
		setShowPointInc(false);
		const msg = new Message(MessageType.SUBMIT_WORD, {
			data: "meme",
			word: userWord.trim(),
		});
		ws.emit("message", msg.toJSON());
	}

	function finishTurnTimer() {
		const msg = new Message(MessageType.TIME_OVER, {});
		ws.emit("message", msg.toJSON());
	}

	ws.on("message", function (json) {
		let message = Message.fromJSON(json);
		switch (message.msgType) {
			case "LOBBY_STATE":
				let wordInput = document.getElementById("word-input");
				let passedTurnNum = message.msgData.turnNumber;
				console.log(message.msgData);
				if (passedTurnNum > lastTurnNum) {
					setLastPhrase(wordThisTurn + " + " + userWord);
					let players = message.msgData.players;
					let you = players.filter((p) => p.id === yourId)[0];
					setPointIncrease(you.pointInc);
					setShowPointInc(true);
					setLastTurnNum(passedTurnNum);
				}
				setWordThisTurn(message.msgData.startingWord);
				setDuplicateWordSubmitted(false);
				break;
			case "DUPLICATE_WORD":
				setDuplicateWordSubmitted(true);
				break;
			default:
				break;
		}
	});

	return (
		<div className="Game">
			<div
				className="pointIncrease"
				ref={containerRef}
				style={{ overflow: "hidden" }}
			>
				<Slide
					in={showPointInc}
					direction="up"
					container={containerRef.current}
				>
					{
						<div
							style={{ color: "#8FBB90" }}
						>{`+${pointIncrease} pts for ${lastPhrase}`}</div>
					}
				</Slide>
			</div>
			<div className="">
				<div className="word">{wordThisTurn}</div>
				<div className="word">
					<TextField
						onChange={(e) => {
							setUserWord(e.target.value);
						}}
						autoFocus
						sx={{
							color: "white",
							// backgroundColor: "#8FBB90",
						}}
						className="word min-w-full"
						id="word-TextField"
						variant="filled"
						placeholder="Enter your word.."
					></TextField>
				</div>
			</div>
			<Button
				className="Button"
				variant="contained"
				sx={{ backgroundColor: "#8FBB90", border: "none" }}
				onClick={submitWordMsg}
			>
				Submit Word
			</Button>
			{duplicateWordSubmitted ? (
				<p>This word has already been submitted by someone else!</p>
			) : (
				""
			)}
		</div>
	);
}

export default Game;
