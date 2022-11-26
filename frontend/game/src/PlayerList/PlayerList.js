import "./PlayerList.css";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { BigHead } from '@bigheads/core';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ws from "../socketConfig.js";
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
          {players.map((player) => {
            const labelId = `checkbox-list-secondary-label-${player}`;
            return (
              <ListItem key={player.id} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <BigHead
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    sx={{ 
                      fontSize: '40', 
                      fontWeight: 'medium',
                    }}
                    primary={`${player.id === yourId ? (player.username + ' (You)') : player.username} ${
                      player.word ? "wrote " + player.word : ""
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
