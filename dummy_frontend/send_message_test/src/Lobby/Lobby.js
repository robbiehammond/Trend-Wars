import './Lobby.css';
import React from 'react'; 
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';


class Lobby  extends React.Component{
  
  componentDidMount() {
    document.getElementById("word-input").focus();
  }

  render(){
    return (
      <div className="Lobby">
        <header className="Lobby-header">
          <span>this is da word</span>
          <Input sx={{ color: 'white' }} className="Input" id="word-input" label='Type your word here..' variant="standard"></Input>
          <Button className="Button" variant="contained" color="success" onClick={() => {}}>Submit Word</Button>
  
        </header>
      </div>
    );
  } 
}

export default Lobby;
