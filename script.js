const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(15, 15)


const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
]

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(player.matrix, player.pos)
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
// drops the piece one coordinate on the drop interval 1000ms
// dropCounter just tracks the location
let dropCounter = 0;
let dropInterval = 1000;

let timeLog = 0;


function playerDrop() {
  player.pos.y++;
  dropCounter = 0;
}
function update(time = 0) {
  const deltaTime = time - timeLog;
  timeLog = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    player.pos.y++;
    dropCounter = 0;
  }
  draw();
  requestAnimationFrame(update);
}

const player = {
  pos: { x: 5, y: 0 },
  matrix: matrix,
}

// event listeners accessing keyCode property moves position responsively.
document.addEventListener('keydown', event => {

  if (event.keyCode === 37) {
    player.pos.x--;
  } else if (event.keyCode === 39) {
    player.pos.x++;
  } else if (event.keyCode === 40) {
    playerDrop();
  }
})

update();
