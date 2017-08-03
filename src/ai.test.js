import * as AI from './ai'
import * as Board from './board'

describe('random ai', () => {
  it('returns null if board is full', () => {
    var board = Board.empty_board(2,2)

    board = Board.drop_disc(board, 0, 'red')
    board = Board.drop_disc(board, 0, 'red')
    board = Board.drop_disc(board, 1, 'red')
    board = Board.drop_disc(board, 1, 'red')

    expect(AI.random_ai(board)).toBe(null)
  })

  it('returns a column index for the next move', () => {
    const board = Board.empty_board(2,2)
    const column_idx = AI.random_ai(board)

    expect(column_idx).toBeGreaterThanOrEqual(0)
    expect(column_idx).toBeLessThanOrEqual(1)
  })
})

describe('basic ai', () => {
  it('should find the win', () => {
    var board = Board.empty_board(4,4)
    board = Board.drop_disc(board, 0, 'red')
    expect(AI.basic_ai(board, 'red', 'black', 2)).toBe(0)
  })

  it('should block the win', () => {
    var board = Board.empty_board(4,4)
    board = Board.drop_disc(board, 0, 'red')
    board = Board.drop_disc(board, 0, 'red')
    expect(AI.basic_ai(board, 'black', 'red', 3)).toBe(0)
  })
})
