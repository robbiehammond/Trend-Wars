import './Lobby.css';
import React from 'react'; 
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import PlayerList from '../PlayerList/PlayerList.js';
import Box from '@mui/material/Box';

class Lobby extends React.Component{
  constructor(props) {
    super(props);
    this.word = 'balls'; // todo: change this to be what the server gives us
    // this.resizeInput = this.resizeInput.bind(this);
  }
  
  // resizeInput(element) {
  //   if(element.value){
  //     element.sx = element.value.length + "ch !important";
  //   }
  // }

  componentDidMount() {
    // this.input = document.getElementById("word-input"); // get the input element
    // this.input.addEventListener("input", this.resizeInput); // bind the "resizeInput" callback on "input" event
    // this.resizeInput(this.input); // immediately call the function
    document.getElementById("word-input").focus();
  }

  render(){
    return (
      <div className="Lobby">
        <div className="Lobby-div">
          <div className='word-container'>
            <span className='word'>{this.word}</span> <span className='word'> +</span>
            <Input sx={{ color: 'white', backgroundColor: '#8FBB90', borderRadius: '8px', width: '25%'}} className='word' id="word-input" variant="filled"></Input>
          </div>
            <Button className="Button" variant="contained" sx={{backgroundColor: '#8FBB90', border: 'none' }} onClick={() => {}}>Submit Word</Button>
        </div>
        <PlayerList>
        </PlayerList> 
      </div>
    );
  } 
}

export default Lobby;
