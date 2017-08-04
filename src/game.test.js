import * as Game from './game'

it('transitions properly on a move', () => {
  var game = Game.init_game(4,4,2,'red','black')

  game = Game.move(game, 0)
  
  expect(game.current_player).toBe('black')
  expect(game.next_player).toBe('red')
})

it('detects a tie', () => {
  var game = Game.init_game(2,2,3,'red','black')

  ;[0,0,1,1].forEach(function (col) {
    game = Game.move(game, col)
  })

  expect(game.is_tie).toBe(true)
})

it('detects a winner', () => {
  var game = Game.init_game(2,2,2,'red','black')

  ;[0,1,0].forEach(function(col) {
    game = Game.move(game, col)
  })

  expect(game.winner).toBe('red')
})
