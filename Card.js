const imageSources = [
    {
        clubs: './images/card-2-of-clubs.png',
        spades: './images/card-2-of-spades.png',
        diamonds: './images/card-2-of-diamonds.png',
        hearts: './images/card-2-of-hearts.png'
    },
    {
        clubs: './images/card-3-of-clubs.png',
        spades: './images/card-3-of-spades.png',
        diamonds: './images/card-3-of-diamonds.png',
        hearts: './images/card-3-of-hearts.png'
    },
    {
        clubs: './images/card-4-of-clubs.png',
        spades: './images/card-4-of-spades.png',
        diamonds: './images/card-4-of-diamonds.png',
        hearts: './images/card-4-of-hearts.png'
    },
    {
        clubs: './images/card-5-of-clubs.png',
        spades: './images/card-5-of-spades.png',
        diamonds: './images/card-5-of-diamonds.png',
        hearts: './images/card-5-of-hearts.png'
    },
    {
        clubs: './images/card-6-of-clubs.png',
        spades: './images/card-6-of-spades.png',
        diamonds: './images/card-6-of-diamonds.png',
        hearts: './images/card-6-of-hearts.png'
    },
    {
        clubs: './images/card-7-of-clubs.png',
        spades: './images/card-7-of-spades.png',
        diamonds: './images/card-7-of-diamonds.png',
        hearts: './images/card-7-of-hearts.png'
    },
    {
        clubs: './images/card-8-of-clubs.png',
        spades: './images/card-8-of-spades.png',
        diamonds: './images/card-8-of-diamonds.png',
        hearts: './images/card-8-of-hearts.png'
    },
    {
        clubs: './images/card-9-of-clubs.png',
        spades: './images/card-9-of-spades.png',
        diamonds: './images/card-9-of-diamonds.png',
        hearts: './images/card-9-of-hearts.png'
    },
    {
        clubs: './images/card-10-of-clubs.png',
        spades: './images/card-10-of-spades.png',
        diamonds: './images/card-10-of-diamonds.png',
        hearts: './images/card-10-of-hearts.png'
    },
    {
        clubs: './images/card-jack-of-clubs2.png',
        spades: './images/card-jack-of-spades2.png',
        diamonds: './images/card-jack-of-diamonds2.png',
        hearts: './images/card-jack-of-hearts2.png'
    },
    {
        clubs: './images/card-queen-of-clubs2.png',
        spades: './images/card-queen-of-spades2.png',
        diamonds: './images/card-queen-of-diamonds2.png',
        hearts: './images/card-queen-of-hearts2.png'
    },
    {
        clubs: './images/card-king-of-clubs2.png',
        spades: './images/card-king-of-spades2.png',
        diamonds: './images/card-king-of-diamonds2.png',
        hearts: './images/card-king-of-hearts2.png'
    },
    {
        clubs: './images/card-ace-of-clubs.png',
        spades: './images/card-ace-of-spades.png',
        diamonds: './images/card-ace-of-diamonds.png',
        hearts: './images/card-ace-of-hearts.png'
    }
];
export default class Card {
    character;
    symbol;
    value;
    image;
    constructor(num, symbolNum) {
        this.value = num;
        switch (num) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                this.character = (num + 1).toString();
                break;
            case 10:
                this.character = 'J';
                break;
            case 11:
                this.character = 'Q';
                break;
            case 12:
                this.character = 'K';
                break;
            case 13:
                this.character = 'A';
                break;
            default: throw new Error(`Error: number isnt beetween 1 and 13. Got number: ${num}`);
        }
        switch (symbolNum) {
            case 1:
                this.symbol = 'spades';
                break;
            case 2:
                this.symbol = 'clubs';
                break;
            case 3:
                this.symbol = 'diamonds';
                break;
            case 4:
                this.symbol = 'hearts';
                break;
            default: this.symbol = 'spades';
        }
        this.image = imageSources[num - 1][this.symbol];
    }
    static generateCard(skipCurrent) {
        if (skipCurrent) {
            const { playerCards, enemyCards } = skipCurrent;
            while (true) {
                const card = new Card(Math.floor(Math.random() * 13) + 1, Math.floor(Math.random() * 4) + 1);
                const joinedArray = [...playerCards, ...enemyCards];
                const valueExists = joinedArray.some(x => x.value === card.value);
                const symbolExists = joinedArray.some(x => x.symbol === card.symbol);
                if (valueExists && symbolExists)
                    continue;
                return card;
            }
        }
        const randomNr = Math.floor(Math.random() * 13) + 1;
        const randomSymbol = Math.floor(Math.random() * 4) + 1;
        return new Card(randomNr, randomSymbol);
    }
    appendCard(container, hideCard) {
        const img = document.createElement('img');
        img.src = hideCard ? './images/back.png' : this.image;
        container.appendChild(img);
    }
    returnValues() {
        return {
            character: this.character,
            value: this.value,
            symbol: this.symbol,
            image: this.image
        };
    }
}
