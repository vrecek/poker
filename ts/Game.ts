import Card from "./Card.js"
import { CardChar, Values, CardSymbol } from './Card.js'

type PlayerName = 'player' | 'enemy'
type SectionType = 'player' | 'enemy' | 'middle'
type Combos = 'One pair' | 'Two pairs' | 'Three of a kind' | 'Four of a kind' | 'Straight' | 'Full' | 'Poker' | 'Colour' | 'High card'

interface Info {
   cards: Card[],
   container: HTMLElement
}

interface CardInfo {
   char: CardChar,
   val: number,
   sym: CardSymbol
}

interface MiddleInfo extends Info {
   pool: number,
   poolCont: HTMLSpanElement
}

interface GamerInfo extends Info {
   cash: number,
   bet: number,
   betCont: HTMLSpanElement,
   cashCont: HTMLSpanElement,
   comboCont?: HTMLSpanElement,
   combo: Combos,
   hasChecked: boolean,
   checkCont: HTMLHeadingElement
}

export default class Game {
   private resultHeader: HTMLHeadingElement | undefined

   private winner: PlayerName | 'draw' | null

   private player: GamerInfo
   private enemy: GamerInfo
   private middle: MiddleInfo

   private mainCont: HTMLElement

   private startBtn: HTMLButtonElement
   private betSection: HTMLDivElement
   private checkBtn: HTMLButtonElement
   private foldBtn: HTMLButtonElement
   private restartBtn: HTMLButtonElement

   public constructor(
      pc: HTMLElement, ec: HTMLElement, mc: HTMLElement, 
      sb: HTMLButtonElement, bs: HTMLDivElement, cb: HTMLButtonElement, fb: HTMLButtonElement, rb: HTMLButtonElement,
      pb: HTMLSpanElement, eb: HTMLSpanElement, mpc: HTMLSpanElement,
      plCC: HTMLSpanElement, enCC: HTMLSpanElement,
      pcc: HTMLSpanElement, phc:HTMLHeadingElement, ehc:HTMLHeadingElement,
      mainc: HTMLElement
   ) {
      this.player = {
         cards: [],
         cash: 500,
         container: pc,
         bet: 0,
         betCont: pb,
         cashCont: plCC,
         comboCont: pcc,
         combo: 'High card',
         hasChecked: false,
         checkCont: phc
      }

      this.enemy = {
         cards: [],
         cash: 500,
         container: ec,
         bet: 0,
         betCont: eb,
         cashCont: enCC,
         combo: 'High card',
         hasChecked: false,
         checkCont: ehc
      }

      this.middle = {
         cards: [],
         container: mc,
         pool: 0,
         poolCont: mpc
      }

      this.winner = null

      this.mainCont = mainc

      this.startBtn = sb
      this.betSection = bs
      this.checkBtn = cb
      this.foldBtn = fb
      this.restartBtn = rb
   }

   private randomNumber(min: number, max: number): number {
      return Math.abs( Math.floor( Math.random() * (max - min + 1) - max ) )
   }

   private returnCardsInfo(who: SectionType): CardInfo[] {
      return this[who].cards.map(x => {
         const vals: Values = x.returnValues()
         return { char: vals.character, val: vals.value, sym: vals.symbol }
      })
   }

   private comboValues(): number[] {
      const vals = [this.player.combo, this.enemy.combo].map(x => {
         switch(x) {
            case 'High card': return 0
            case 'One pair': return 1
            case 'Two pairs': return 2
            case 'Three of a kind': return 3
            case 'Straight': return 4
            case 'Colour': return 5
            case 'Full': return 6
            case 'Four of a kind': return 7
            case 'Poker': return 8
            default: return 0
         }
      })

      if(vals[0] === vals[1]) {
         // higher card
      }

      return vals
   }

   private checkChecked(lastMove: PlayerName, skip?: boolean): void {
      const isFinished: boolean = this.isGameFinishedBool()
      if(this.enemy.hasChecked && this.player.hasChecked) {
         if(isFinished) return

         this.enemy.hasChecked = false
         this.player.hasChecked = false

         this.enemy.checkCont.textContent = ''
         this.player.checkCont.textContent = ''

         this.drawCard('middle')
         this.cardsCombos('player')

         return
      }

      if(lastMove === 'player' && !skip) {
         this.animateEnemyMove()

         const btns = [this.betSection, this.foldBtn]
         this.checkBtn.style.display = 'none'

         for(let x of btns) x.style.display = 'none'

         setTimeout(() => {
            for(let x of btns) x.style.display = 'block'

            this.enemyMove()

            this.displayAll() 
         }, 2000)
      }
   }

   private resetRoundMoney(): void {
      this.player.bet = 0
      this.enemy.bet = 0
      this.middle.pool = 0
   }

   private displayAll(): void {
      const [pb, eb] = [this.player.bet, this.enemy.bet]

      this.player.betCont.textContent = `${ pb } $`
      this.enemy.betCont.textContent = `${ eb } $`

      this.player.cashCont.textContent = `${ this.player.cash }$`
      this.enemy.cashCont.textContent = `${ this.enemy.cash }$`

      this.middle.poolCont.textContent = `${ pb + eb } $`

      this.player.comboCont!.textContent = this.player.combo

      this.enemy.checkCont.textContent = this.enemy.hasChecked ? 'check' : ''
      this.player.checkCont.textContent = this.player.hasChecked ? 'check' : ''
   }

   private isGameFinishedBool(): boolean {
      return this.middle.cards.length === 5 && (this.enemy.hasChecked && this.player.hasChecked)
   }

   private moneyChange(who: PlayerName, num: number) {
      this[who].bet += num
      this[who].cash -= num
      this.middle.pool += num
   }

   private animateEnemyMove(): void {
      const span = document.createElement('span')
      span.className = 'enemy-anim'
      span.textContent = 'Enemy is thinking...'

      this.enemy.container.appendChild(span)

      setTimeout(() => span.remove(), 2000)
   }

   private drawCard(toWho: SectionType): void {
      const card: Card = Card.generateCard({
         playerCards: this.player.cards,
         enemyCards: this.enemy.cards,
         middleCards: this.middle.cards
      })

      const isEnemyMove: boolean = toWho === 'enemy'

      card.appendCard(this[toWho].container, isEnemyMove)

      this[toWho].cards.push(card)
   }

   private cardsCombos(who: PlayerName): void {
      const combo = this.returnCardsInfo(who)
      const middleCombo = this.returnCardsInfo('middle')

      let comboTxt: Combos = 'High card'

      const charCount: any = {}
      for(let x of [...combo, ...middleCombo]) {
         const keys = Object.keys(charCount)

         if(!keys.includes(x.char)) {
            Object.assign(charCount, { [x.char]: 1 })

            continue
         }

         charCount[x.char] += 1
      }

      const vals = Object.values(charCount)

      if(vals.some(x => x === 2)) comboTxt = 'One pair'

      let count = 0
      for(let x of vals) if(x === 2) count++
      if(count === 2) comboTxt = 'Two pairs'

      if(vals.some(x => x === 3)) comboTxt = 'Three of a kind'

      // str

      if(vals.some(x => x === 4)) comboTxt = 'Four of a kind'

      if(vals.includes(2) && vals.includes(3)) comboTxt = 'Full'
      
      this[who].combo = comboTxt
   }

   private enemyMove(): void {
      const btns = [this.betSection, this.startBtn, this.foldBtn, this.restartBtn]

      for(let x of btns) x.style.pointerEvents = 'none'
      this.checkBtn.style.display = 'none'

      const shouldEqual: boolean = this.randomNumber(1, 2) === 1
      const equalMoney = this.player.bet - this.enemy.bet

      outer: if(true) {
         if(this.player.bet === this.enemy.bet) {
            this.enemy.hasChecked = true
            this.checkBtn.style.display = 'block'

            this.checkChecked('enemy')

            if(this.isGameFinishedBool()) {
               this.gameFinishHelp()
               return
            }

            break outer
         }

         this.moneyChange('enemy', equalMoney)
      }
      else {
         const randomMoney: number = this.randomNumber(equalMoney + 1, equalMoney + 10)

         this.moneyChange('enemy', randomMoney)
      }

      if(this.player.hasChecked && (this.enemy.bet !== this.player.bet)) {
         this.player.hasChecked = false
         this.checkBtn.style.display = 'none'
      }
      
      for(let x of btns) x.style.pointerEvents = 'all'
   }

   private gameFinishHelp() {
      this.cardsCombos('enemy')
      this.cardsCombos('player')

      const [plrValue, enemyValue] = this.comboValues()

      this.restartBtn.style.pointerEvents = 'all'
      
      const winner = plrValue > enemyValue ? 'player' : enemyValue > plrValue ? 'enemy' : 'draw'
      this.finishGame(winner, this.mainCont)
   }

   private reverseEnemyCards(): void {
      for(let x of Array.from(this.enemy.container.children)) {
         if(x.tagName !== 'IMG') continue

         x.remove()
      }

      for(let x of this.enemy.cards) {
         x.appendCard(this.enemy.container)
      }
   }


   public check(who: PlayerName): void {
      this[who].hasChecked = true

      this.checkChecked('player', false)

      if(this.isGameFinishedBool()) {
         this.gameFinishHelp()
         return
      }

      this.displayAll()
   }

   public placeBet(who: PlayerName, plrPrice?: number): void {
      let wait: boolean = false

      if(who === 'player' && plrPrice) {

         if(plrPrice > this[who].cash) {
            this[who].bet += this[who].cash
            this[who].cash = 0
         }

         this.moneyChange(who, plrPrice)
      }
      else if(who === 'enemy') {
         this.animateEnemyMove()

         this.foldBtn.style.display = 'none'
         this.betSection.style.display = 'none'
         this.checkBtn.style.display = 'none'

         wait = true 

         setTimeout(() => {
            this.enemyMove()

            this.foldBtn.style.display = 'block'
            this.betSection.style.display = 'block'

            if(this.enemy.bet === this.player.bet) {
               this.checkBtn.style.display = 'block'
            }
         }, 2000);
      }

      if(wait) {
         setTimeout(() => {
            this.displayAll()
            this.checkChecked('enemy')
         }, 2000)

         return
      }

      if(who === 'player' && this.enemy.hasChecked) {
         this.enemy.hasChecked = false
         this.enemy.checkCont.textContent = ''
      }

      this.displayAll()
      this.checkChecked('player', true)
   }

   public canPlrBet(plrBet: number): boolean {
      if(plrBet <= 0) return false

      if(this.player.bet + plrBet < this.enemy.bet) {
         return false
      }

      return true
   }

   public startGame(): void {
      [...Array(2)].map(x => this.drawCard('player'));
      [...Array(2)].map(x => this.drawCard('enemy'));

      this.cardsCombos('player')
      this.cardsCombos('enemy')
      this.displayAll()

      const num: number = this.randomNumber(1, 2)
      
      const plrPayMore: boolean = num % 2 === 0
      
      let wait: boolean = false

      if(plrPayMore) {
         this.player.bet += 2
         this.player.cash -= 2
         
         this.enemy.bet += 1
         this.enemy.cash -= 1

         this.startBtn.style.display = 'none'

         wait = true

         this.displayAll()

         this.enemyMove()

      } else {
         this.player.bet += 1
         this.player.cash -= 1

         this.enemy.bet += 2
         this.enemy.cash -= 2
      }

      const startEnd = () => {
         this.middle.pool = this.player.bet + this.enemy.bet

         this.foldBtn.style.display = 'block'
         this.betSection.style.display = 'block'
         this.startBtn.style.display = 'none'

         this.displayAll()
      }

      if(wait) {
         this.animateEnemyMove()
         setTimeout(() => { 
            startEnd() 

            if(this.enemy.bet === this.player.bet) {
               this.checkBtn.style.display = 'block'
            }
         }, 2000)

         return
      }

      startEnd()
   }

   public finishGame(whoWin: PlayerName | 'draw', appendResultTo: HTMLElement): void {
      for(let x of [this.betSection, this.startBtn, this.checkBtn, this.foldBtn]) x.style.display = 'none'

      this.reverseEnemyCards()

      const hasPlayerWon: boolean = whoWin === 'player'
      const isDraw: boolean = whoWin === 'draw'
      this.winner = whoWin

      const h4 = document.createElement('h4')
      h4.textContent = isDraw ? 'DRAW' : hasPlayerWon ? 'YOU HAVE WON' : 'ENEMY HAS WON'

      h4.className = `result ${ isDraw ? 'draw' : hasPlayerWon ? 'win' : 'lose' }`

      this.resultHeader = h4

      if(isDraw) {
         this.player.cash += this.player.bet
         this.enemy.cash += this.enemy.bet
      }
      else this[whoWin as PlayerName].cash += this.middle.pool

      this.resetRoundMoney()
      this.displayAll()

      appendResultTo.appendChild(h4)

      this.restartBtn.style.display = 'block'
   }

   public restartGame(): void {
      this.resetRoundMoney()
      this.displayAll()
      
      this.winner = null

      this.player.cards = []
      this.enemy.cards = []
      this.middle.cards = []

      this.player.combo = 'High card'
      this.enemy.combo = 'High card'

      this.enemy.hasChecked = false
      this.player.hasChecked = false

      this.enemy.checkCont.textContent = ''
      this.player.checkCont.textContent = ''

      this.player.comboCont!.textContent = 'none'

      this.restartBtn.style.display = 'none'
      this.startBtn.style.display = 'block'
      this?.resultHeader?.remove()

      for(let x of Array.from(this.player.container.children)) {
         if(x.tagName !== 'IMG') continue
         x.remove()
      }
      for(let x of Array.from(this.middle.container.children)) {
         if(x.tagName !== 'IMG' || x.classList.contains('stack')) continue
         x.remove()
      }
      for(let x of Array.from(this.enemy.container.children)) {
         if(x.tagName !== 'IMG') continue
         x.remove()
      }
   }

   public returnCash(who: PlayerName): number {
      return this[who].cash
   }
}