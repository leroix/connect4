import * as Board from './board'

it('is initialized with the correct number of rows and columns', () => {
  const board = Board.empty_board(3,3)
  expect(board.length).toBe(3)
  expect(board[0].length).toBe(3)
})

it('is indexable', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1
  board[1][1] = 4
  expect(Board.indices_to_board_values(board, [[0,0],[1,1]]).toString())
    .toBe('1,4')
})

it('can be full', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1; board[0][1] = 1; board[1][0] = 1; board[1][1] = 1
  expect(Board.is_full(board)).toBe(true)
})

it('can be less than full', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1
  expect(Board.is_full(board)).toBe(false)
})

it('is searchable for streaks', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1; board[0][1] = 1
  expect(Board.find_streak(board, 2)).toEqual([[0,0],[0,1]])
})

it('may not contain a streak', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1
  expect(Board.find_streak(board,2)).toBeFalsy()
})

it('may have a full column', () => {
  var board = Board.empty_board(2,2)
  board[0][0] = 1
  board[0][1] = 1
  expect(Board.column_is_full(board, 0)).toBe(true)
})

it('can have discs dropped into it', () => {
  var board = Board.empty_board(2,2)
  board = Board.drop_disc(board, 0, 'red')
  expect(board[0][0]).toBe('red')
})
