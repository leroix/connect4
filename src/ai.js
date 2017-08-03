import React, { Component } from 'react'
import * as Board from './board'

// AI functions take a board, current player, next player, and win condition
// They return the index of the column to play on the game board.

function random_ai(board) {
  function random_column(board) {
    return Math.floor(Math.random() * Board.num_columns(board))
  }

  if (Board.is_full(board)) {
    return null
  }

  var column_idx = random_column(board)

  while (Board.column_is_full(board, column_idx)) {
    column_idx = random_column(board)
  }

  return column_idx
}

function basic_ai(board, current_player, next_player, win_condition) {
  const players = [current_player, next_player]
  var test_board

  for (var k = 0; k < Board.num_columns(board); k++) {
    // See if we can win. If not, see if we need to block the other player
    for (var l = 0; l < players.length; l++) {
      test_board = Board.drop_disc(board, k, players[l])
      if (Board.find_streak(test_board, win_condition, players[l])) {
        return k
      }
    }
  }

  // otherwise, use random ai
  return random_ai(board)
}


class AISelector extends Component {
  constructor(props) {
    super(props)

    this.state = {selected: null}
  }

  onChangeAI(key, implementation) {
    this.props.onChangeAI(implementation)
    this.setState({selected: key})
  }

  render () {
    return (
      <div className="ai-selector">
        <label>
          <input
            type="radio"
            value="null"
            checked={this.state.selected === null}
            onChange={this.onChangeAI.bind(this, null, null)}
            />
            2 Players
        </label>
        <label>
          <input
            type="radio"
            value="random"
            checked={this.state.selected === 'random'}
            onChange={this.onChangeAI.bind(this, 'random', random_ai)}
            />
            random ai
        </label>
        <label>
          <input
            type="radio"
            value="basic"
            checked={this.state.selected === 'basic'}
            onChange={this.onChangeAI.bind(this, 'basic', basic_ai)}
            />
            basic ai
        </label>
      </div>
    )
  }
}

export { AISelector as default, random_ai, basic_ai }
