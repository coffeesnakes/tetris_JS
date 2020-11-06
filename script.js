const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20)

function arenaSweep() {
  let rowCounter = 1;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y
    player.score += rowCounter * 10;
    rowCounter *= 2;
  }
}



function collision(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
    debugger;
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}



function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
          y + offset.y,
          1, 1);
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
  if (collision(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(offset) {
  player.pos.x += offset;
  if (collision(arena, player)) {
    player.pos.x -= offset;
  }
}

function playerRotate(direction) {
  const pos = player.pos.x
  let offset = 1;
  transpose(player.matrix, direction);
  while (collision(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      transpose(player.matrix, -direction);
      player.pos.x = pos;
      return;
    }
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = generatePiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
    (player.matrix[0].length / 2 | 0);
  if (collision(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function transpose(matrix, direction) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
          matrix[y][x],
          matrix[x][y],
        ];
    }
  }
  if (direction > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
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

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

let arena = createMatrix(12, 20)

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,

}

function generatePiece(type) {
  if (type === 'I') {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === 'L') {
    return [
      [0, 2, 0],
      [0, 2, 0],
      [0, 2, 2],
    ];
  } else if (type === 'J') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [3, 3, 0],
    ];
  } else if (type === 'O') {
    return [
      [4, 4],
      [4, 4],
    ];
  } else if (type === 'Z') {
    return [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'T') {
    return [
      [0, 7, 0],
      [7, 7, 7],
      [0, 0, 0],
    ];
  }
}

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];


// event listeners accessing keyCode property moves position responsively.
document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1)
  } else if (event.keyCode === 39) {
    playerMove(+1)
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
})

playerReset();
updateScore();
update();
