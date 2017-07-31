function range(start, end) {
  return Array.apply(null, Array(end-start)).map(function (_, i) {return i + start;})
}

function clone(board) {
  return board.map(col => col.slice(0))
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

function find_streak(board, num, color) {
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
          [board[k - num + 1], left.bind(null,k,l)]
        , [board[k + num - 1], right.bind(null,k,l)]
        , [board[k][l - num + 1], up.bind(null,k,l)]
        , [board[k][l + num - 1], down.bind(null,k,l)]
        , [board[k - num + 1] && board[k - num + 1][l - num + 1], upleft.bind(null,k,l)]
        , [board[k - num + 1] && board[k - num + 1][l + num - 1], downleft.bind(null,k,l)]
        , [board[k + num - 1] && board[k + num - 1][l - num + 1], upright.bind(null,k,l)]
        , [board[k + num + 1] && board[k + num + 1][l + num - 1], downright.bind(null,k,l)]
        ]
        
        for (var rule_idx = 0; rule_idx < rules.length; rule_idx++) {
          if (rules[rule_idx][0]) {
            current_indices = range(0, num).map(rules[rule_idx][1])
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

export { empty_board, indices_to_board_values, find_streak, is_full, clone }
