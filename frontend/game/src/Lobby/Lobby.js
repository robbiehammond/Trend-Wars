import './Lobby.css';
import React from 'react'; 
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import PlayerList from '../PlayerList/PlayerList.js';
import Game from '../Landing/Landing.js';
import Landing from '../Landing/Landing.js';

class Lobby extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasGameStarted: false
    }
  }

  render(){
    return (
      <div className="Lobby">
        <div className="Lobby-div">
          { this.state.hasGameStarted ? <Game></Game> : <Landing></Landing> }
        </div>
        <PlayerList>
        </PlayerList> 
      </div>
    );
  } 
}

export default Lobby;
