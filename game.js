let explosion = document.getElementById("explosion")
let rocket = document.getElementById("rocket");
let countDown = document.getElementById("countdown");
let bigButton = document.getElementById("big-button");
let score = document.getElementById("score");
let release = document.getElementById("release");
let balanceText = document.getElementById("balance");
let buttonText = document.getElementById("button-text");
let timerID;
let counter = 0;
let explosionCounter = 0;
let countFunction;
let explosionCountFunction;
let crashtime;
let crashMultiplier;
let balance;
let bet;
let pressHoldEvent = new CustomEvent("pressHold");


let count = 0;
let screens = new Array();


// var elements = document.getElementsByClassName("square");
// for (var i = 0; i < elements.length; i++) {
//     let box = elements[i];
//     let width = box.offsetWidth;
//     console.log("width: " + width);
//     box.style.setProperty("font-size", width / 10 + "px");
// }



screens.push(document.getElementById("start-screen"));
screens.push(document.getElementById("game-screen"));
window.onload = setPanel("start-screen");

setListeners(true);
resetBalance();

selectBet("bet-1");
bet = 10;

let box = document.querySelector('.square');
let width = box.offsetWidth;
console.log("width: " + width);
document.documentElement.style.setProperty('--font-size', width / 10 + "px");


//box.style.setProperty("font-size", width / 10 + "px");


function setListeners(active) {
    if (active == true) {
        bigButton.addEventListener("mousedown", pressingDown, false);
        bigButton.addEventListener("mouseup", notPressingDown, false);
        getPanel("game-screen").addEventListener("mouseup", notPressingDown, false);

        bigButton.addEventListener("touchstart", pressingDown, false);
        bigButton.addEventListener("touchend", notPressingDown, false);
    } else {
        bigButton.removeEventListener("mousedown", pressingDown, false);
        bigButton.removeEventListener("mouseup", notPressingDown, false);
        getPanel("game-screen").removeEventListener("mouseup", notPressingDown, false);

        bigButton.removeEventListener("touchstart", pressingDown, false);
        bigButton.removeEventListener("touchend", notPressingDown, false);
    }
}

function resetBalance() {
    balance = 10000;
    balanceText.innerHTML = "Current Balance: " + balance;
    console.log("resetbalance");
}


function pressingDown(e) {
    console.log("bet: " + bet);
    balance -= bet;
    console.log("balance: " + balance);
    crashMultiplier = crashPointFromHash(getRandom(9));
    crashtime = clamp(crashMultiplier * 200, 1, 1200);
    console.log("crashtime: " + crashtime);
    e.preventDefault();
    startPlaying();
    bigButton.style.setProperty("background-color",  "transparent");
    console.log("Pressing!");
}

function clamp(value, min, max) {
    return Math.round(Math.min(Math.max(value, min), max));
}

function notPressingDown(e) {
    e.preventDefault();
    release.style.visibility = "visible";
    release.innerHTML = "Release multiplier: " + (counter / 200).toFixed(2) + "x";
    if(counter < crashtime) {
    balance = Math.round(balance + bet * counter / 200);
    }
    console.log("Screen: " + getPanel("start-screen").style.display);
    if(getPanel("start-screen").style.display != "block") {
    setListeners(false);
    }
    buttonText.innerHTML = "Wait for results...";
    //stopPlaying();
    bigButton.style.setProperty("background-color",  "var(--main-color)");
    console.log("Not pressing!");
}


var timer;
function repeatOften() {
    // Do whatever
    console.log("frame")
    counter+=2;
    // if (counter == 3) {
  
    // } else {
    //     countDown.innerHTML = 3 - counter;
    // }
    if (counter == crashtime) {
        cancelAnimationFrame(timer);
        playExplosion();
        return;
    }
    if(counter < crashtime) {
        if((counter / 200) > 1) {
        rocket.style.setProperty("--animation-speed", (1 / (counter / 200)) + "s");
        } else {
            rocket.style.setProperty("--animation-speed", (1) + "s");
        }
    }
    score.innerHTML =  (counter / 200).toFixed(2) + "x";
    timer = window.requestAnimationFrame(repeatOften);
}

function runTimer() {
    timer = window.requestAnimationFrame(repeatOften);
    setPanel("game-screen");
    // countFunction = setInterval(() => {
    //     counter++;
    //     // if (counter == 3) {
      
    //     // } else {
    //     //     countDown.innerHTML = 3 - counter;
    //     // }
    //     if (counter == crashtime) {
    //         clearInterval(countFunction);
    //         playExplosion();
    //     }
    //     if(counter < crashtime) {
    //         if((counter / 200) > 1) {
    //         rocket.style.setProperty("--animation-speed", (1 / (counter / 200)) + "s");
    //         } else {
    //             rocket.style.setProperty("--animation-speed", (1) + "s");
    //         }
    //     }
    //     score.innerHTML =  (counter / 200).toFixed(2) + "x";
    // }, 10);
}

function playExplosion() {
    explosion.style.visibility = "visible";
    rocket.style.setProperty("--animation-speed", "0s");
    explosion.style.setProperty("--animation-speed", "1s");
    explosionCountFunction = setInterval(() => {
        explosionCounter++;
        explosion.style.setProperty("--animation-speed", "0s");
        setListeners(false);
        stopPlaying();
        clearInterval(explosionCountFunction);
    }, 1000);
}

function stopPlaying() {
    balanceText.innerHTML = "Current Balance: " + balance;
    setPanel("start-screen");
    buttonText.innerHTML = "Press and Hold here!";
    cancelAnimationFrame(timer);
    counter = 0;
    setListeners(true);
}
function startPlaying() {
    explosionCounter = 0;
    release.style.visibility = "hidden";
    explosion.style.visibility = "hidden";
    runTimer();
}

function selectBet(betId) {
    setListeners(true);
    console.log("Select bet: " + betId);
    const holder = document.getElementById("bet-holder");
    for (i = 0; i < holder.children.length; i++) {
        const betElement = holder.children[i];
        console.log(betElement.id);
        if (betElement.id == betId) {
            if(betId != "bet-4") {
            bet =  parseInt( betElement.children[0].innerHTML);
            } else {
                bet = balance;
            }
            betElement.style.setProperty("background-color", "var(--main-color)");
        } else {
            betElement.style.setProperty("background-color", "transparent");
        }
    }
}

function getRandom(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

function generateRandom(min = 0, max = 100) {

    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;

    return rand;
}

function divisible(hash, mod) {
    var val = 0;
    var o = hash.length % 4;
    for (var i = o > 0 ? 0 - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }
    return val === 0;
}

function crashPointFromHash() {
    e = Math.pow(2, 52);
    const h = generateRandom(1, e - 1);
    if (h % 50 == 0) return 1
    return Math.floor((100 * e - h) / (e - h)) / 100.0;
}


function setPanel(panelID) {
    for (i = 0; i < screens.length; i++) {
        const element = screens[i];
        if (element.id == panelID) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }
    }
}
function getPanel(panelID) {
    for (i = 0; i < screens.length; i++) {
        if (screens[i].id == panelID) {
            return screens[i];
        }
    }
}