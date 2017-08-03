import React, { Component } from 'react';
import * as Board from './board'
import AISelector from './ai'

// Game state functions
function init_game(n_rows, n_columns, streak_size, current_player, next_player) {
  return {
    board: Board.empty_board(n_rows, n_columns)
  , current_player: current_player
  , next_player: next_player
  , winner: null
  , is_tie: false
  , win_condition: streak_size || 4
  , ai: null
  }
}

function move(game, column_idx) {
  const current_player = game.current_player

  if (game.winner || game.is_tie) { return game }

  if (!Board.column_is_full(game.board, column_idx)) {
    game.board = Board.drop_disc(game.board, column_idx, game.current_player)

    if (Board.find_streak(game.board, game.win_condition)) {
      game.winner = game.current_player
    } else if (Board.is_full(game.board)) {
      game.is_tie = true
    } else {
      game.current_player = game.next_player
      game.next_player = current_player
    }
  } 

  return game
}

// Components
function Status(props) {
  return (
    <div className="status-message-wrapper">
      {!(props.winner || props.isTie) && (
        <div className="status-message status-message--turn">
          {props.currentPlayer}'s turn
        </div>
        )}
      {props.winner && (
        <div className="status-message status-message--winner">
          {props.winner} wins!
        </div>
        )}
      {props.isTie && (
        <div className="status-message status-message--tie">
          It's a tie.
        </div>
        )}
    </div>
  )
}

class ConnectGame extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.initializeGame()
  }

  initializeGame() {
    this.setState(init_game(
        this.props.rows
        ,this.props.columns
        ,this.props.streakSize
        ,this.props.player1Color
        ,this.props.player2Color
        ))
  }

  pickAIMove() {
    return this.state.ai(
        this.state.board
        ,this.state.current_player
        ,this.state.next_player
        ,this.state.win_condition
        )
  }

  changeAI(implementation) {
    this.initializeGame()

    this.setState({ai: implementation})

    if (implementation !== null) {
      setTimeout(() => {
        this.setState(move(this.state, this.pickAIMove()))
      })
    }
  }

  playColumn(idx) {
    var next_state = move(this.state, idx)

    if (this.state.ai !== null) {
      next_state = move(next_state, this.pickAIMove())
    }

    this.setState(next_state)
  }

  render() {
    return (
      <div className="connect-game">
        <AISelector onChangeAI={this.changeAI.bind(this)} />
        <Status
          currentPlayer={this.state.current_player}
          winner={this.state.winner}
          isTie={this.state.is_tie}
          />
        <Board.UI board={this.state.board} onColumnClick={this.playColumn.bind(this)} />
      </div>
    )
  }
}

export { ConnectGame, move, init_game }
