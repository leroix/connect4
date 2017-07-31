import React, { Component } from 'react';
import './App.css';
import * as Board from './board'

const N_ROWS = 6
const N_COLUMNS = 7
const N_TO_WIN = 4
const P1_COLOR = 'red'
const P2_COLOR = 'black'

// Game functions
function init_game(n_rows, n_columns, win_condition) {
  return {
    board: Board.empty_board(n_rows, n_columns)
  , turn: P1_COLOR
  , winner: null
  , win_condition: win_condition || 4
  }
}

function move(column_idx, game) {
  if (game.winner || game.tie) { return game }

  var board = Board.clone(game.board)
  const column = board[column_idx]
  const first_empty_idx = column.indexOf(null)
  const turn = game.turn

  if (first_empty_idx > -1) {
    board[column_idx][first_empty_idx] = game.turn
    game.board = board

    if (Board.find_streak(board, game.win_condition)) {
      game.winner = turn
    } else if (Board.is_full(board)) {
      game.tie = true
    } else {
      game.turn = turn === P1_COLOR ? P2_COLOR : P1_COLOR
    }
  } 

  return game
}

// AI's take game state and return a column index for the next move
function random_ai(game) {
  const board = game.board

  if (Board.is_full(board)) {
    return null
  }

  var idx = Math.floor(Math.random() * board.length)

  while (!board[idx].some(el => el === null)) {
    idx = Math.floor(Math.random() * board.length)
  }

  return idx
}

function basic_ai(game) {
  var board = Board.clone(game.board)
  const previous_player = game.turn === P1_COLOR ? P2_COLOR : P1_COLOR

  for (var k = 0; k < board.length; k++) {
    for (var l = 0; l < board[0].length; l++) {
      if (board[k][l] === null && (board[k][l-1] === undefined || board[k][l-1] !== null)) {
        // Defense
        board[k][l] = previous_player
        if (Board.find_streak(board, game.win_condition, previous_player)) {
          return k
        } else {
          board[k][l] = null
        }

        // Offense
        board[k][l] = game.turn
        if (Board.find_streak(board, game.win_condition, game.turn)) {
          return k
        } else {
          board[k][l] = null
        }
      }
    }
  }

  return random_ai(game)
}


// Components
function Tile(props) {
  var style

  if (props.color) {
    style = {backgroundColor: props.color}
  }

  return (
    <div className="tile">
      <div className="tile__circle" style={style}>
      </div>
    </div>
    )
}

class App extends Component {
  constructor(props) {
    super(props)

    const game = init_game(N_ROWS, N_COLUMNS, N_TO_WIN)

    this.state = {
      game: game
    , ai: null
    }
  }

  getAI(mode) {
    const ais = {
      'random': random_ai
    , 'basic': basic_ai
    }

    return ais[this.state.ai || mode]
  }

  chooseColumn(idx) {
    const turn = this.state.game.turn
    const game = move(idx, this.state.game)

    this.setState({
      game: this.state.ai && game.turn !== turn
              ? move(this.getAI()(game), game)
              : game
    })
  }

  changeMode(mode) {
    const game = init_game(N_ROWS, N_COLUMNS, N_TO_WIN)

    this.setState({
      ai: mode
    , game: mode !== null ? move(this.getAI(mode)(game), game) : game
    })
  }

  render() {
    return (
      <div className="App">
        <div className="mode-selector">
          <label>
            <input
              type="radio"
              value="null"
              checked={this.state.ai === null}
              onChange={this.changeMode.bind(this, null)}
              />
              2 Players
          </label>
          <label>
            <input
              type="radio"
              value="random"
              checked={this.state.ai === 'random'}
              onChange={this.changeMode.bind(this, 'random')}
              />
              Random AI
          </label>
          <label>
            <input
              type="radio"
              value="basic"
              checked={this.state.ai === 'basic'}
              onChange={this.changeMode.bind(this, 'basic')}
              />
              Basic AI
          </label>
        </div>
        {!(this.state.game.winner || this.state.game.tie) && (
          <div className="turn">
            {this.state.game.turn}'s turn
          </div>
          )}
        {this.state.game.winner && (
          <div className="winner">
            {this.state.game.winner} wins!
          </div>
          )}
        {this.state.game.tie && (
          <div className="tie">
            It's a tie.
          </div>
          )}
        <div className="board">
          {this.state.game.board.map((column, idx) => {
            return (
              <div
                className="column"
                onClick={this.chooseColumn.bind(this, idx)}
                key={idx}
                >
                {column.slice(0).reverse().map(function (tile_color, idx) {
                  return <Tile color={tile_color} key={idx} />
                })}
              </div>
              )
          })}
        </div>
      </div>
    );
  }
}

export default App;
