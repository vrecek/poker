import Game from "./Game.js";
const mainCont = document.querySelector('main');
const startBtn = document.querySelector('.action.start');
const betSection = {
    section: document.querySelector('.bet'),
    btn: document.querySelector('.bet button'),
    plus: document.querySelector('.bet .plus'),
    minus: document.querySelector('.bet .minus'),
    input: document.querySelector('.bet input')
};
const checkBtn = document.querySelector('.action.check');
const foldBtn = document.querySelector('.action.surrender');
const restartBtn = document.querySelector('.action.restart');
const plrCombos = document.querySelector('.player-info .combos span');
const enemyCombos = document.querySelector('.enemy-info .combos');
const plrBet = document.querySelector('.player-info h2 span');
const enemyBet = document.querySelector('.enemy-info h2 span');
const poolCont = document.querySelector('h4.total-pool span');
const plrCash = document.querySelector('.player-info .cash span');
const enemyCash = document.querySelector('.enemy-info .cash span');
const plrCheck = document.querySelector('.player-info h4');
const enemyCheck = document.querySelector('.enemy-info h4');
const enemyContainer = document.querySelector('.enemy-table div.images');
const playerContainer = document.querySelector('.player-table div.images');
const middleContainer = document.querySelector('.middle-table div.images');
const game = new Game(playerContainer, enemyContainer, middleContainer, startBtn, betSection.section, checkBtn, foldBtn, restartBtn, plrBet, enemyBet, poolCont, plrCash, enemyCash, plrCombos, plrCheck, enemyCheck, enemyCombos, mainCont);
game.restartGame();
startBtn.addEventListener('click', () => {
    game.startGame();
});
checkBtn.addEventListener('click', () => {
    game.check('player');
});
foldBtn.addEventListener('click', () => {
    game.finishGame('enemy', mainCont);
});
restartBtn.addEventListener('click', () => {
    game.restartGame();
});
betSection.btn.addEventListener('click', () => {
    const value = parseInt(betSection.input.value) || 0;
    betSection.input.value = '';
    if (!game.canPlrBet(value))
        return;
    game.placeBet('player', value);
    game.placeBet('enemy');
});
betSection.plus.addEventListener('click', () => {
    const value = parseInt(betSection.input.value) || 0;
    if (value + 1 > game.returnCash('player')) {
        return;
    }
    betSection.input.value = `${value + 1}`;
});
betSection.minus.addEventListener('click', () => {
    const value = parseInt(betSection.input.value) || 0;
    if (value - 1 < 0) {
        return;
    }
    betSection.input.value = `${value - 1}`;
});
