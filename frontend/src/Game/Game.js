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
import Grid from "@mui/material/Grid";
import { TypewriterInput } from "../TypewriterInput/TypewriterInput.js";

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
			<div className="h-10 *:text-xl *:text-[#8FBB90] mb-4 mt-[-16px]" ref={containerRef}>
				{duplicateWordSubmitted ? (
					<p className="mb-4">This word has already been submitted by someone else!</p>
				) : (
					""
				)}
				<Slide
					in={showPointInc}
					direction="up"
					container={containerRef.current}
				>
					{
						<div>
							{`+${pointIncrease} pts for ${lastPhrase}`}{" "}
						</div>
					}
				</Slide>
			</div>
			<Grid container spacing={2} className="h-full">
				<Grid item xs={12} className="justify-center flex">
					<TypewriterInput
						firstWord={wordThisTurn}
						onValueChange={(value) => {
							setUserWord(value);
							console.log(value);
						}}
						handleKeyDown={(e) => {
							if (
								e.key === "Backspace" &&
								userWord === "" &&
								e.target.selectionStart === 0
							) {
								e.preventDefault();
							}
							if (e.key === "Enter") {
								// Handle Enter key press when typing is complete
								if (e.target.value.trim() !== "") {
									console.log("Submitting word:", userWord);
									submitWordMsg();
								}
							}
						}}
					/>
				</Grid>
			</Grid>
			<Button
				className="Button"
				variant="contained"
				sx={{ backgroundColor: "#8FBB90", border: "none" }}
				onClick={submitWordMsg}
			>
				Submit Word
			</Button>
		</div>
	);
}

export default Game;
