// ================
// GLOBAL VARIABLES
// ================
let gameBegun = false; // starts on intro page so game has not begun
let timerFired = false; // timer is fired on game start()
// Grid dimensions
const height = 10;
const width = 10;
let cells = []; // cells array will get populated with the div's generated
// Jimba's starting position
let walls = []; // walls array will get populated with the wall positions, this is used to ensure items are not randomly generated in walls.
let currentCell = 0;
let jimbaDirection = 'right';
// Enemy starting position
let enemyCell = 99;
let enemyDirection = 'right'; //initialise at right
let enemyTimer = null;
// Starting stats
let score = 0;
let farts = 15;
// ================
// GLOBAL LIBRARIES
// ================
const fartSounds = [
  '/sounds/fart1.wav',
  '/sounds/fart2.wav',
  '/sounds/fart3.wav'
];
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
// Picks a random map
let randomMap = Math.floor(Math.random() * wallsDictionary.length);
// Pick out the different wall types for use later
const wallTypes = Object.keys(wallsDictionary[randomMap]);
// ================
// GLOBAL FUNCTIONS
// ================
// Inserts class into a cell that doesnt contain a wall
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
// Animate messages
function animateHTML(selector, classAsString, messageAsString, delay) {
  selector.classList.add(classAsString);
  selector.innerHTML = messageAsString;
  window.setTimeout(() => {
    selector.classList.remove(classAsString);
  }, delay);
}
// Checks if a cell has a wall
function hasAWall(value) {
  return wallTypes.some(wallType => value.contains(wallType));
}

// =========================
// DOMContentLoaded Listener
// =========================
window.addEventListener('DOMContentLoaded', () => {
  // ==============================
  // INTRO & END PAGE DOM VARIABLES
  // ==============================
  const go = document.querySelector('.goBtn');
  const introPage = document.querySelector('.intro-page');
  const jimba = document.querySelector('img');
  const gameContainer = document.querySelector('.game-container');
  const winMessage = document.querySelector('#winMessage');
  const gameOver = document.querySelector('.game-over');
  const retry = document.querySelector('.retryBtn');
  // ==================
  // GAME DOM VARIABLES
  // ==================
  const grid = document.querySelector('#grid');
  const scoreBoard = document.querySelector('#score');
  scoreBoard.classList.add('animated');
  const timeBox = document.querySelector('.timebox');
  const timer = document.querySelector('#timer');
  const message = document.querySelector('#message');
  const collectedFart = document.querySelector('#collectedFart');
  const audio = document.querySelector('#fart-sound');
  // Timer
  const timerObj = {
    startTime: 60,
    timeElapsed: 0,
    startTimer: () => {
      function incrementTime() {
        timerObj.startTime --;
        timerObj.timeElapsed ++;
        timer.innerHTML = timerObj.startTime;
      }
      function flashColor(colorAsString, duration) {
        timeBox.style.transition = '0.2s';
        timeBox.style.backgroundColor = colorAsString;
        setTimeout(() => {
          timeBox.style.transition = '0.2s';
          timeBox.style.backgroundColor = '#29A7FF';
        }, duration);
      }
      const timerId = setInterval(() => {
        if (timerObj.startTime <= 11 && timerObj.startTime > 4) {
          incrementTime();
          flashColor('#E88449', 200);
          animateHTML(timer, 'timerPulse', timerObj.startTime, 900);
        } else if (timerObj.startTime <= 4 && timerObj.startTime > 0) {
          incrementTime();
          flashColor('#F64744', 400);
          animateHTML(timer, 'timerPulse', timerObj.startTime, 900);
        } else if (timerObj.startTime === 0) {
          clearInterval(timerId);
          endGame();
        } else {
          incrementTime();
        }
      }, 1000);
    }
  };
  // ============
  // STYLE SET UP
  // ============
  // height & width of grid scales with height & width variables
  grid.style.cssText = `height: ${height*50+2}px; width: ${width*50+2}px`;
  // =========
  // FUNCTIONS
  // =========
  function start() {
    // 1. Create grid
    for (let i=0; i<height*width; i++) {
      const div = document.createElement('div');
      grid.appendChild(div);
      // 2. Push elements to previously empty cells array
      cells.push(div);
    }
    // 3. Create walls
    // Pick a random map
    randomMap = Math.floor(Math.random() * wallsDictionary.length);
    // For each of the different wall types..
    wallTypes.forEach(wallType => {
      // If the value is not null..
      if (wallsDictionary[randomMap][wallType] !== null) {
        // Take the cell index and add the wallType
        wallsDictionary[randomMap][wallType].forEach(cellIndex => {
          cells[cellIndex].classList.add(wallType);
          // Push cell index to previously empty walls array, this will be used to generate items in random cells.
          walls.push(cellIndex);
        });
      }
    });
    // 4. Variable set up
    gameBegun = true;
    timerFired = false; // Timer is fired after the first key is pressed.
    timerObj.startTime = 10; //CHANGE THIS FOR TESTING
    timerObj.timeElapsed = 0;
    timer.innerHTML = 60;
    score = 0; // Reset scoreboard
    animateHTML(scoreBoard, 'pulse', `${score}`, 1000);
    farts = 15; // Reset fart reserves
    collectedFart.style.cssText = `width: ${farts*2}%`;
    animateHTML(message, 'pulse', 'It\'s <br> poopin\' <br> time! <br> Press any <br> button <br> to begin.', 1000); // Reset intro message
    // 5. Add Jimba
    currentCell = 0;
    jimbaDirection = 'right'; // starts facing
    cells[currentCell].classList.add(`jimba-${jimbaDirection}`);
    // 6. Add enemy
    enemyCell = 99;
    enemyDirection = 'right'; // starts facing
    cells[enemyCell].classList.add(`enemy-${enemyDirection}`);
    enemyTimer = window.setInterval(enemyAI, 1000);
    // 7. Add initial powerups
    makeRandomCell('chicken');
    makeRandomCell('time', 10000);
    // 8. Reveal game & remove other pages
    gameContainer.classList.remove('hidden');
    introPage.classList.add('hidden');
    gameOver.classList.add('hidden');
  }
  function endGame() {
    // 1. Clear variables that were automatically populated
    gameBegun = false;
    grid.innerHTML = '';
    cells = [];
    walls = [];
    // 2. Stop enemy (so when the player retries it doesnt produce a second enemy)
    clearInterval(enemyTimer);
    // if (timerObj.timeElapsed >= 100) {
    //   clearInterval(enemyTimer2);
    // } //SECOND ENEMY DOES NOT WORK YET BUT USE THIS TO CLEAR IT WHEN IT DOES WORK!
    // // TO CLEAR THE BOARD OF ALL CLASSES EXCEPT EXISTING WALLS
    // cells.forEach((cell, index) => {
    //   cell.className = walls.includes(index) ? 'wall' : '';
    // });
    // 3. Produce an end game message
    if (score <= 0) {
      winMessage.innerHTML = `<p>Your score was ${score}!</p>  <p>Did you even try?</p>`;
    } else if (score < 10) {
      winMessage.innerHTML = `<p>Your score was ${score}!</p> <p>Mehhh</p>`;
    } else if (score < 30) {
      winMessage.innerHTML = `<p>Your score was ${score}!</p> <p>Alright maaate, not bad!</p>`;
    } else if (score < 50) {
      winMessage.innerHTML = `<p>Your score was ${score}!</p> <p>Amazing!</p>`;
    } else if (score < 100) {
      winMessage.innerHTML = `<p>Your score was ${score}!</p> <p>Teach me your ways!`;
    } else {
      winMessage.innerHTML = `<p>Your score was ${score}!</p> <p>U R A DUSTCROPPING MASTER!!!!!!!!!!</p>`;
    }
    // 4. Hide game container and reveal game over page
    gameContainer.classList.add('hidden');
    gameOver.classList.remove('hidden');
  }
  // =======================
  // ALGORITHM TO MOVE ENEMY
  // =======================
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
  // ===============
  // EVENT LISTENERS
  // ===============
  jimba.addEventListener('click', () => {
    const randomSound = Math.floor(Math.random() * fartSounds.length);
    audio.setAttribute('src', fartSounds[randomSound]);
    audio.play();
  });
  go.addEventListener('click', start);
  retry.addEventListener('click', start);
  // ==============
  // JIMBA MOVEMENT
  // ==============
  window.addEventListener('keydown', (e) => {
    if (!gameBegun) return false;
    // Start timer and flick switch
    if (!timerFired) {
      timerFired = true;
      timerObj.startTimer();
    }
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
      animateHTML(scoreBoard, 'red', `${score}`, 1000);
      animateHTML(message, 'pulse', 'Oh no! <br> Jimba\'s <br> lost <br> points <br> and <br> energy!', 1000);
    }
    // ENEMY MEETS FART LOGIC
    if (cells[enemyCell].classList.contains('fart')) {
      animateHTML(message, 'pulse', 'SCORE! <br> Fart in <br> all the faces!!', 1000);
      score++;
      animateHTML(scoreBoard, 'green', `${score}`, 1000);
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
    // LASTLY, put jimba back
    cells[currentCell].classList.add(`jimba-${jimbaDirection}`);
  }, false);


  // extra bits
  //
  // add sad simba animation/ scuffle animation when simba meets enemy
  // add fart/ bark/ camera sounds
  // make grid bigger?
  // enter konami code to get a full fart boost
  // when timerObj.timeElapsed === 100 add crazydog at full speed !!

});
