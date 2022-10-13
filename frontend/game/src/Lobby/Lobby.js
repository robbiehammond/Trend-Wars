import './Lobby.css';
import React from 'react'; 
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import PlayerList from '../PlayerList/PlayerList.js';
import Box from '@mui/material/Box';

class Lobby  extends React.Component{
  
  componentDidMount() {
    document.getElementById("word-input").focus();
  }

  render(){
    return (
      <div className="Lobby">
        <div className="Lobby-div">
          <div className='word-container'>
            <span>balls</span>
            <Input sx={{ color: 'white' }} className="Input" id="word-input" label='Type your word here..' variant="standard"></Input>
          </div>
          <Box m={1}>
            <Button className="Button" variant="contained" color="success" onClick={() => {}}>Submit Word</Button>
          </Box>  
        </div>
        <PlayerList>
        </PlayerList> 
      </div>
    );
  } 
}

export default Lobby;
