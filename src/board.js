import React from 'react';

// A board is a 2D array where empty tiles are represented by null.
// Filled tiles are a string like 'red', 'black', 'yellow', etc.
// We're don't need to be opinionated about the colors used.

// helpers
function range(start, end) {
  return Array.apply(null, Array(end-start)).map(function (_, i) {return i + start;})
}

// Board functions
function clone(board) {
  return board.map(col => col.slice(0))
}

function num_columns(board) {
  return board.length
}

function empty_board(n_rows, n_columns) {
  const columns = new Array(n_columns).fill(null)

  return columns.map(function (_) {
    var column = new Array(n_rows).fill(null)
    return column
  })
}

function indices_to_board_values(board, indices) {
  return indices.map(idx => board[idx[0]][idx[1]])
}

function find_streak(board, streak_size, color) {
  // Iterates through each spot on the board and determines if a streak of size
  // streak_size originates from each spot. If a color is provided then it only
  // returns a streak of the given color.
  //
  // This could be more efficient since
  // there's double checking going on, but the sizes of boards are small enough
  // that it isn't noticeable.
  //
  // returns an array of 2D indices [[1,2], [1,3], ...]

  var current_indices
    , current_values
    , rules

  const left = (k,l,n) => [k-n,l]
  const right = (k,l,n) => [k+n,l]
  const up = (k,l,n) => [k,l-n]
  const down = (k,l,n) => [k,l+n]
  const upleft = (k,l,n) => [k-n,l-n]
  const upright = (k,l,n) => [k+n,l-n]
  const downleft = (k,l,n) => [k-n,l+n]
  const downright = (k,l,n) => [k+n,l+n]

  const is_same = (first_el, el) => el !== null && el === first_el

  for (var k = 0; k < board.length; k++) {
    for (var l = 0; l < board[0].length; l++) {
      if (board[k][l] !== null && (board[k][l] === color || color === undefined)) {
        rules = [
          [board[k - streak_size + 1], left.bind(null,k,l)]
        , [board[k + streak_size - 1], right.bind(null,k,l)]
        , [board[k][l - streak_size + 1], up.bind(null,k,l)]
        , [board[k][l + streak_size - 1], down.bind(null,k,l)]
        , [board[k - streak_size + 1] && board[k - streak_size + 1][l - streak_size + 1], upleft.bind(null,k,l)]
        , [board[k - streak_size + 1] && board[k - streak_size + 1][l + streak_size - 1], downleft.bind(null,k,l)]
        , [board[k + streak_size - 1] && board[k + streak_size - 1][l - streak_size + 1], upright.bind(null,k,l)]
        , [board[k + streak_size + 1] && board[k + streak_size + 1][l + streak_size - 1], downright.bind(null,k,l)]
        ]
        
        for (var rule_idx = 0; rule_idx < rules.length; rule_idx++) {
          if (rules[rule_idx][0]) {
            current_indices = range(0, streak_size).map(rules[rule_idx][1])
            current_values = indices_to_board_values(board, current_indices)

            if (current_values.every(is_same.bind(null, current_values[0]))) {
              return current_indices
            }
          }
        }
      }
    }
  }
}

function is_full(board) {
  return board.map(column => {
    return column.every(el => el !== null)
  }).every(el => el)
}

function column_is_full(board, column_idx) {
  const first_empty_idx = board[column_idx].indexOf(null)
  return first_empty_idx === -1
}

function drop_disc(board, column_idx, color) {
  var new_board, column

  if (column_is_full(board, column_idx)) {
    return board
  } else {
    new_board = clone(board)

    column = new_board[column_idx]

    new_board[column_idx][column.indexOf(null)] = color

    return new_board
  }
}

function UI(props) {
  return (
    <div className="board">
      {props.board && props.board.map((column, idx) => {
        return (
          <div
            className="column"
            onClick={props.onColumnClick.bind(null, idx)}
            key={idx}
            >
            {
            // slice first because .reverse mutates
            }
            {column.slice(0).reverse().map((tile_color, _idx) => {
              return (
                <div className="tile" key={_idx}>
                  <div
                    className="tile__circle"
                    style={tile_color && {backgroundColor: tile_color}}>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export { 
  empty_board
  ,indices_to_board_values
  ,find_streak
  ,is_full
  ,column_is_full
  ,num_columns
  ,drop_disc
  ,clone
  ,UI
}
