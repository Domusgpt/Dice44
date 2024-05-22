document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('roll-button').addEventListener('click', rollDice);
    document.getElementById('reset-button').addEventListener('click', resetGame);
    document.getElementById('glasses-button').addEventListener('click', activateGlassesEffect);
});

let dice = [1, 2, 3, 4, 5, 6];
let keptDice = [];
let rolled = false;
let firstTwoAndFourCollected = false;
let collectedTwoOrFour = false;
let images = [
    "https://i.imgur.com/pXhp3hy.jpeg",
    "https://i.imgur.com/P8imyRz.jpeg",
    "https://i.imgur.com/RtBzt0o.jpeg",
    "https://i.imgur.com/WqfYzsD.jpeg"
];
let imageIndex = 0;

const weirdMessages = [
    "The Frequency Golems invented the concept of chance.",
    "The Frequency Golems are the House and have always been.",
    "The Frequency Golems have never rolled anything but a '2', '4' and quadruple '6'; thus they never have been able to enjoy this game.",
    "The Frequency Golems don't endorse candy corn.",
    "The Frequency Golems are that ringing sound in your ears.",
    "Social Media is a disease the Frequency Golems made for biological warfare with humanity.",
    "The Frequency Golems control the stock market.",
    "The Frequency Golems whispered the secrets of the universe to Pythagoras.",
    "The Frequency Golems have a hidden base on the dark side of the moon.",
    "All dice rolls are predetermined by the Frequency Golems."
];

function rollDice() {
    if (!rolled || dice.length > 0) {
        const rollingArea = document.getElementById('dice-area');
        rollingArea.innerHTML = '';
        dice = dice.map(() => Math.floor(Math.random() * 6) + 1);
        dice.forEach((num, index) => {
            const die = document.createElement('div');
            die.textContent = "?";
            die.className = 'die roll';
            rollingArea.appendChild(die);
            setTimeout(() => revealDie(die, num), 1000);
            die.addEventListener('click', () => keepDie(index, die));
        });
        rolled = true;
        document.getElementById('roll-button').disabled = true;
        cycleImage();
        showWeirdMessage();
        changePatterns();
    }
}

function revealDie(die, num) {
    die.textContent = num;
    if (num === 1) {
        die.style.backgroundColor = 'red';
    } else if (num === 2 || num === 4) {
        if (!firstTwoAndFourCollected || (firstTwoAndFourCollected && !collectedTwoOrFour)) {
            die.classList.add('blink-green-purple');
        }
    } else if (num === 6) {
        die.style.backgroundColor = 'gold';
    } else {
        die.style.backgroundColor = '#f0f0f0';
    }
}

function keepDie(index, dieElement) {
    const keptDie = dice.splice(index, 1)[0];
    keptDice.push(keptDie);
    if (keptDie === 2 || keptDie === 4) {
        collectedTwoOrFour = true;
        if (!firstTwoAndFourCollected) {
            firstTwoAndFourCollected = true;
        }
    }
    updateKeptDice();
    if (dice.length === 0) {
        endTurn();
    } else {
        updateRollingArea();
    }
    document.getElementById('roll-button').disabled = false;
    triggerPulsate();
    changePatterns();
}

function updateKeptDice() {
    const keptArea = document.getElementById('kept-dice');
    keptArea.innerHTML = '';
    keptDice.forEach(num => {
        const die = document.createElement('div');
        die.textContent = num;
        die.className = 'die';
        if (firstTwoAndFourCollected && (num === 2 || num === 4)) {
            die.classList.add('blink-green-purple');
        }
        keptArea.appendChild(die);
    });

    updateScoreDisplay();
}

function updateRollingArea() {
    const rollingArea = document.getElementById('dice-area');
    rollingArea.innerHTML = '';
    dice.forEach((num, index) => {
        const die = document.createElement('div');
        die.textContent = "?";
        die.className = 'die roll';
        rollingArea.appendChild(die);
        setTimeout(() => revealDie(die, num), 1000);
        die.addEventListener('click', () => keepDie(index, die));
    });
}

function endTurn() {
    if (keptDice.length === 0) {
        alert("You must keep at least one die.");
        return;
    }

    const score = keptDice.reduce((total, num) => {
        if (firstTwoAndFourCollected && (num === 2 || num === 4)) {
            return total;
        }
        return total + num;
    }, 0);

    const hasTwoAndFour = keptDice.includes(2) && keptDice.includes(4);

    if (hasTwoAndFour && keptDice.every(die => die === 2 || die === 4 || die === 6)) {
        document.getElementById('perfect-roll-image').style.display = 'block';
        setTimeout(() => document.getElementById('perfect-roll-image').style.display = 'none', 3000);
        setTimeout(() => showJackpotPage(), 3000);
    } else if (!hasTwoAndFour) {
        document.getElementById('bust-image').style.display = 'block';
        setTimeout(() => document.getElementById('bust-image').style.display = 'none', 3000);
        document.getElementById('score-display').classList.add('wiggle');
        setTimeout(() => document.getElementById('score-display').classList.remove('wiggle'), 3000);
    }

    updateScoreboard(score, hasTwoAndFour);
    triggerPulsate();

    setTimeout(resetGame, 3000);
}

function updateScoreboard(score, hasTwoAndFour) {
    const scoresList = document.getElementById('scores-list');
    const scoreItem = document.createElement('li');
    scoreItem.textContent = `Score: ${score} - ${hasTwoAndFour ? 'Win' : 'Bust'}`;
    if (hasTwoAndFour && keptDice.every(die => die === 2 || die === 4 || die === 6)) {
        scoreItem.style.color = 'gold';
    }
    scoresList.appendChild(scoreItem);
}

function resetGame() {
    window.location.href = 'index.html';
}

function showWeirdMessage() {
    const message = weirdMessages[Math.floor(Math.random() * weirdMessages.length)];
    const weirdMessageElement = document.getElementById('weird-message');
    weirdMessageElement.textContent = message;
    weirdMessageElement.style.display = 'block';
    setTimeout(() => {
        weirdMessageElement.style.display = 'none';
    }, 5000);
}

function showJackpotPage() {
    window.location.href = 'jackpot.html';
}

function triggerPulsate() {
    document.body.classList.add('pulsate');
    setTimeout(() => {
        document.body.classList.remove('pulsate');
    }, 500);
}

function changePatterns() {
    const gameAreas = document.querySelectorAll('.dice-container');
    gameAreas.forEach(area => {
        const hue = Math.floor(Math.random() * 360);
        area.style.backgroundImage = `linear-gradient(${hue}deg, hsl(${hue}, 100%, 75%), hsl(${(hue + 120) % 360}, 100%, 75%), hsl(${(hue + 240) % 360}, 100%, 75%))`;
    });
}

function cycleImage() {
    const imageElement = document.querySelector('#discarded-dice img');
    imageElement.src = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-display');
    const score = keptDice.reduce((total, num) => {
        if (firstTwoAndFourCollected && (num === 2 || num === 4)) {
            return total;
        }
        return total + num;
    }, 0);
    scoreDisplay.textContent = `Score: ${score}`;
}

function activateGlassesEffect() {
    const body = document.body;
    const headerText = document.getElementById('header-text');
    const secretLink = document.getElementById('secret-link');
    
    body.classList.add('glasses-on');
    headerText.textContent = "Put On The Hoffman Lenses";
    secretLink.style.display = 'block';

    setTimeout(() => {
        body.classList.remove('glasses-on');
        headerText.textContent = "Frequency Golems Dice Game";
        secretLink.style.display = 'none';
    }, 5000);
}