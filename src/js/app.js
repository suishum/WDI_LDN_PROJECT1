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

  // GENERATE GRID
  // height & width of grid
  const height = 10;
  const width = 10;
  const grid = document.querySelector('#grid');
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
  // fartMeter = jimba's fart fuel
  let farts = 10;
  console.log(farts);
  // score
  let score = 0;
  console.log(score);

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

  // MESSAGE
  message.innerHTML = 'Cropdust king Jimba';

  // GENERATE SQUARE
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

  // ADD CHICKEN POWERUP TO THE BOARD
  chickenCell = Math.floor(Math.random() * (height*width));
  // position cannot be the same as a wall.
  walls.forEach((wall) => {
    if (chickenCell === wall) {
      chickenCell = Math.floor(Math.random() * (height*width));
    }
  });
  cells[chickenCell].classList.add('chicken');

  // ADD JIMBA TO BOARD
  cells[currentCell].classList.add('jimba');
  // MAKE JIMBA MOVE & FART -> CAN'T MOVE PAST GRID EDGE & CAN'T MOVE INTO WALLS, MOVE WITH ARROW KEYS OR WASD. PRESS SPACEBAR TO FART.
  window.addEventListener('keydown', (e) => {
    // stop enemy when it collides with jimba, ADD SAD SIMBA ANIMATION
    if (currentCell === enemyCell) {
      farts -= 5;
      collectedFart.style.width = `${farts*2}%`;
      console.log(farts);
      score -= 5;
      scoreBoard.innerHTML = `Your score is ${score}`;
      console.log(score);
      message.innerHTML = 'Oh no! <br>Jimba\'s lost points and energy!';
    }
    if (cells[enemyCell].classList.contains('fart')) {
      message.innerHTML = 'SCORE! Fart in all their faces!!';
      score++;
      scoreBoard.innerHTML = `Your score is ${score}`;
      console.log(score);
      // add enemy lose animation
    }
    if (currentCell === chickenCell) {
      cells[chickenCell].classList.remove('chicken');
      chickenCell = Math.floor(Math.random() * (height*width));
      // position cannot be the same as a wall.
      walls.forEach((wall) => {
        if (chickenCell === wall) {
          chickenCell = Math.floor(Math.random() * (height*width));
        }
      });
      cells[chickenCell].classList.add('chicken');
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
    if (e.keyCode === 39 || e.keyCode === 68) {
      console.log('right arrow pressed');
      if(currentCell%width !== width-1 && !cells[currentCell+1].classList.contains('wall')){
        //add trainsition? move right
        cells[currentCell].classList.remove('jimba');
        currentCell += 1;
        //add transition left to right
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 37 || e.keyCode === 65) {
      console.log('left arrow pressed');
      if(currentCell%width !== 0 && !cells[currentCell-1].classList.contains('wall')){
        cells[currentCell].classList.remove('jimba');
        currentCell -= 1;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 40 || e.keyCode === 83) {
      console.log('down arrow pressed');
      if (currentCell < width*height-width && !cells[currentCell+width].classList.contains('wall')) {
        cells[currentCell].classList.remove('jimba');
        currentCell += width;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 38 || e.keyCode === 87) {
      console.log('up arrow pressed');
      if (currentCell > width-1 && !cells[currentCell-width].classList.contains('wall')) {
        cells[currentCell].classList.remove('jimba');
        currentCell -= width;
        cells[currentCell].classList.add('jimba');
      }
    }
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
  }, false);

  // ADD ENEMY TO THE BOARD
  cells[enemyCell].classList.add('enemy');
  // ALGORITHM TO MOVE ENEMY
  const enemyFacing = ['right', 'left', 'up', 'down'];
  let direction = enemyFacing[0]; //initialise at right
  const enemyTimer = window.setInterval(() => { // stop enemy movement when on the same square as jimba (minus score) or when enemy collides with fart (plus score).

    // use switch statement to move enemy
    switch(direction) {
      case 'right':
        if(enemyCell%width !== width-1 && !cells[enemyCell+1].classList.contains('wall')) {
          cells[enemyCell].classList.remove('enemy');
          enemyCell += 1;
          cells[enemyCell].classList.add('enemy');
        } else {
          direction = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
        }
        break;
      case 'left':
        if(enemyCell%width !== 0 && !cells[enemyCell-1].classList.contains('wall')) {
          cells[enemyCell].classList.remove('enemy');
          enemyCell -= 1;
          cells[enemyCell].classList.add('enemy');
        } else {
          direction = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
        }
        break;
      case 'down':
        if(enemyCell < width*height-width && !cells[enemyCell+width].classList.contains('wall')) {
          cells[enemyCell].classList.remove('enemy');
          enemyCell += width;
          cells[enemyCell].classList.add('enemy');
        } else {
          direction = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
        }
        break;
      case 'up':
        if(enemyCell > width-1 && !cells[enemyCell-width].classList.contains('wall')) {
          cells[enemyCell].classList.remove('enemy');
          enemyCell -= width;
          cells[enemyCell].classList.add('enemy');
        } else {
          direction = enemyFacing[Math.floor(Math.random() * enemyFacing.length)];
        }
        break;
    }
  }, 1000);



  // extra bits
  //
  // flip sprite when changing direction
  // add theme music
  // add fart/ bark/ camera sounds
  // make grid bigger?
  // add title page + definition of cropdusting + story
  // enter konami code to get a full fart boost
  //


});
