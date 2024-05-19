let colors;
const triColorArray = [];
const hStep = 10;
const vStep = 10;
const numRows = 180 / vStep;
const numCols = 360 / hStep;
let x = 0;
let y = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];

  for (let row = 0; row < numRows; row++) {
    triColorArray.push([]);
    for (let col = 0; col < numCols; col++) {
      if (row === 0) {
        triColorArray[0].push({ v: col % 3, h: col === 0 ? 0 : null });
      } else {
        triColorArray[row].push({ h: col === 0 ? row % 3 : null, v: null });
      }
    }
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(2);
  orbitControl();

  for (let i = 0; i < 360; i += hStep) {
    for (let j = vStep; j < 180; j += vStep) {
      const startH = polarToCart(i - hStep, j, 100);
      const endH = polarToCart(i, j, 100);
      const tc = triColorArray[(j - vStep) / vStep][i / hStep];
      stroke(colors[tc.h] ?? 255);

      line(startH.x, startH.y, startH.z, endH.x, endH.y, endH.z);

      if (j != 180 - vStep) {
        stroke(colors[tc.v] ?? 255);
        const startV = polarToCart(i, j, 100);
        const endV = polarToCart(i, j + vStep, 100);
        line(startV.x, startV.y, startV.z, endV.x, endV.y, endV.z);
      }
    }
  }

  x = (x + 1) % numCols;
  if (x == 0) ++y;
  if (y < numRows) {
    colorH(x, y, triColorArray);
    colorV(x, y, triColorArray);
  }
}

function polarToCart(hTheta, vTheta, r) {
  return createVector(
    r * sin(vTheta) * cos(hTheta),
    r * sin(vTheta) * sin(hTheta),
    r * cos(vTheta)
  );
}

function otherColor(a, b) {
  return (((-a - b) % 3) + 3) % 3;
}

function colorH(x, y, colorArray) {
  if (x === 0) return;

  colorArray[y][x].h =
    (x + y) % 2 === 0
      ? colorArray[y][x - 1].h
      : otherColor(colorArray[y][x - 1].v, colorArray[y][x - 1].h);
}

function colorV(x, y, colorArray) {
  if (y === 0) return;

  colorArray[y][x].v =
    (x + y) % 2 === 1
      ? colorArray[y - 1][x].v
      : otherColor(colorArray[y - 1][x].v, colorArray[y - 1][x].h);
}
