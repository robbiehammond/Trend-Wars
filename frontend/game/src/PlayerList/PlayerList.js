import "./PlayerList.css";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { BigHead } from '@bigheads/core';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {ws} from "../socketConfig.js";
import Message from "../Message/Message";
import { useLocation } from "react-router-dom";

function PlayerList() {

  const location = useLocation();
  const [yourId] = useState(location.state.yourId);
  const [players, setPlayers] = useState(location.state.players);
  const [hasGameStarted, setGameStarted] = useState(false);

    ws.on(
      "message",
      function (json) {
        let message = Message.fromJSON(json);
        console.log(message);
        switch (message.msgType) {
          case "LOBBY_STATE":
            console.log("on lobby state");
            setPlayers(message.msgData.players);
            break;
            case "GAME_STARTED":
              setGameStarted(true);
            break;
          default:
            break;
        }
      }
    );
  
    return (
      <div className="playerList">
        <h2>Player List</h2>
        <List dense>
          {players.sort((a,b)=> (b.score - a.score)).map((player) => {
            const labelId = `checkbox-list-secondary-label-${player}`;
            return (
              <ListItem key={player.id} disablePadding>
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
                      fontSize: '40', 
                      fontWeight: 'medium',
                    }}
                    primary={`${player.id === yourId ? (player.username + ' (You)') : player.username} ${
                      hasGameStarted ? ': ' + player.score + ' pts' : ""
                    }`}
                  />
                  <>
                    { !hasGameStarted ? 
                    player.ready ? (
                      <CheckCircleIcon></CheckCircleIcon>
                    ) : (
                      ""
                    ) 
                    : (player.wordSubmittedThisTurn ? (
                      <CheckCircleIcon></CheckCircleIcon>
                    ) : (
                      ""
                    ))}
                  </>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  
}

export default PlayerList;
