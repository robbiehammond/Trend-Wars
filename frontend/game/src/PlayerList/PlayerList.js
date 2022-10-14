import './PlayerList.css';
import React from 'react'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

class PlayerList  extends React.Component{
  constructor(props){
    super(props);
    // todo: make this what the server says the players are 
    this.players = [
      { name: 'Rob B'}, 
      { name: 'Tyler Nish', submitted: true }, 
      { name: 'Big Andy-rew', submitted: false }, 
      { name: 'Your mom', submitted: false }, 
      { name: 'Burger', submitted: true }]; 
  }

  render(){
    return (
      <div className="playerList">
        <h2>Player List</h2>
        <List dense sx={{}}>
          {this.players.map((player) => {
            const labelId = `checkbox-list-secondary-label-${player}`;
            return (
              <ListItem
                key={player}
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${player + 1}`}
                      src={`/static/images/avatar/${player + 1}.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={`${player.name} ${
                      player.word ? "wrote " + player.word : ""
                    }`}
                  />
                  <>{player.submitted ? 
                  <CheckCircleIcon></CheckCircleIcon> : ''
                }</>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  } 
}

export default PlayerList;

