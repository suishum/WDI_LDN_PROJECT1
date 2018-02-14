// MVP
// 1. generate grid with height * width variables
// 2. put simba in, make him move, make sure he cannot move past the edge of the grid
// 3. generate walls, can't move past walls.
// 4. simba releases a trail of fart.
// 5. generate an enemy, make it move using an algorithm (move in one direction until it reaches the end of the grid, turn repeat)
//
// do 1 map & 1 level, extend the game by making more maps with more levels.

// GLOBAL VARIABLES
let gameBegun = false;
// TIMER
let timerFired = false;
// GRID DIMENSIONS
const height = 10;
const width = 10;
// cells array will get populated with the div's generated
let cells = [];
// currentCell = jimba's position
let currentCell = 0;
let jimbaDirection = 'right';
// enemyCell = enemy's position
let enemyCell = 99;
let enemyDirection = 'right'; //initialise at right
let enemyTimer = null;
let enemyTimer2 = null;
// fartMeter = jimba's fart fuel (STARTS AT 10)
let farts = 10;
// score
let score = 0;
// turn into wallDictionary later
const walls = [2, 12, 15, 16, 17, 22, 47, 48, 49, 51, 52, 53, 77, 83, 87, 93, 97];

// const wallsDictionary = {
//   {
//     vt: [2, 77, 83],
//     vm: [12, 87, 93],
//     hl: [15, 47, 51],
//
//   }
// };

// GLOBAL FUNCTIONS
// FUNCTION TO MAKE RANDOM CELL (NOT IN A WALL)
function makeRandomCell(className, delay) {
  window.setTimeout(() => {
    let randomCell = Math.floor(Math.random() * (height*width));
    // checks that the random cell doesn't get generated inside a wall.
    while(walls.includes(randomCell)) {
      randomCell = Math.floor(Math.random() * (height*width));
    }
    cells[randomCell].classList.add(className);
  }, delay);
}

function animateHTML(selector, classAsString, messageAsString, delay) {
  selector.classList.add(classAsString);
  selector.innerHTML = messageAsString;
  window.setTimeout(() => {
    selector.classList.remove(classAsString);
  }, delay);
}


window.addEventListener('DOMContentLoaded', () => {
  // INTRO & END PAGE VARIABLES
  const go = document.querySelector('.goBtn');
  const introPage = document.querySelector('.intro-page');
  const gameContainer = document.querySelector('.game-container');
  const winMessage = document.querySelector('#winMessage');
  const gameOver = document.querySelector('.game-over');
  const retry = document.querySelector('.retryBtn');
  // GAME VARIABLES
  const grid = document.querySelector('#grid');
  const scoreBoard = document.querySelector('#score');
  const timer = document.querySelector('#timer');
  const message = document.querySelector('#message');
  const collectedFart = document.querySelector('#collectedFart');
  // OBJECTS
  const timerObj = {
    startTime: 60,
    timeElapsed: 0,
    startTimer: () => {
      const timerId = setInterval(() => {
        if (timerObj.startTime <= 11 && timerObj.startTime > 0) {
          timerObj.startTime --;
          timerObj.timeElapsed ++;
          console.log(`timeelapsed: ${timerObj.timeElapsed}`);
          animateHTML(timer, 'pulse', timerObj.startTime, 800);
        } else if (timerObj.startTime === 0) {
          clearInterval(timerId);
          endGame();
        } else {
          timerObj.startTime --;
          timerObj.timeElapsed ++;
          console.log(`timeelapsed: ${timerObj.timeElapsed}`);
          timer.innerHTML = timerObj.startTime;
        }
      }, 1000);
    }
  };
  // STYLE STUFF
  // height & width of grid scales with height & width variables
  grid.style.cssText = `height: ${height*50}px; width: ${width*50}px`;

  function start() {
    // CREATE GRID & PUSH ELEMENTS TO CELLS ARRAY
    for (let i=0; i<height*width; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      cells.push(div);
    }
    // WALLS
    for (let i=0; i<walls.length; i++) {
      cells[walls[i]].classList.add('wall');
    }
    gameBegun = true;
    timerFired = false;
    timerObj.startTime = 60; //change this for real game
    timerObj.timeElapsed = 0;
    timer.innerHTML = 60;
    // ADD JIMBA TO BOARD
    currentCell = 0;
    cells[currentCell].classList.add('jimba-right');
    jimbaDirection = 'right';
    // ADD ENEMY TO THE BOARD
    enemyCell = 99;
    enemyDirection = 'right'; //initialise at right
    cells[enemyCell].classList.add(`enemy-${enemyDirection}`);
    enemyTimer = window.setInterval(enemyAI, 1000);
    // ADD INITIAL TIME POWERUP TO THE BOARD, GENERATES EVERY 10 SECONDS
    makeRandomCell('time', 10000);
    // ADD INITIAL CHICKEN TO THE BOARD.
    makeRandomCell('chicken');
    // SCOREBOARD
    score = 0;
    animateHTML(scoreBoard, 'pulse', `${score}`, 1000);
    // scoreBoard.innerHTML = `${score}`;
    // FARTMETER
    farts = 10;
    collectedFart.style.cssText = `width: ${farts*2}%`;
    // INITIAL MESSAGE
    animateHTML(message, 'pulse', 'It\'s poopin\' time', 1000);
    gameContainer.classList.remove('hidden');
    introPage.classList.add('hidden');
    gameOver.classList.add('hidden');
  }

  function endGame() {
    grid.innerHTML = '';
    cells = [];
    clearInterval(enemyTimer);
    // if (timerObj.timeElapsed >= 100) {
    //   clearInterval(enemyTimer2);
    // } //SECOND ENEMY DOES NOT WORK YET
    // // TO CLEAR THE BOARD OF ALL CLASSES EXCEPT EXISTING WALLS
    // cells.forEach((cell, index) => {
    //   cell.className = walls.includes(index) ? 'wall' : '';
    // });
    gameBegun = false;
    gameContainer.classList.add('hidden');
    gameOver.classList.remove('hidden');
    // winMessage.innerHTML = `FABULOUS! YOU SCORED ${score}!`;
    if (score <= 0) {
      winMessage.innerHTML = `Your score was ${score}! <br> Did you even try?`;
    } else if (score < 10) {
      winMessage.innerHTML = `Your score was ${score}! <br> Mehhh`;
    } else if (score < 30) {
      winMessage.innerHTML = `Your score was ${score}! <br> Alright maaate, not bad!`;
    } else if (score < 50) {
      winMessage.innerHTML = `Your score was ${score}! <br> Amazing!`;
    } else if (score < 100) {
      winMessage.innerHTML = `Your score was ${score}! <br> Teach me your ways!`;
    } else {
      winMessage.innerHTML = `Your score was ${score}! <br> U R A DUSTCROPPING MASTER!!!!!!!!!!`;
    }
  }

  // ALGORITHM TO MOVE ENEMY
  const enemyFacing = ['right', 'left', 'down', 'up'];
  // FUNCTION FOR ENEMY MOVEMENT
  function moveEnemy(conditions, movement, direction) {
    if(conditions) {
      enemyCell = enemyCell + movement;
      enemyDirection = direction;
    } else {
      enemyDirection = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
    }
  }

  function enemyAI() {
    const enemyMovementConditions = {
      right: enemyCell%width !== width-1 && !cells[enemyCell+1].classList.contains('wall'),
      left: enemyCell%width !== 0 && !cells[enemyCell-1].classList.contains('wall'),
      down: enemyCell < width*height-width && !cells[enemyCell+width].classList.contains('wall'),
      up: enemyCell > width-1 && !cells[enemyCell-width].classList.contains('wall')
    };
    cells[enemyCell].classList.remove(`enemy-${enemyDirection}`);
    // use switch statement to move enemy
    switch(enemyDirection) {
      case 'right':
        moveEnemy(enemyMovementConditions.right, 1, 'right');
        break;
      case 'left':
        moveEnemy(enemyMovementConditions.left, -1, 'left');
        break;
      case 'down':
        moveEnemy(enemyMovementConditions.down, width, 'down');
        break;
      case 'up':
        moveEnemy(enemyMovementConditions.up, -width, 'up');
        break;
    }
    cells[enemyCell].classList.add(`enemy-${enemyDirection}`);
  }

  go.addEventListener('click', start);
  retry.addEventListener('click', start);


  window.addEventListener('keydown', (e) => {
    if (!gameBegun) return false;
    // START TRIGGER TIMER
    if (!timerFired) {
      timerFired = true;
      timerObj.startTimer();
    }
    // MAKE JIMBA MOVE & FART -> CAN'T MOVE PAST GRID EDGE & CAN'T MOVE INTO WALLS, MOVE WITH ARROW KEYS OR WASD. PRESS SPACEBAR TO FART.
    // OBJECTS
    const jimbaMovementConditions = {
      right: currentCell%width !== width-1 && !cells[currentCell+1].classList.contains('wall'),
      left: currentCell%width !== 0 && !cells[currentCell-1].classList.contains('wall'),
      down: currentCell < width*height-width && !cells[currentCell+width].classList.contains('wall'),
      up: currentCell > width-1 && !cells[currentCell-width].classList.contains('wall')
    };
    // FUNCTIONS
    function moveJimba(conditions, movement, direction) {
      if (conditions) {
        currentCell = currentCell + movement;
        jimbaDirection = direction;
      }
    }
    // FIRST, remove jimba
    cells[currentCell].classList.remove(`jimba-${jimbaDirection}`);
    // KEY CODES OBJECT
    const keys = {
      d: e.keyCode === 68,
      a: e.keyCode === 65,
      s: e.keyCode === 83,
      w: e.keyCode === 87,
      right: e.keyCode === 39,
      left: e.keyCode === 37,
      down: e.keyCode === 40,
      up: e.keyCode === 38,
      spacebar: e.keyCode === 32
    };
    // JIMBA MOVES RIGHT
    if ( keys.right || keys.d ) {
      moveJimba(jimbaMovementConditions.right, 1, 'right');
    }
    // JIMBA MOVES LEFT
    if ( keys.left || keys.a ) {
      moveJimba(jimbaMovementConditions.left, -1, 'left');
    }
    // JIMBA MOVES DOWN
    if ( keys.down || keys.s ) {
      moveJimba(jimbaMovementConditions.down, width, 'down');
    }
    // JIMBA MOVES UP
    if ( keys.up || keys.w ) {
      moveJimba(jimbaMovementConditions.up, -width, 'up');
    }
    // JIMBA FARTS
    if ( keys.spacebar ) {
      if (farts > 0) {
        farts--;
        collectedFart.style.width = `${farts*2}%`;
        const fartCell = cells[currentCell];
        fartCell.classList.add('fart');
        window.setTimeout(() => {
          fartCell.classList.remove('fart');
        }, 2000);
      }
    }
    // JIMBA MEETS CHICKEN LOGIC
    if (cells[currentCell].classList.contains('chicken')) {
      cells[currentCell].classList.remove('chicken');
      makeRandomCell('chicken', 2000);
      if (farts < 50) {
        farts += 5;
        animateHTML(message, 'pulse', 'Yum yum, chicken.', 1000);
        if (farts >= 50) {
          farts = 50;
          animateHTML(message, 'pulse', 'The fartmeter is maxed out!', 1000);
          collectedFart.style.width = '100%';
        }
        collectedFart.style.width = `${farts*2}%`;
        console.log(`Farts in storage: ${farts}`);
      }
    }
    // JIMBA MEETS TIME LOGIC
    if (cells[currentCell].classList.contains('time')) {
      cells[currentCell].classList.remove('time');
      timerObj.startTime += 10;
      console.log('Time boosted by 10s');
      animateHTML(message, 'pulse', 'Ooooo. Extra <br> time!', 1000);
      makeRandomCell('time', 10000);
    }
    // JIMBA MEETS ENEMY LOGIC
    if (cells[currentCell].classList.contains(`enemy-${enemyDirection}`)) {
      if (farts > 0) {
        farts -= 5;
        if (farts <= 0) {
          farts = 0;
        }
      }
      collectedFart.style.width = `${farts*2}%`;
      score -= 5;
      if (score < -99) {
        endGame();
      }
      animateHTML(scoreBoard, 'redShake', `${score}`, 1000);
      animateHTML(message, 'pulse', 'Oh no! <br> Jimba\'s lost points and energy!', 1000);
      //add sad simba animation
    }
    // ENEMY MEETS FART LOGIC
    if (cells[enemyCell].classList.contains('fart')) {
      animateHTML(message, 'pulse', 'SCORE! Fart in all the faces!!', 1000);
      score++;
      animateHTML(scoreBoard, 'greenJump', `${score}`, 1000);
      console.log(score);
      // add enemy lose animation
    }
    // ENEMY SPEED UP LOGIC
    if (timerObj.timeElapsed === 20) {
      clearInterval(enemyTimer);
      enemyTimer = window.setInterval(enemyAI, 800);
    } else if (timerObj.timeElapsed === 40) {
      clearInterval(enemyTimer);
      enemyTimer = window.setInterval(enemyAI, 600);
    } else if (timerObj.timeElapsed === 60) {
      clearInterval(enemyTimer);
      enemyTimer = window.setInterval(enemyAI, 400);
    } else if (timerObj.timeElapsed === 80){
      clearInterval(enemyTimer);
      enemyTimer = window.setInterval(enemyAI, 200);
    }
    // else if (timerObj.timeElapsed === 100) {
    //   enemyTimer2 = window.setInterval(enemyAI, 200);
    // }
    // LASTLY, put jimba back
    cells[currentCell].classList.add(`jimba-${jimbaDirection}`);
  }, false);



  // extra bits
  //
  // add theme music
  // add fart/ bark/ camera sounds
  // make grid bigger?
  // enter konami code to get a full fart boost
  // animate simba's movement so it looks like he moves fluidly


});
