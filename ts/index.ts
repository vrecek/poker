import Card from "./Card.js"
import Game from "./Game.js"

const mainCont = document.querySelector('main') as HTMLElement

const startBtn = document.querySelector('.action.start') as HTMLButtonElement

const betSection = {
   section: document.querySelector('.bet') as HTMLDivElement,
   btn: document.querySelector('.bet button') as HTMLButtonElement,
   plus: document.querySelector('.bet .plus') as HTMLSpanElement,
   minus: document.querySelector('.bet .minus') as HTMLSpanElement,
   input: document.querySelector('.bet input') as HTMLInputElement
}

const checkBtn = document.querySelector('.action.check') as HTMLButtonElement
const foldBtn = document.querySelector('.action.surrender') as HTMLButtonElement
const restartBtn = document.querySelector('.action.restart') as HTMLButtonElement

const plrCombos = document.querySelector('.player-info .combos span') as HTMLSpanElement
const enemyCombos = document.querySelector('.enemy-info .combos') as HTMLHeadingElement

const plrBet = document.querySelector('.player-info h2 span') as HTMLSpanElement
const enemyBet = document.querySelector('.enemy-info h2 span') as HTMLSpanElement
const poolCont = document.querySelector('h4.total-pool span') as HTMLSpanElement

const plrCash = document.querySelector('.player-info .cash span') as HTMLSpanElement
const enemyCash = document.querySelector('.enemy-info .cash span') as HTMLSpanElement

const plrCheck = document.querySelector('.player-info h4') as HTMLHeadingElement
const enemyCheck = document.querySelector('.enemy-info h4') as HTMLHeadingElement

const enemyContainer = document.querySelector('.enemy-table') as HTMLInputElement
const playerContainer = document.querySelector('.player-table') as HTMLInputElement
const middleContainer = document.querySelector('.middle-table') as HTMLInputElement

const game = new Game(
   playerContainer, enemyContainer, middleContainer, 
   startBtn, betSection.section, checkBtn, foldBtn, restartBtn,
   plrBet, enemyBet, poolCont, plrCash, enemyCash,
   plrCombos, plrCheck, enemyCheck, enemyCombos,
   mainCont
)

game.restartGame()

startBtn.addEventListener('click', () => {
   game.startGame()
})

checkBtn.addEventListener('click', () => {
   game.check('player')
})

foldBtn.addEventListener('click', () => {
   game.finishGame('enemy', mainCont)
})

restartBtn.addEventListener('click', () => {
   game.restartGame()
})

betSection.btn.addEventListener('click', () => {
   const value: number = parseInt(betSection.input.value) || 0

   betSection.input.value = ''

   if(!game.canPlrBet(value)) return

   game.placeBet('player', value)
   game.placeBet('enemy')
})

betSection.plus.addEventListener('click', () => {
   const value = parseInt(betSection.input.value) || 0

   if(value + 1 > game.returnCash('player')) {
      return
   }

   betSection.input.value = `${ value + 1 }`
})

betSection.minus.addEventListener('click', () => {
   const value = parseInt(betSection.input.value) || 0

   if(value - 1 < 0) {
      return
   }

   betSection.input.value = `${ value - 1 }`
})
