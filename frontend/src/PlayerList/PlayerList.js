import "./PlayerList.css";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { BigHead } from "@bigheads/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ws } from "../socketConfig.js";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType.js";
import { useLocation } from "react-router-dom";
import LooksOneRoundedIcon from "@mui/icons-material/LooksOneRounded";
import LooksTwoRoundedIcon from "@mui/icons-material/LooksTwoRounded";
import Looks3RoundedIcon from "@mui/icons-material/Looks3Rounded";
import AutorenewIcon from "@mui/icons-material/Autorenew";

function PlayerList(props) {
	const location = useLocation();
	const [yourId] = useState(
		location.state ? location.state.yourId : props.yourId
	);
	// const [isOnResults] = useState(props.isOnResults);
	const [isOnHomepage] = useState(props.isOnHomepage);
	const [players, setPlayers] = useState(
		location.state ? location.state.players : props.players
	);
	const [hasGameStarted, setGameStarted] = useState(false);

	function sendRandomizeMessage() {
		const msg = new Message(MessageType.RANDOMIZE_BIGHEAD, { data: "meme" });
		ws.emit("message", msg.toJSON());
	}

	useEffect(() => {
		const msg = new Message(MessageType.URL, { data: window.location.href });
		ws.emit("message", msg.toJSON());
		ws.on("message", (json) => {
			let message = Message.fromJSON(json);
			switch (message.msgType) {
				case "LOBBY_STATE":
					setPlayers(message.msgData.players);
					break;
				case "GAME_STARTED":
					setGameStarted(true);
					break;
				case "PLAYER_STATE":
					setPlayers([message.msgData]);
					break;
				default:
					break;
			}
		});
	}, []);

	return (
		<div
			className="rounded bg-[#908fbb] w-auto mx-auto my-4"
			style={
				isOnHomepage
					? { width: "250px" }
					: {
							height: 370,
					  }
			}
		>
			{/* {isOnHomepage ? "" : <h2>Player List</h2>} */}
			<List dense>
				{players
					.sort((a, b) => b.score - a.score)
					.map((player, index) => {
						const labelId = `checkbox-list-secondary-label-${player}`;
						return (
							<ListItem key={player.id}>
								{!hasGameStarted ? (
									""
								) : index > 2 ? (
									<LooksOneRoundedIcon
										sx={{ visibility: "hidden" }}
									></LooksOneRoundedIcon>
								) : index === 2 ? (
									<Looks3RoundedIcon></Looks3RoundedIcon>
								) : index === 1 ? (
									<LooksTwoRoundedIcon></LooksTwoRoundedIcon>
								) : (
									<LooksOneRoundedIcon></LooksOneRoundedIcon>
								)}
								<ListItemAvatar>
									<BigHead
										accessory={player.bigHead.accessory}
										body={player.bigHead.body}
										circleColor={player.bigHead.circleColor}
										clothing={player.bigHead.clothing}
										clothingColor={player.bigHead.clothingColor}
										eyebrows={player.bigHead.eyebrows}
										eyes={player.bigHead.eyes}
										facialHair={player.bigHead.facialHair}
										graphic={player.bigHead.graphic}
										hair={player.bigHead.hair}
										hairColor={player.bigHead.hairColor}
										hat={player.bigHead.hat}
										hatColor={player.bigHead.hatColor}
										lashes={player.bigHead.lashes}
										lipColor={player.bigHead.lipColor}
										mask={false}
										faceMask={false}
										mouth={player.bigHead.mouth}
										skinTone={player.bigHead.skinTone}
									/>
								</ListItemAvatar>
								<ListItemText
									id={labelId}
									sx={{
										fontSize: "40",
										fontWeight: "medium",
										overflow: "clip",
									}}
									primary={`${
										player.id === yourId
											? player.username + " (You)"
											: player.username
									} ${hasGameStarted ? ": " + player.score + " pts" : ""}`}
								/>
								<div className="flex items-center pl-2">
									{!hasGameStarted ? (
										player.ready ? (
											<CheckCircleIcon></CheckCircleIcon>
										) : player.id === yourId ? (
											<AutorenewIcon
												sx={{ color: "white" }}
												className="hover:stroke-current hover:text-white"
												onClick={sendRandomizeMessage}
											></AutorenewIcon>
										) : (
											""
										)
									) : player.wordSubmittedThisTurn ? (
										<CheckCircleIcon></CheckCircleIcon>
									) : (
										""
									)}
								</div>
							</ListItem>
						);
					})}
			</List>
		</div>
	);
}

export default PlayerList;
