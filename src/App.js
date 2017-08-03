import React, { Component } from 'react';
import './App.css';
import { ConnectGame } from './game'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ConnectGame
          rows={6}
          columns={7}
          streakSize={4}
          player1Color="red"
          player2Color="black"
          />
      </div>
    );
  }
}

export default App;
