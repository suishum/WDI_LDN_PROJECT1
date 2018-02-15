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
// SOUNDS
const fartSounds = [
  '/sounds/fart1.wav',
  '/sounds/fart2.wav',
  '/sounds/fart3.wav'
];
// cells array will get populated with the div's generated
let cells = [];
// currentCell = jimba's position
let currentCell = 0;
let jimbaDirection = 'right';
// enemyCell = enemy's position
let enemyCell = 99;
let enemyDirection = 'right'; //initialise at right
let enemyTimer = null;
// fartMeter = jimba's fart fuel (STARTS AT 15)
let farts = 15;
// score
let score = 0;
// turn into wallDictionary later
let walls = [];
// Maps
const wallsDictionary = [{
  bc: null,
  blc: null,
  brc: null,
  ct: null,
  hl: [15, 47, 51],
  hm: [16, 48, 52],
  hr: [17, 49, 53],
  lc: null,
  rc: null,
  solo: null,
  tlc: null,
  trc: null,
  vb: [22, 87, 93],
  vm: [12],
  vt: [2, 77, 83]
}, {
  bc: null,
  blc: null,
  brc: null,
  ct: null,
  hl: null,
  hm: null,
  hr: null,
  lc: null,
  rc: null,
  solo: [11, 15, 19, 30, 34, 38, 51, 55, 59, 70, 74, 78, 91, 95],
  tlc: null,
  trc: null,
  vb: null,
  vm: null,
  vt: null
}];
let randomMap = Math.floor(Math.random() * wallsDictionary.length);
// Pick out the different wall types
const wallTypes = Object.keys(wallsDictionary[randomMap]);

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

function hasAWall(value) {
  return wallTypes.some(wallType => value.contains(wallType));
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
  const timeBox = document.querySelector('.timebox');
  const timer = document.querySelector('#timer');
  const message = document.querySelector('#message');
  const collectedFart = document.querySelector('#collectedFart');
  const audio = document.querySelector('audio');
  // OBJECTS
  const timerObj = {
    startTime: 60,
    timeElapsed: 0,
    startTimer: () => {
      const timerId = setInterval(() => {
        if (timerObj.startTime <= 11 && timerObj.startTime > 4) {
          timerObj.startTime --;
          timerObj.timeElapsed ++;
          console.log(`timeelapsed: ${timerObj.timeElapsed}`);
          timeBox.style.backgroundColor = 'orange';
          setTimeout(() => {
            timeBox.style.backgroundColor = '#29A7FF';
          }, 200);
          animateHTML(timer, 'timerPulse', timerObj.startTime, 900);
        } else if (timerObj.startTime <= 4 && timerObj.startTime > 0) {
          timerObj.startTime --;
          timerObj.timeElapsed ++;
          console.log(`timeelapsed: ${timerObj.timeElapsed}`);
          timeBox.style.backgroundColor = 'red';
          setTimeout(() => {
            timeBox.style.backgroundColor = '#29A7FF';
          }, 500);
          animateHTML(timer, 'timerPulse', timerObj.startTime, 900);
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
  grid.style.cssText = `height: ${height*50+2}px; width: ${width*50+2}px`;

  function start() {
    // CREATE GRID & PUSH ELEMENTS TO CELLS ARRAY
    for (let i=0; i<height*width; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      cells.push(div);
    }
    // NEW WALLS
    // Pick a random map
    randomMap = Math.floor(Math.random() * wallsDictionary.length);
    // For each of the different wall types..
    wallTypes.forEach(wallType => {
      // If the value is not null..
      if (wallsDictionary[randomMap][wallType] !== null) {
        // Take the cell index and add the wallType
        wallsDictionary[randomMap][wallType].forEach(cellIndex => {
          cells[cellIndex].classList.add(wallType);
          walls.push(cellIndex);
        });
      }
    });
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
    farts = 15;
    collectedFart.style.cssText = `width: ${farts*2}%`;
    // INITIAL MESSAGE
    animateHTML(message, 'pulse', 'It\'s <br> poopin\' <br> time', 1000);
    gameContainer.classList.remove('hidden');
    introPage.classList.add('hidden');
    gameOver.classList.add('hidden');
  }

  function endGame() {
    grid.innerHTML = '';
    walls = [];
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

    // END GAME MESSAGES
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
      right: enemyCell%width !== width-1 && !hasAWall(cells[enemyCell+1].classList),
      left: enemyCell%width !== 0 && !hasAWall(cells[enemyCell-1].classList),
      down: enemyCell < width*height-width && !hasAWall(cells[enemyCell+width].classList),
      up: enemyCell > width-1 && !hasAWall(cells[enemyCell-width].classList)
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
      right: currentCell%width !== width-1 && !hasAWall(cells[currentCell+1].classList),
      left: currentCell%width !== 0 && !hasAWall(cells[currentCell-1].classList),
      down: currentCell < width*height-width && !hasAWall(cells[currentCell+width].classList),
      up: currentCell > width-1 && !hasAWall(cells[currentCell-width].classList)
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
      const randomSound = Math.floor(Math.random() * fartSounds.length);
      audio.setAttribute('src', fartSounds[randomSound]);
      audio.play();
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
      timerObj.startTime += 8;
      console.log('Time boosted by 8s');
      animateHTML(message, 'pulse', 'Ooooo. <br> Extra <br> time!', 1000);
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
      grid.classList.add('danger');
      setTimeout(() => {
        grid.classList.remove('danger');
      }, 200);
      animateHTML(scoreBoard, 'redShake', `${score}`, 1000);
      animateHTML(message, 'pulse', 'Oh no! <br> Jimba\'s <br> lost <br> points <br> and <br> energy!', 1000);
      //add sad simba animation
    }
    // ENEMY MEETS FART LOGIC
    if (cells[enemyCell].classList.contains('fart')) {
      animateHTML(message, 'pulse', 'SCORE! <br> Fart in <br> all the faces!!', 1000);
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
