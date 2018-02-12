// MVP
// 1. generate grid with height * width variables
// 2. put simba in, make him move, make sure he cannot move past the edge of the grid
// 3. generate walls, can't move past walls.
// 4. simba releases a trail of fart.
// 5. generate an enemy, make it move using an algorithm (move in one direction until it reaches the end of the grid, turn repeat)
//
// do 1 map & 1 level, extend the game by making more maps with more levels.

window.addEventListener('DOMContentLoaded', () => {
  // Level 1

  // VARIABLES
  const height = 10;
  const width = 10;
  const grid = document.querySelector('#grid');
  grid.style.cssText = `height: ${height*50}px; width: ${width*50}px`;
  const fartMeter = document.querySelector('#fartMeter');
  const scoreBoard = document.querySelector('#score');
  const timer = document.querySelector('#timer');
  const message = document.querySelector('#message');
  // cells array will get populated with the div's generated
  const cells = [];
  // currentCell = jimba's position
  let currentCell = 0;
  // enemyCell = enemy's position
  let enemyCell = 99;
  // chickenCell = chicken position
  let chickenCell = null;
  // timeCell = time boost position
  let timeCell = null;
  // fartMeter = jimba's fart fuel
  let farts = 10;
  // score
  let score = 0;

  // TIMER
  let count = 60;
  const timerId = setInterval(() => {
    count--;
    timer.innerHTML = count;
    if (count <= 0) {
      clearInterval(timerId);
      //END GAME WHEN TIME REACHES 0
    }
  }, 1000);

  // INITIAL MESSAGE
  message.innerHTML = 'I\'ve had a big dinner today so theres a few farts left in the tank but to get more, eat some chicken! For more time, keep an eye out for the time power ups';

  // GENERATE GRID & PUSH ELEMENTS TO CELLS ARRAY FOR EASY ACCESS
  for (let i=0; i<height*width; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
    cells.push(div);
  }

  //GENERATE FART METER
  const div = document.createElement('div');
  const collectedFart = fartMeter.appendChild(div);
  collectedFart.style.cssText = `background-color: green; height: 100%; width: ${farts*2}%`;

  // GENERATE SCOREBOARD
  scoreBoard.innerHTML = `Your score is ${score}`;

  // GENERATE WALLS
  // turn into wallDictionary later
  const walls = [2, 12, 15, 16, 17, 22, 47, 48, 49, 51, 52, 53, 77, 83, 87, 93, 97];
  for (let i=0; i<walls.length; i++) {
    cells[walls[i]].classList.add('wall');
  }

  // FUNCTION TO GENERATE RANDOM CELL (NOT IN A WALL)
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
  // ADD INITIAL TIME POWERUP TO THE BOARD, GENERATES EVERY 10 SECONDS
  makeRandomCell('time', 10000);
  // ADD INITIAL CHICKEN TO THE BOARD.
  makeRandomCell('chicken');

  // ADD JIMBA TO BOARD
  cells[currentCell].classList.add('jimba-right');
  const jimbaFacing = ['right', 'left', 'down', 'up'];
  let jimbaDirection = 'right';
  // MAKE JIMBA MOVE & FART -> CAN'T MOVE PAST GRID EDGE & CAN'T MOVE INTO WALLS, MOVE WITH ARROW KEYS OR WASD. PRESS SPACEBAR TO FART.
  window.addEventListener('keydown', (e) => {
    const jimbaMovementConditions = {
      right: currentCell%width !== width-1 && !cells[currentCell+1].classList.contains('wall'),
      left: currentCell%width !== 0 && !cells[currentCell-1].classList.contains('wall'),
      down: currentCell < width*height-width && !cells[currentCell+width].classList.contains('wall'),
      up: currentCell > width-1 && !cells[currentCell-width].classList.contains('wall')
    };
    // FUNCTION TO MOVE JIMBA
    function moveJimba(conditions, movement, direction) {
      if (conditions) {
        currentCell = currentCell + movement;
        jimbaDirection = direction;
      }
    }

    // first, remove jimba
    cells[currentCell].classList.remove(`jimba-${jimbaDirection}`);
    // JIMBA MEETS ENEMY LOGIC
    if (cells[currentCell].classList.contains('enemy')) {
      if (farts > 0) {
        farts -= 5;
        if (farts <= 0) {
          farts = 0;
        }
      }
      collectedFart.style.width = `${farts*2}%`;
      score -= 5;
      scoreBoard.innerHTML = `Your score is ${score}`;
      message.innerHTML = 'Oh no! <br> Jimba\'s lost points and energy!';
      //add sad simba animation
    }
    // ENEMY MEETS FART LOGIC
    if (cells[enemyCell].classList.contains('fart')) {
      message.innerHTML = 'SCORE! Fart in all the faces!!';
      score++;
      scoreBoard.innerHTML = `Your score is ${score}`;
      console.log(score);
      // add enemy lose animation
    }
    // JIMBA MEETS CHICKEN LOGIC
    if (cells[currentCell].classList.contains('chicken')) {
      cells[currentCell].classList.remove('chicken');
      makeRandomCell('chicken', 0);
      if (farts < 50) {
        farts += 5;
        message.innerHTML = 'Yum yum, chicken.';
        if (farts >= 50) {
          farts = 50;
          message.innerHTML = 'The fartmeter is maxed out!';
          collectedFart.style.width = '100%';
        }
        collectedFart.style.width = `${farts*2}%`;
        console.log(farts);
      }
    }
    // JIMBA MEETS TIME LOGIC
    if (cells[currentCell].classList.contains('time')) {
      cells[currentCell].classList.remove('time');
      count += 10;
      message.innerHTML = 'Ooooo. Extra time!';
      makeRandomCell('time', 10000);
    }
    // JIMBA MOVES RIGHT
    if (e.keyCode === 39 || e.keyCode === 68) {
      moveJimba(jimbaMovementConditions.right, 1, 'right');
    }
    // JIMBA MOVES LEFT
    if (e.keyCode === 37 || e.keyCode === 65) {
      moveJimba(jimbaMovementConditions.left, -1, 'left');
    }
    // JIMBA MOVES DOWN
    if (e.keyCode === 40 || e.keyCode === 83) {
      moveJimba(jimbaMovementConditions.down, width, 'down');
    }
    // JIMBA MOVES UP
    if (e.keyCode === 38 || e.keyCode === 87) {
      moveJimba(jimbaMovementConditions.up, -width, 'up');
    }
    // JIMBA FARTS
    if (e.keyCode === 32) {
      console.log('spacebar pressed');
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
    // put jimba back
    cells[currentCell].classList.add(`jimba-${jimbaDirection}`);
  }, false);

  // ADD ENEMY TO THE BOARD
  cells[enemyCell].classList.add('enemy');
  // ALGORITHM TO MOVE ENEMY
  const enemyFacing = ['right', 'left', 'down', 'up'];
  let enemyDirection = enemyFacing[Math.floor(Math.random() * enemyFacing.length)]; //initialise at random
  // FUNCTION FOR ENEMY MOVEMENT
  function moveEnemy(conditions, movement) {
    if(conditions) {
      enemyCell = enemyCell + movement;
    } else {
      enemyDirection = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
    }
  }
  const enemyTimer = window.setInterval(() => {
    const enemyMovementConditions = {
      right: enemyCell%width !== width-1 && !cells[enemyCell+1].classList.contains('wall'),
      left: enemyCell%width !== 0 && !cells[enemyCell-1].classList.contains('wall'),
      down: enemyCell < width*height-width && !cells[enemyCell+width].classList.contains('wall'),
      up: enemyCell > width-1 && !cells[enemyCell-width].classList.contains('wall')
    };
    cells[enemyCell].classList.remove('enemy');
    // use switch statement to move enemy
    switch(enemyDirection) {
      case 'right':
        moveEnemy(enemyMovementConditions.right, 1);
        break;
      case 'left':
        moveEnemy(enemyMovementConditions.left, -1);
        break;
      case 'down':
        moveEnemy(enemyMovementConditions.down, width);
        break;
      case 'up':
        moveEnemy(enemyMovementConditions.up, -width);
        break;
    }
    cells[enemyCell].classList.add('enemy');
  }, 1000);



  // extra bits
  //
  // flip sprite when changing direction
  // add theme music
  // add fart/ bark/ camera sounds
  // make grid bigger?
  // add title page + definition of cropdusting + story
  // enter konami code to get a full fart boost
  // animate simba's movement so it looks like he moves fluidly


});
