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

//   function fadeOut() {
//     const initialOpacity = 1;
//     const timerId = setInterval(() => {}, );
//   }
//   // FUNCTIONS
//   function fadeOut(element) {
//     const op = 1;  // initial opacity
//     const timer = setInterval(function () {
//         if (op <= 0.1){
//             clearInterval(timer);
//             element.style.display = 'none';
//         }
//         element.style.opacity = op;
//         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op -= op * 0.1;
//     }, 50);
// }

  // GENERATE GRID
  // height & width of grid
  const height = 10;
  const width = 10;
  const grid = document.querySelector('#grid');
  // cells array will get populated with the div's generated
  const cells = [];
  // currentCell = jimba's position
  let currentCell = 0;
  // enemyCell = enemy's position
  let enemyCell = 99;

  // GENERATE SQUARE
  for (let i=0; i<height*width; i++) {
    const div = document.createElement('div');
    grid.appendChild(div);
    cells.push(div);
  }

  // GENERATE WALLS
  //turn into wallDictionary later
  const walls = [2, 12, 15, 16, 17, 22, 47, 48, 49, 51, 52, 53, 77, 83, 87, 93, 97];
  for (let i=0; i<walls.length; i++) {
    cells[walls[i]].classList.add('wall');
  }

  // ADD JIMBA TO BOARD
  cells[currentCell].classList.add('jimba');
  // MAKE JIMBA MOVE & FART -> CAN'T MOVE PAST GRID EDGE & CAN'T MOVE INTO WALLS
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 39 ) {
      console.log('right arrow pressed');
      if(currentCell%width !== width-1 && !cells[currentCell+1].classList.contains('wall')){
        cells[currentCell].classList.remove('jimba');
        currentCell += 1;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 37) {
      console.log('left arrow pressed');
      if(currentCell%width !== 0 && !cells[currentCell-1].classList.contains('wall')){
        cells[currentCell].classList.remove('jimba');
        currentCell -= 1;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 40) {
      console.log('down arrow pressed');
      if (currentCell < width*height-1 && !cells[currentCell+width].classList.contains('wall')) {
        cells[currentCell].classList.remove('jimba');
        currentCell += width;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 38) {
      console.log('up arrow pressed');
      if (currentCell > width-1 && !cells[currentCell-width].classList.contains('wall')) {
        cells[currentCell].classList.remove('jimba');
        currentCell -= width;
        cells[currentCell].classList.add('jimba');
      }
    }
    if (e.keyCode === 32) {
      console.log('spacebar pressed');
      const fartCell = cells[currentCell];
      fartCell.classList.add('fadeInOutGreen');
      window.setTimeout(() => {
        fartCell.classList.remove('fadeInOutGreen');
      }, 1500);
    }
  }, false);

  // ADD ENEMY TO THE BOARD
  cells[enemyCell].classList.add('enemy');
  // ALGORITHM TO MOVE ENEMY
  window.setInterval(() => {
    // moving right
    if(currentCell%width !== width-1 && !cells[currentCell+1].classList.contains('wall')){
      cells[currentCell].classList.remove('jimba');
      currentCell += 1;
      cells[currentCell].classList.add('jimba');
    }
  }, 1000);




});
