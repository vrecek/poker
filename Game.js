import Card from "./Card.js";
export default class Game {
    resultHeader;
    winner;
    lastPlrBet;
    isFinished;
    player;
    enemy;
    middle;
    enemyFirstMove;
    mainCont;
    startBtn;
    betSection;
    checkBtn;
    foldBtn;
    restartBtn;
    constructor(pc, ec, mc, sb, bs, cb, fb, rb, pb, eb, mpc, plCC, enCC, pcc, phc, ehc, ecc, mainc) {
        this.player = {
            cards: [],
            cash: 1000,
            container: pc,
            bet: 0,
            betCont: pb,
            cashCont: plCC,
            comboCont: pcc,
            combo: 'High card',
            hasChecked: false,
            checkCont: phc,
            comboPower: 0
        };
        this.enemy = {
            cards: [],
            cash: 1000,
            container: ec,
            bet: 0,
            betCont: eb,
            cashCont: enCC,
            combo: 'High card',
            hasChecked: false,
            checkCont: ehc,
            comboCont: ecc,
            comboPower: 0
        };
        this.middle = {
            cards: [],
            container: mc,
            pool: 0,
            poolCont: mpc
        };
        this.winner = null;
        this.lastPlrBet = 0;
        this.enemyFirstMove = 1;
        this.isFinished = false;
        this.mainCont = mainc;
        this.startBtn = sb;
        this.betSection = bs;
        this.checkBtn = cb;
        this.foldBtn = fb;
        this.restartBtn = rb;
    }
    randomNumber(min, max) {
        return Math.abs(Math.floor(Math.random() * (max - min + 1) - max));
    }
    returnCardsInfo(who) {
        return this[who].cards.map(x => {
            const vals = x.returnValues();
            return { char: vals.character, val: vals.value, sym: vals.symbol };
        });
    }
    countDup(arr, key) {
        let obj = {};
        if (key) {
            for (let x of arr) {
                if (!obj[x[key]]) {
                    Object.assign(obj, { [x[key]]: 1 });
                    continue;
                }
                obj[x[key]] += 1;
            }
            return obj;
        }
        for (let x of arr) {
            const xs = x.toString();
            if (!obj[xs]) {
                Object.assign(obj, { [xs]: 1 });
                continue;
            }
            obj[xs] += 1;
        }
        return obj;
    }
    countPairValue(arr, type, mathMin) {
        const dupes = this.countDup(arr);
        const cardValues = [];
        for (let x in dupes) {
            if (dupes[x] === type) {
                cardValues.push(parseInt(x));
            }
        }
        if (mathMin)
            return Math.min(...cardValues) || 0;
        return Math.max(...cardValues) || 0;
    }
    returnComboValue(x, reverse) {
        switch (x) {
            case 'High card': return 0;
            case 'Pair': return 1;
            case 'Two pairs': return 2;
            case 'Three of a kind': return 3;
            case 'Straight': return 4;
            case 'Flush': return 5;
            case 'Full house': return 6;
            case 'Four of a kind': return 7;
            case 'Poker': return 8;
            default: return 0;
        }
    }
    comboValues() {
        const [pc, ec] = [this.player.combo, this.enemy.combo];
        const [pCards, eCards] = [
            this.player.cards.map(x => x.returnValues().value),
            this.enemy.cards.map(x => x.returnValues().value)
        ];
        const [pJoint, eJoint] = [
            [...this.player.cards, ...this.middle.cards].map(x => x.returnValues().value),
            [...this.enemy.cards, ...this.middle.cards].map(x => x.returnValues().value)
        ];
        const vals = [pc, ec].map(x => this.returnComboValue(x));
        if (vals[0] === vals[1]) {
            if (pc === 'High card' || pc === 'Flush') {
                if (Math.max(...pCards) > Math.max(...eCards))
                    vals[0]++;
                else if (Math.max(...eCards) > Math.max(...pCards))
                    vals[1]++;
            }
            else if (pc === 'Pair' || pc === 'Two pairs' || pc === 'Three of a kind' || pc === 'Four of a kind') {
                let num = 2;
                switch (pc) {
                    case 'Three of a kind':
                        num = 3;
                        break;
                    case 'Four of a kind':
                        num = 4;
                        break;
                }
                const [pVal, eVal] = [this.countPairValue(pJoint, num), this.countPairValue(eJoint, num)];
                if (pVal > eVal)
                    vals[0]++;
                else if (eVal > pVal)
                    vals[1]++;
                if (vals[0] === vals[1] && pc === 'Two pairs') {
                    const [pVal, eVal] = [this.countPairValue(pJoint, num, true), this.countPairValue(eJoint, num, true)];
                    if (pVal > eVal)
                        vals[0]++;
                    else if (eVal > pVal)
                        vals[1]++;
                }
            }
            else if (pc === 'Straight' || pc === 'Poker') {
                if (this.player.comboPower > this.enemy.comboPower)
                    vals[0]++;
                else if (this.enemy.comboPower > this.player.comboPower)
                    vals[1]++;
            }
            else if (pc === 'Full house') {
                const [p3Val, e3Val] = [this.countPairValue(pJoint, 3), this.countPairValue(eJoint, 3)];
                if (p3Val > e3Val) {
                    vals[0]++;
                    return vals;
                }
                else if (e3Val > p3Val) {
                    vals[1]++;
                    return vals;
                }
                const [p2Val, e2Val] = [this.countPairValue(pJoint, 2), this.countPairValue(eJoint, 2)];
                if (p2Val > e2Val)
                    vals[0]++;
                else if (e2Val > p2Val)
                    vals[1]++;
            }
        }
        return vals;
    }
    checkChecked(lastMove, skip) {
        const isFinished = this.isGameFinishedBool();
        if (isFinished)
            return;
        if (this.enemy.hasChecked && this.player.hasChecked) {
            this.enemy.hasChecked = false;
            this.player.hasChecked = false;
            this.enemy.checkCont.textContent = '';
            this.player.checkCont.textContent = '';
            this.drawCard('middle');
            this.cardsCombos('player');
            return;
        }
        if (lastMove === 'player' && !skip) {
            this.animateEnemyMove();
            const btns = [this.betSection, this.foldBtn];
            this.checkBtn.style.display = 'none';
            for (let x of btns)
                x.style.display = 'none';
            setTimeout(() => {
                for (let x of btns)
                    x.style.display = 'block';
                this.enemyMove();
                this.displayAll();
            }, 2000);
        }
    }
    resetRoundMoney() {
        this.player.bet = 0;
        this.enemy.bet = 0;
        this.middle.pool = 0;
    }
    displayAll() {
        const [pb, eb] = [this.player.bet, this.enemy.bet];
        this.player.betCont.textContent = `${pb} $`;
        this.enemy.betCont.textContent = `${eb} $`;
        this.player.cashCont.textContent = `${this.player.cash}$`;
        this.enemy.cashCont.textContent = `${this.enemy.cash}$`;
        this.middle.poolCont.textContent = `${pb + eb} $`;
        this.player.comboCont.textContent = this.player.combo;
        this.enemy.comboCont.children[0].textContent = this.enemy.combo;
        this.enemy.checkCont.textContent = this.enemy.hasChecked ? 'check' : '';
        this.player.checkCont.textContent = this.player.hasChecked ? 'check' : '';
    }
    isGameFinishedBool() {
        const [pc, ec] = [this.player.cash, this.enemy.cash];
        return this.middle.cards.length === 5 && (this.enemy.hasChecked && this.player.hasChecked);
    }
    moneyChange(who, num) {
        this[who].bet += num;
        this[who].cash -= num;
        this.middle.pool += num;
    }
    animateEnemyMove() {
        const span = document.createElement('span');
        span.className = 'enemy-anim';
        span.textContent = 'Enemy is thinking...';
        this.enemy.container.appendChild(span);
        setTimeout(() => span.remove(), 2000);
    }
    drawCard(toWho) {
        const card = Card.generateCard({
            playerCards: this.player.cards,
            enemyCards: this.enemy.cards,
            middleCards: this.middle.cards
        });
        const isEnemyMove = toWho === 'enemy';
        card.appendCard(this[toWho].container, isEnemyMove);
        this[toWho].cards.push(card);
    }
    cardsCombos(who) {
        const combo = this.returnCardsInfo(who);
        const middleCombo = this.returnCardsInfo('middle');
        let comboTxt = 'High card';
        const charCount = {};
        const joinedCards = [...combo, ...middleCombo].sort((a, b) => a.val - b.val);
        for (let x of joinedCards) {
            const keys = Object.keys(charCount);
            if (!keys.includes(x.char)) {
                Object.assign(charCount, { [x.char]: 1 });
                continue;
            }
            charCount[x.char] += 1;
        }
        const vals = Object.values(charCount);
        if (vals.some(x => x === 2))
            comboTxt = 'Pair';
        let count = 0;
        for (let x of vals)
            if (x === 2)
                count++;
        if (count === 2)
            comboTxt = 'Two pairs';
        if (vals.some(x => x === 3))
            comboTxt = 'Three of a kind';
        let isColor = false;
        const colorObj = this.countDup(joinedCards, 'sym');
        if (Object.values(colorObj).some(x => x === 5)) {
            comboTxt = 'Flush';
            isColor = true;
        }
        let straightValues = [];
        let isStraight = false;
        for (let i = 0; i < joinedCards.length; i++) {
            const { val } = joinedCards[i];
            if (straightValues.includes(val))
                continue;
            straightValues.push(val);
        }
        straightValues = straightValues.sort((a, b) => a - b);
        const comboNrs = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6],
            [3, 4, 5, 6, 7],
            [4, 5, 6, 7, 8],
            [5, 6, 7, 8, 9],
            [6, 7, 8, 9, 10],
            [7, 8, 9, 10, 11],
            [8, 9, 10, 11, 12],
            [9, 10, 11, 12, 13],
        ];
        let strPower = 0;
        if (comboNrs.some((x, i) => {
            strPower = i;
            return x.every(y => straightValues.indexOf(y) !== -1);
        })) {
            this[who].comboPower = strPower;
            isStraight = true;
            comboTxt = 'Straight';
        }
        if (vals.includes(2) && vals.includes(3))
            comboTxt = 'Full house';
        if (vals.some(x => x === 4))
            comboTxt = 'Four of a kind';
        if (isColor && isStraight)
            comboTxt = 'Poker';
        this[who].combo = comboTxt;
    }
    percentVal(num, percent) {
        return parseInt(((num / 100) * percent).toFixed(0));
    }
    shouldBluff() {
        const half = this.randomNumber(0, 100);
        if (half > 75)
            return true;
        return false;
    }
    shouldEnemyFold() {
        const ENEMY_COMBO = this.returnComboValue(this.enemy.combo) + 1;
        const CARD_NUM = this.middle.cards.length + 1;
        const rand = this.randomNumber(0, 10);
        const percVal = this.percentVal(this.enemy.cash - this.middle.pool, (rand + 1) * (ENEMY_COMBO + CARD_NUM));
        if (this.middle.pool >= (this.enemy.cash / 2)) {
            const rand = this.randomNumber(0, 100);
            if (rand > 80)
                return true;
            return false;
        }
        if (this.lastPlrBet > percVal || rand > ENEMY_COMBO + CARD_NUM) {
            if (this.shouldBluff())
                return false;
            return true;
        }
        return false;
    }
    shouldEnemyEqual() {
        const ENEMY_COMBO = this.returnComboValue(this.enemy.combo);
        const rand = this.randomNumber(0, 10);
        const randReturn = this.randomNumber(0, 100);
        if (ENEMY_COMBO > rand) {
            if (randReturn > 75)
                return false;
            return true;
        }
        if (randReturn > 50)
            return false;
        return true;
    }
    enemyMove() {
        const btns = [this.betSection, this.startBtn, this.foldBtn, this.restartBtn];
        for (let x of btns)
            x.style.pointerEvents = 'none';
        this.checkBtn.style.display = 'none';
        const concludeMove = () => {
            if (this.player.hasChecked && (this.enemy.bet !== this.player.bet)) {
                this.player.hasChecked = false;
                this.checkBtn.style.display = 'none';
            }
            for (let x of btns)
                x.style.pointerEvents = 'all';
        };
        if (this.shouldEnemyFold() && this.enemyFirstMove !== 1) {
            concludeMove();
            this.finishGame('player', this.mainCont);
            return true;
        }
        if (this.enemy.cash < this.player.bet) {
            this.moneyChange('enemy', this.enemy.cash);
            return true;
        }
        const isPlayerEmpty = this.player.cash === 0;
        const equalMoney = this.player.bet - this.enemy.bet;
        if (this.shouldEnemyEqual() || isPlayerEmpty) {
            if (this.player.bet === this.enemy.bet) {
                if (isPlayerEmpty)
                    return true;
                this.enemy.hasChecked = true;
                this.checkBtn.style.display = 'block';
                this.checkChecked('enemy');
                if (this.isGameFinishedBool()) {
                    this.gameFinishHelp();
                    return;
                }
                concludeMove();
                return;
            }
            this.moneyChange('enemy', equalMoney);
            if (isPlayerEmpty)
                return true;
            concludeMove();
            return;
        }
        const [cLen, combo] = [
            this.randomNumber(0, 10 * this.middle.cards.length + 1),
            this.randomNumber(0, 10 * this.returnComboValue(this.enemy.combo) + 1)
        ];
        const randomMoney = this.randomNumber(equalMoney + 1, equalMoney + this.randomNumber(cLen + combo, (this.enemy.cash / (10 - combo))));
        this.moneyChange('enemy', randomMoney);
        concludeMove();
    }
    gameFinishHelp() {
        console.log('help');
        this.cardsCombos('enemy');
        this.cardsCombos('player');
        const [plrValue, enemyValue] = this.comboValues();
        this.restartBtn.style.pointerEvents = 'all';
        const winner = plrValue > enemyValue ? 'player' : enemyValue > plrValue ? 'enemy' : 'draw';
        this.finishGame(winner, this.mainCont);
    }
    reverseEnemyCards() {
        for (let x of Array.from(this.enemy.container.children)) {
            if (x.tagName !== 'IMG')
                continue;
            x.remove();
        }
        for (let x of this.enemy.cards) {
            x.appendCard(this.enemy.container);
        }
    }
    check(who) {
        this[who].hasChecked = true;
        this.checkChecked('player', false);
        if (this.isGameFinishedBool()) {
            this.gameFinishHelp();
            return;
        }
        this.displayAll();
    }
    placeBet(who, plrPrice) {
        let wait = false;
        this.enemyFirstMove = 2;
        if (who === 'player' && plrPrice) {
            if (plrPrice > this.player.cash) {
                this.lastPlrBet = this.player.cash;
                this[who].bet += this[who].cash;
                this.middle.pool += this[who].cash;
                this[who].cash = 0;
            }
            else {
                this.lastPlrBet = plrPrice;
                this.moneyChange(who, plrPrice);
            }
            if (this.enemy.cash === 0) {
                while (this.middle.cards.length < 5)
                    this.drawCard('middle');
                this.gameFinishHelp();
                return;
            }
        }
        else if (who === 'enemy') {
            this.animateEnemyMove();
            this.foldBtn.style.display = 'none';
            this.betSection.style.display = 'none';
            this.checkBtn.style.display = 'none';
            wait = true;
            setTimeout(() => {
                const hasEnded = this.enemyMove();
                if (hasEnded) {
                    while (this.middle.cards.length < 5)
                        this.drawCard('middle');
                    this.gameFinishHelp();
                    return;
                }
                this.foldBtn.style.display = 'block';
                this.betSection.style.display = 'block';
                if (this.enemy.bet === this.player.bet) {
                    this.checkBtn.style.display = 'block';
                }
            }, 2000);
        }
        if (wait) {
            setTimeout(() => {
                this.displayAll();
                this.checkChecked('enemy');
            }, 2000);
            return;
        }
        if (who === 'player' && this.enemy.hasChecked) {
            this.enemy.hasChecked = false;
            this.enemy.checkCont.textContent = '';
        }
        this.displayAll();
        this.checkChecked('player', true);
    }
    canPlrBet(plrBet) {
        if (plrBet <= 0)
            return false;
        if (this.player.bet + plrBet < this.enemy.bet) {
            return false;
        }
        return true;
    }
    startGame() {
        [...Array(2)].map(x => this.drawCard('player'));
        [...Array(2)].map(x => this.drawCard('enemy'));
        this.cardsCombos('player');
        this.cardsCombos('enemy');
        this.displayAll();
        const num = this.randomNumber(1, 2);
        const plrPayMore = num % 2 === 0;
        let wait = false;
        if (plrPayMore) {
            this.player.bet += 2;
            this.player.cash -= 2;
            this.enemy.bet += 1;
            this.enemy.cash -= 1;
            this.startBtn.style.display = 'none';
            wait = true;
            this.displayAll();
            this.enemyMove();
        }
        else {
            this.player.bet += 1;
            this.player.cash -= 1;
            this.enemy.bet += 2;
            this.enemy.cash -= 2;
        }
        const startEnd = () => {
            this.middle.pool = this.player.bet + this.enemy.bet;
            this.foldBtn.style.display = 'block';
            this.betSection.style.display = 'block';
            this.startBtn.style.display = 'none';
            this.displayAll();
        };
        if (wait) {
            this.animateEnemyMove();
            setTimeout(() => {
                startEnd();
                if (this.enemy.bet === this.player.bet) {
                    this.checkBtn.style.display = 'block';
                }
            }, 2000);
            return;
        }
        startEnd();
    }
    finishGame(whoWin, appendResultTo) {
        if (this.isFinished)
            return;
        this.isFinished = true;
        this.cardsCombos('enemy');
        this.cardsCombos('player');
        this.reverseEnemyCards();
        const hasPlayerWon = whoWin === 'player';
        const isDraw = whoWin === 'draw';
        this.winner = whoWin;
        this.enemy.comboCont.style.display = 'block';
        const h4 = document.createElement('h4');
        h4.textContent = isDraw ? 'DRAW' : hasPlayerWon ? 'YOU HAVE WON' : 'ENEMY HAS WON';
        h4.className = `result ${isDraw ? 'draw' : hasPlayerWon ? 'win' : 'lose'}`;
        this.resultHeader = h4;
        if (isDraw) {
            this.player.cash += this.player.bet;
            this.enemy.cash += this.enemy.bet;
        }
        else {
            this[whoWin].cash += this.middle.pool;
        }
        this.resetRoundMoney();
        this.displayAll();
        appendResultTo.appendChild(h4);
        this.restartBtn.style.display = 'block';
        for (let x of [this.betSection, this.startBtn, this.checkBtn, this.foldBtn])
            x.style.display = 'none';
    }
    restartGame() {
        this.resetRoundMoney();
        this.displayAll();
        this.winner = null;
        this.isFinished = false;
        this.player.cards = [];
        this.enemy.cards = [];
        this.middle.cards = [];
        this.player.combo = 'High card';
        this.enemy.combo = 'High card';
        this.enemy.comboCont.style.display = 'none';
        this.enemy.hasChecked = false;
        this.player.hasChecked = false;
        this.enemy.checkCont.textContent = '';
        this.player.checkCont.textContent = '';
        this.enemyFirstMove = 1;
        this.player.comboCont.textContent = 'none';
        this.restartBtn.style.display = 'none';
        this.startBtn.style.display = 'block';
        for (let x of [this.startBtn, this.betSection, this.foldBtn, this.checkBtn])
            x.style.pointerEvents = 'all';
        this?.resultHeader?.remove();
        for (let x of Array.from(this.player.container.children)) {
            if (x.tagName !== 'IMG')
                continue;
            x.remove();
        }
        for (let x of Array.from(this.middle.container.children)) {
            if (x.tagName !== 'IMG' || x.classList.contains('stack'))
                continue;
            x.remove();
        }
        for (let x of Array.from(this.enemy.container.children)) {
            if (x.tagName !== 'IMG')
                continue;
            x.remove();
        }
    }
    returnCash(who) {
        return this[who].cash;
    }
}
