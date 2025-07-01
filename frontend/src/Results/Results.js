import React from "react";
import "./Results.css";
import { ws, server_location } from "../socketConfig.js";
import Message from "../Message/Message";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { BigHead } from "@bigheads/core";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LooksTwoRoundedIcon from "@mui/icons-material/LooksTwoRounded";
import Looks3RoundedIcon from "@mui/icons-material/Looks3Rounded";

class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: this.props.res,
		};
	}

	handleClick() {
		if (server_location == "http://localhost:8080") {
			window.location = "http://localhost:3000/";
		} else {
			window.location = "http://trendwars.net/";
		}
	}

	render() {
		let sortable = [];
		for (var r in this.state.results) {
			sortable.push(this.state.results[r]);
		}
		console.log(sortable);
		let resultsArray = [];
		sortable
			.sort((a, b) => b.score - a.score)
			.forEach((a, index) => {
				resultsArray.push(
					`${a.username} was number ${index + 1} with a score of ${
						a.score
					}. Their best word was "${a.bestWord}".`
				);
			});

		console.log(resultsArray);

		ws.on("message", function (json) {
			let message = Message.fromJSON(json);
			// console.log(message);

			switch (message.msgType) {
			}
		});

		return (
			<>
			<header className="logo-text">
					<h1>TREND WARS</h1>
			</header>
			<div className="GameResults-div">
				<div className="results">
					<h2>Results</h2>
					<List dense>
						{sortable
							.sort((a, b) => b.score - a.score)
							.map((player, index) => {
								const labelId = `checkbox-list-secondary-label-${player}`;
								return (
									<ListItem key={player.id} disablePadding>
										{index > 2 ? (
											""
										) : index === 2 ? (
											<Looks3RoundedIcon></Looks3RoundedIcon>
										) : index === 1 ? (
											<LooksTwoRoundedIcon></LooksTwoRoundedIcon>
										) : (
											<EmojiEventsIcon></EmojiEventsIcon>
										)}
										<ListItemButton>
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
													fontSize: "3rem",
													fontWeight: "medium",
												}}
												primary={`${player.username} had a score of ${player.score}. Their best word was "${player.bestWord}".`}
											/>
											<></>
										</ListItemButton>
									</ListItem>
								);
							})}
					</List>
				</div>
				<div className="break"></div>
				<Box m={3} sx={{ width: "fit-content" }}>
					<Button
						onClick={this.handleClick}
						variant="contained"
						sx={{ width: "100%", fontSize: "1.5rem" }}
					>
						Back to Menu
					</Button>
				</Box>
			</div>
			</>
		);
	}
}

export default Results;
