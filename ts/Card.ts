export type CardChar = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
export type CardSymbol = 'spades' | 'clubs' | 'diamonds' | 'hearts'

export interface Values {
   character: CardChar,
   value: number,
   image: string,
   symbol: CardSymbol
}

interface Images {
   clubs: string,
   spades: string,
   diamonds: string,
   hearts: string
}

const imageSources: Images[] = [
   {
      clubs: '../images/2_of_clubs.png',
      spades: '../images/2_of_spades.png',
      diamonds: '../images/2_of_diamonds.png',
      hearts: '../images/2_of_hearts.png'
   },

   {
      clubs: '../images/3_of_clubs.png',
      spades: '../images/3_of_spades.png',
      diamonds: '../images/3_of_diamonds.png',
      hearts: '../images/3_of_hearts.png'
   },

   {
      clubs: '../images/4_of_clubs.png',
      spades: '../images/4_of_spades.png',
      diamonds: '../images/4_of_diamonds.png',
      hearts: '../images/4_of_hearts.png'
   },

   {
      clubs: '../images/5_of_clubs.png',
      spades: '../images/5_of_spades.png',
      diamonds: '../images/5_of_diamonds.png',
      hearts: '../images/5_of_hearts.png'
   },

   {
      clubs: '../images/6_of_clubs.png',
      spades: '../images/6_of_spades.png',
      diamonds: '../images/6_of_diamonds.png',
      hearts: '../images/6_of_hearts.png'
   },

   {
      clubs: '../images/7_of_clubs.png',
      spades: '../images/7_of_spades.png',
      diamonds: '../images/7_of_diamonds.png',
      hearts: '../images/7_of_hearts.png'
   },

   {
      clubs: '../images/8_of_clubs.png',
      spades: '../images/8_of_spades.png',
      diamonds: '../images/8_of_diamonds.png',
      hearts: '../images/8_of_hearts.png'
   },

   {
      clubs: '../images/9_of_clubs.png',
      spades: '../images/9_of_spades.png',
      diamonds: '../images/9_of_diamonds.png',
      hearts: '../images/9_of_hearts.png'
   },

   {
      clubs: '../images/10_of_clubs.png',
      spades: '../images/10_of_spades.png',
      diamonds: '../images/10_of_diamonds.png',
      hearts: '../images/10_of_hearts.png'
   },

   {
      clubs: '../images/jack_of_clubs2.png',
      spades: '../images/jack_of_spades2.png',
      diamonds: '../images/jack_of_diamonds2.png',
      hearts: '../images/jack_of_hearts2.png'
   },

   {
      clubs: '../images/queen_of_clubs2.png',
      spades: '../images/queen_of_spades2.png',
      diamonds: '../images/queen_of_diamonds2.png',
      hearts: '../images/queen_of_hearts2.png'
   },

   {
      clubs: '../images/king_of_clubs2.png',
      spades: '../images/king_of_spades2.png',
      diamonds: '../images/king_of_diamonds2.png',
      hearts: '../images/king_of_hearts2.png'
   },

   {
      clubs: '../images/ace_of_clubs.png',
      spades: '../images/ace_of_spades.png',
      diamonds: '../images/ace_of_diamonds.png',
      hearts: '../images/ace_of_hearts.png'
   }
]

interface SkipActiveCards {
   playerCards: Card[],
   enemyCards: Card[],
   middleCards: Card[]
}

export default class Card {
   private character: CardChar
   private symbol: CardSymbol
   private value: number
   private image: string

   public constructor(num: number, symbolNum: number) {
      this.value = num
      
      switch(num) {
         case 1: case 2: case 3: case 4: case 5:
         case 6: case 7: case 8: case 9:
            this.character = (num + 1).toString() as CardChar
         break;

         case 10:
            this.character = 'J'
         break;

         case 11:
            this.character = 'Q'
         break;

         case 12:
            this.character = 'K'
         break;

         case 13:
            this.character = 'A'
         break;

         default: throw new Error(`Error: number isnt beetween 1 and 13. Got number: ${ num }`)
      }

      switch(symbolNum) {
         case 1:
            this.symbol = 'spades'
         break;

         case 2:
            this.symbol = 'clubs'
         break;

         case 3:
            this.symbol = 'diamonds'
         break;

         case 4:
            this.symbol = 'hearts'
         break;

         default: this.symbol = 'spades'
      }

      this.image = imageSources[num - 1][this.symbol]
   }

   public static generateCard(skipCurrent?: SkipActiveCards): Card {
      if(skipCurrent) {
         const { playerCards, enemyCards } = skipCurrent

         while(true) {
            const card: Card = new Card(
               Math.floor( Math.random() * 13 ) + 1,
               Math.floor(Math.random() * 4) + 1
            )

            const joinedArray = [...playerCards, ...enemyCards]

            const valueExists: boolean = joinedArray.some(x => x.value === card.value)
            const symbolExists: boolean = joinedArray.some(x => x.symbol === card.symbol)

            if(valueExists && symbolExists) continue

            return card
         }
      }

      const randomNr: number = Math.floor( Math.random() * 13 ) + 1
      const randomSymbol: number = Math.floor(Math.random() * 4) + 1

      return new Card(randomNr, randomSymbol)
   }

   public appendCard(container: HTMLElement, hideCard?: boolean): void {
      const img = document.createElement('img')

      img.src = hideCard ? '../images/back.png' : this.image

      container.appendChild(img)
   }

   public returnValues(): Values {
      return {
         character: this.character,
         value: this.value,
         symbol: this.symbol,
         image: this.image
      }
   }
}