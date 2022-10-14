import './Game.css';
import React from 'react'; 
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

class Game extends React.Component{
  constructor(props) {
    super(props);
    this.word = 'balls'; // todo: change this to be what the server gives us
  }

  render(){
    return (
      <div className="Game">
        <div className='word-container'>
            <span className='word'>{this.word}</span> <span className='word'> +</span> 
            <Input autoFocus sx={{ color: 'white', backgroundColor: '#8FBB90', borderRadius: '8px', width: '25%'}} className='word' id="word-input" variant="filled" ></Input>
          </div>
            <Button className="Button" variant="contained" sx={{backgroundColor: '#8FBB90', border: 'none' }} onClick={() => {}}>Submit Word</Button>
      </div>
    );
  } 
}

export default Game;
