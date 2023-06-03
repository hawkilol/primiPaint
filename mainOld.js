//Make a valid coordinate check fucntion
//Make temporary pixel to help ploting
//bronca oracle
//in.js:233 Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute set to true. See: https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
//g
// Function to perform orthogonal projection
function rasterize3DMatrix(matrix) {
  console.log("call");
  
  const matrixWidth = matrix.length;
  const matrixHeight = matrix[0].length;
  const matrixDepth = matrix[0][0].length;
  console.log(matrixWidth);
  console.log(matrixHeight);
  console.log(matrixDepth);

  // Scale the 3D matrix to fit the canvas
  const scaleX = canvas.width / matrixWidth;
  const scaleY = canvas.height / matrixHeight;
  const scaleZ = Math.min(scaleX, scaleY); // Maintain aspect ratio

  for (let z = 0; z < matrixDepth; z++) {
    for (let y = 0; y < matrixHeight; y++) {
      for (let x = 0; x < matrixWidth; x++) {
        // Calculate the 2D coordinates
        const xPos = x * scaleZ;
        const yPos = y * scaleZ;

          // If the matrix value is non-zero, draw lines between neighboring points
          const nextX = (x + 1) * scaleZ;
          const nextY = y * scaleZ;
          const nextZ = z * scaleZ;

          const nextXPos = nextX * scaleZ;
          const nextYPos = nextY * scaleZ;
          const nextZPos = nextZ * scaleZ;

          // Draw lines using Bresenham's algorithm
          console.log(xPos);
          bresenham(xPos, yPos, nextXPos, nextYPos);
          bresenham(xPos, yPos, xPos, nextZPos);
          bresenham(nextXPos, yPos, nextXPos, nextZPos);
          bresenham(xPos, nextYPos, nextXPos, nextYPos);
          bresenham(xPos, nextYPos, xPos, nextZPos);
          bresenham(nextXPos, nextYPos, nextXPos, nextZPos);

          // Paint current point
          paintPixelCoords(xPos, yPos);
      
      }
    }
  }
}

function orthogonalProjection(polygon) {
  var transformedPolygon = [];
  
  for (var i = 0; i < polygon.length; i++) {
    var point = polygon[i];
    
    // Perform orthogonal projection calculations
    var transformedPoint = [
      point[0], // x-coordinate remains the same
      point[1]  // y-coordinate remains the same
    ];
    
    transformedPolygon.push(transformedPoint);
  }
  
  return transformedPolygon;
}

// Function to perform perspective projection
function perspectiveProjection(polygon, focalPoint) {
  var transformedPolygon = [];
  
  var focalX = focalPoint[0];
  var focalY = focalPoint[1];
  
  for (var i = 0; i < polygon.length; i++) {
    var point = polygon[i];
    
    var x = point[0];
    var y = point[1];
    var z = point[2];
    
    // Perform perspective projection calculations
    var projectedX = x; // Placeholder, replace with your calculation
    var projectedY = y; // Placeholder, replace with your calculation

    // Add the projected coordinates to the transformedPolygon array
    var transformedPoint = [projectedX, projectedY];
    transformedPolygon.push(transformedPoint);
  }
  
  return transformedPolygon;
}

// Function to perform conic projection
function conicProjection(polygon) {
  var transformedPolygon = [];
  
  for (var i = 0; i < polygon.length; i++) {
    var point = polygon[i];
    
    var x = point[0];
    var y = point[1];
    var z = point[2];
    
    // Perform conic projection calculations
    var projectedX = x; // Placeholder, replace with your calculation
    var projectedY = y; // Placeholder, replace with your calculation

    // Add the projected coordinates to the transformedPolygon array
    var transformedPoint = [projectedX, projectedY];
    transformedPolygon.push(transformedPoint);
  }
  
  return transformedPolygon;
}

// Function to perform perspective projection with 2 or 3 escape points
function escapePointsProjection(polygon, escapePoints) {
  var transformedPolygon = [];
  
  for (var i = 0; i < polygon.length; i++) {
    var point = polygon[i];
    
    var x = point[0];
    var y = point[1];
    var z = point[2];
    
    // Perform escape points projection calculations
    var projectedX = x; // Placeholder, replace with your calculation
    var projectedY = y; // Placeholder, replace with your calculation

    // Add the projected coordinates to the transformedPolygon array
    var transformedPoint = [projectedX, projectedY];
    transformedPolygon.push(transformedPoint);
  }
  
  return transformedPolygon;
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let color = document.getElementById("color-picker").value;

let width = 0;
let height = 0;
let pixelSize = 0;
let isPainting = false;
let startXY = [0, 0];
let endXY = [0, 0];
let pointsArray = [];
let bezierResolution = 100;
let mode = "paint";
let pixelQueue = []; // Queue to store the pixel fill operations
// let coord = { x: 0, y: 0 };
function getWHinputs() {
  width = Number(document.getElementById("width").value);
  height = Number(document.getElementById("height").value);
  pixelSize = Number(document.getElementById("pixelSize").value);
  mainCreateCanvas();
}

function mainCreateCanvas() {
  canvas.width = width;
  canvas.height = height;
  width = canvas.width / pixelSize;
  height = canvas.height / pixelSize;

  const grid = [];
  for (let i = 0; i < width; i++) {
    grid[i] = [];
    for (let j = 0; j < height; j++) {
      grid[i][j] = "#ffffff";
    }
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      ctx.fillStyle = grid[i][j];
      ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
  }
}
requestAnimationFrame(processPixelQueue);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mousemove", paintPixel);
requestAnimationFrame(processPixelQueue);
function startPainting(e) {
  isPainting = true;
  paintPixel(e);
}
function stopPainting() {
  isPainting = false;
}
// function reposition(event) {
//   coord.x = event.clientX - canvas.offsetLeft;
//   coord.y = event.clientY - canvas.offsetTop;
// }
function paintPixel(e) {
  if (!isPainting) return;
  const rect = canvas.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - canvas.width / 2;
  const offsetY = rect.top + canvas.height / 2 - e.clientY;
  const x = Math.floor(offsetX / pixelSize);
  const y = Math.floor(offsetY / pixelSize) + 1;
  handleMode(x, y);
}
function paintPixelInsta(x, y) {
  const color = document.getElementById("color-picker").value;
  const gridX = Math.floor(width / 2) + x;
  const gridY = Math.floor(height / 2) - y;
  if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
    requestAnimationFrame (() => {
      ctx.fillStyle = color;
      ctx.fillRect(gridX * pixelSize, gridY * pixelSize, pixelSize, pixelSize);
    })
    
  }
}
function paintPixelCoords(x, y) {
  color = document.getElementById("color-picker").value;
  const gridX = Math.floor(width / 2) + x;
  const gridY = Math.floor(height / 2) - y;
  if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
    pixelQueue.push({ x: gridX, y: gridY, color: color }); // Add the pixel fill operation to the queue
    
  }
}
function paintPixelColor(x, y, color) {
  const gridX = Math.floor(width / 2) + x;
  const gridY = Math.floor(height / 2) - y;
  if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
    pixelQueue.push({ x: gridX, y: gridY, color: color }); // Add the pixel fill operation to the queue
  }
}

function processPixelQueue() {
  if (pixelQueue.length > 0) {
    const { x, y, color } = pixelQueue.shift(); // Get the next pixel fill operation from the queue
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  // Schedule the next frame
  requestAnimationFrame(processPixelQueue);
}
//paintArray
function paintArray(coordsArray) {
  let index = 0;

  function paintNextPixel() {
    if (index < coordsArray.length) {
      const [x, y] = coordsArray[index];
      paintPixelCoords(x, y);
      index++;
      requestAnimationFrame(paintNextPixel);
    }
  }

  paintNextPixel();
}
///Algos
// Bresenham / plotPixel

function plotPixel(x1, y1, x2, y2, dx, dy, decide) {
  let XYS = [];
  //this.XYS = []
  // pk is initial decision making parameter
  // Note:x1&y1,x2&y2, dx&dy values are interchanged
  // and passed in plotPixel function so
  // it can handle both cases when m>1 & m<1
  let pk = 2 * dy - dx;
  for (let i = 0; i <= dx; i++) {
    console.log(x1 + "," + y1);
    if (decide == 0) {
      XYS.push([x1, y1]);
    } else {
      XYS.push([y1, x1]);
    }
    // checking either to decrement or increment the
    // value if we have to plot from (0,100) to
    // (100,0)
    if (x1 < x2) x1++;
    else x1--;
    if (pk < 0) {
      // decision value will decide to plot
      // either x1 or y1 in x's position
      if (decide == 0) {
        pk = pk + 2 * dy;
      } else pk = pk + 2 * dy;
    } else {
      if (y1 < y2) y1++;
      else y1--;
      pk = pk + 2 * dy - 2 * dx;
    }
  }
  return XYS;
}
let coordsList = [];
//Bresenham
function bresenham(x1, y1, x2, y2) {
  // Driver code
  let XYS = [];
  dx = Math.abs(x2 - x1);
  dy = Math.abs(y2 - y1);
  // If slope is less than one
  if (dx > dy) {
    // passing argument as 0 to plot(x,y)
    XYS = plotPixel(x1, y1, x2, y2, dx, dy, 0);
    console.log("0");
  }
  // if slope is greater than or equal to 1
  else {
    // passing argument as 1 to plot (y,x)
    XYS = plotPixel(y1, x1, y2, x2, dy, dx, 1);
    console.log("1");
  }
  coordsList = XYS;
  let xy = [];
  let xPlot = 0;
  let yPlot = 0;
  const numbers = [1, 2, 3, 4, 5];
  for (let i = 0; i < coordsList.length; i++) {
    xy = coordsList[i];
    xPlot = xy[0];
    yPlot = xy[1];
    //console.log(xPlot);
    paintPixelCoords(xPlot, yPlot);
  }
  return XYS;
}
//DrawCircle Polynomial
function paintCircle(x1, y1, radius) {
  console.log("radius");
  console.log(radius);
  var x = radius;
  var y = 0;
  var radiusError = 1 - x;

  while (x >= y) {
    paintPixelCoords(x + x1, y + y1);
    paintPixelCoords(-x + x1, y + y1);
    paintPixelCoords(x + x1, -y + y1);
    paintPixelCoords(-x + x1, -y + y1);
    paintPixelCoords(y + x1, x + y1);
    paintPixelCoords(-y + x1, x + y1);
    paintPixelCoords(y + x1, -x + y1);
    paintPixelCoords(-y + x1, -x + y1);

    y++;

    if (radiusError < 0) {
      radiusError += 2 * y + 1;
    } else {
      x--;
      radiusError += 2 * (y - x + 1);
    }
  }
}

//Polyline
//polyLine([10,10],[11,11],[12,12]);
function polyLine(coordsArr) {
  //coordsArr = [[x1,y1],[x2,y2] ....]
  if (coordsArr.length < 3) {
    return "Array < 3!  :(";
  }
  var x = 0,
    y = 0,
    xyFirst = coordsArr[0],
    xyPrev = coordsArr[0],
    xyCurr = [0, 0];

  for (var i = 1; i < coordsArr.length; i++) {
    xyCurr = coordsArr[i];
    bresenham(xyPrev[0], xyPrev[1], xyCurr[0], xyCurr[1]);
    xyPrev = coordsArr[i];
  }
  bresenham(xyPrev[0], xyPrev[1], xyFirst[0], xyFirst[1]);
}

//Get color - returns color of the coordinate
//Returns hex
function getRectColor(x, y) {
  const gridX = Math.floor(width / 2) + x;
  const gridY = Math.floor(height / 2) - y;

  const imageData = ctx.getImageData(
    gridX * pixelSize,
    gridY * pixelSize,
    pixelSize,
    pixelSize
  );

  const color = rgbToHex(
    imageData.data[0],
    imageData.data[1],
    imageData.data[2]
  );

  return color;
}
//Return rgb
function getRectColorRgb(x, y) {
  const gridX = Math.floor(width / 2) + x;
  const gridY = Math.floor(height / 2) - y;

  const imageData = ctx.getImageData(
    gridX * pixelSize,
    gridY * pixelSize,
    pixelSize,
    pixelSize
  );
  const color = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;
  return color;
}

// //Recursive Boundary fill

function boundFill(x, y, color, color1) {
  const colorCurr = getRectColor(x, y);
  if (colorCurr !== color && colorCurr !== color1) {
    paintPixelColor(x, y, color);
    boundFill(x + 1, y, color, color1);
    boundFill(x, y + 1, color, color1);
    boundFill(x - 1, y, color, color1);
    boundFill(x, y - 1, color, color1);
  }
}
function boundFill8(x, y, color, color1) {
  const colorCurr = getRectColor(x, y);
  if (colorCurr !== color && colorCurr !== color1) {
    paintPixelColor(x, y, color);
    boundFill8(x + 1, y, color, color1);
    boundFill8(x, y + 1, color, color1);
    boundFill8(x - 1, y, color, color1);
    boundFill8(x, y - 1, color, color1);
    boundFill8(x - 1, y - 1, color, color1);
    boundFill8(x - 1, y + 1, color, color1);
    boundFill8(x + 1, y - 1, color, color1);
    boundFill8(x + 1, y + 1, color, color1);
  }
}
//complete recursive floodfill
function floodFill(x, y, color) {
  const visited = new Set();
  const startColor = getRectColor(x, y);
  recursiveFill(x, y, color, startColor, visited);
}

function recursiveFill(x, y, color, startColor, visited) {
  const key = `${x},${y}`;

  if (visited.has(key)) {
    return; // Already visited
  }

  visited.add(key);

  if (getRectColor(x, y) !== startColor) {
    return; // Is the target color
  }

  if (getRectColor(x, y) !== color) {
    paintPixelColor(x, y, color);

    recursiveFill(x + 1, y, color, startColor, visited); // Right
    recursiveFill(x, y + 1, color, startColor, visited); // Down
    recursiveFill(x - 1, y, color, startColor, visited); // Left
    recursiveFill(x, y - 1, color, startColor, visited); // Up
  }
}

function floodFill2(x, y, color) {
  const stack = [];
  stack.push({ x, y });

  const startColor = getRectColor(x, y);
  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const colorCurr = getRectColor(x, y);

    if (colorCurr !== startColor) {
      continue;
    }

    if (colorCurr !== color) {
      paintPixelColor(x, y, color);

      stack.push({ x: x + 1, y });
      stack.push({ x: x, y: y + 1 });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y - 1 });
    }
  }
}

function stackFill8(x, y, color, color1) {
  const stack = [];
  stack.push({ x, y });

  while (stack.length > 0) {
    const { x, y } = stack.pop();
    const colorCurr = getRectColor(x, y);

    if (colorCurr !== color && colorCurr !== color1) {
      paintPixelColor(x, y, color);

      stack.push({ x: x + 1, y });
      stack.push({ x: x, y: y + 1 });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y - 1 });
      stack.push({ x: x + 1, y: y + 1 });
      stack.push({ x: x - 1, y: y + 1 });
      stack.push({ x: x + 1, y: y - 1 });
      stack.push({ x: x - 1, y: y - 1 });
    }
  }
}
//Bezier curv
// Function to calculate binomial coefficient
function binomialCoefficient(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }
  return result;
}

// Function to calculate the Bezier curve point
function calculateBezierPoint(t, points) {
  const n = points.length - 1;
  let x = 0;
  let y = 0;

  for (let i = 0; i <= n; i++) {
    const coefficient =
      binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
    x += points[i][0] * coefficient;
    y += points[i][1] * coefficient;
  }

  return { x, y };
}

// Function to plot the Bezier curve on a grid
function paintBezierCurve(points, resolution) {
  const resolution1 = resolution * points.length;
  const step = 1 / resolution1;
  const visited = new Set();

  for (let t = step; t <= 1; t += step) {
    const rect = canvas.getBoundingClientRect();

    const { x, y } = calculateBezierPoint(t, points);

    const offsetX = x - rect.left - canvas.width / 2;
    const offsetY = rect.top + canvas.height / 2 - y;
    const x1 = Math.floor(offsetX / pixelSize);
    const y1 = Math.floor(offsetY / pixelSize);

    let gridX = Math.floor(width / 2) + x1;
    let gridY = Math.floor(height / 2) - y1;
    gridX = Math.floor(x);
    gridY = Math.floor(y);

    const key = `${gridX},${gridY}`;
    if (!visited.has(key)) {
      paintPixelCoords(gridX, gridY);
      visited.add(key);
    }
  }
}

// const points = [
//   [50, 100],
//   [200, 50],
//   [300, 150],
//   [450, 100]
// ];

//const resolution = 100; // Increase the resolution for smoother curves

//paintBezierCurve([[50, 100],[200, 50],[300, 150],[450, 100]], 100);

//sweep flood fill
function scanFill(startX, startY, replacementColor) {
  const targetColor = getRectColor(startX, startY);
  const queue = [{ x: startX, y: startY }];
  const min = Number.MIN_SAFE_INTEGER;
  const max = Number.MAX_SAFE_INTEGER;
  const visited = new Set();

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    const key = `${x},${y}`;

    if (!visited.has(key) && getRectColor(x, y) === targetColor) {
      paintPixelColor(x, y, replacementColor);
      visited.add(key);

      // Check left
      if (x > min) queue.push({ x: x - 1, y });
      // Check right
      if (x < max) queue.push({ x: x + 1, y });
      // Check up
      if (y > min) queue.push({ x, y: y - 1 });
      // Check down
      if (y < max) queue.push({ x, y: y + 1 });
    }
  }
}
function scanFill1(startX, startY, replacementColor) {
  const targetColor = getRectColor(startX, startY);
  const stack = [[startX, startY]];
  const min = Number.MIN_SAFE_INTEGER;
  const max = Number.MAX_SAFE_INTEGER;
  while (stack.length > 0) {
    let [x, y] = stack.pop();

    while (x >= min && getRectColor(x, y) === targetColor) {
      x--;
    }

    x++;

    let leftPixelFound = false;
    let rightPixelFound = false;

    while (x < max && getRectColor(x, y) === targetColor) {
      paintPixelCoords(x, y);

      if (
        !leftPixelFound &&
        y > min &&
        getRectColor(x, y - 1) === targetColor
      ) {
        stack.push([x, y - 1]);
        leftPixelFound = true;
      } else if (
        leftPixelFound &&
        y > min &&
        getRectColor(x, y - 1) !== targetColor
      ) {
        leftPixelFound = false;
      }

      if (
        !rightPixelFound &&
        y < max &&
        getRectColor(x, y + 1) === targetColor
      ) {
        stack.push([x, y + 1]);
        rightPixelFound = true;
      } else if (
        rightPixelFound &&
        y < max &&
        getRectColor(x, y + 1) !== targetColor
      ) {
        rightPixelFound = false;
      }

      x++;
    }
  }
}

// haduken fill!
// function scanFill(x, y, color) {
//   const canvasWidth = canvas.width;
//   const canvasHeight = canvas.height;
//   const stack = [];
//   stack.push({ x, y });

//   const startColor = getRectColor(x, y);
//   if (startColor === color) {
//     return;
//   }

//   while (stack.length > 0) {
//     const { x, y } = stack.pop();
//     let currentX = x;
//     let currentY = y;

//     // Find the leftmost boundary of the region to fill
//     while (currentX >= 0 && getRectColor(currentX, currentY) === startColor) {
//       currentX--;
//     }
//     currentX++;

//     let spanAbove = false;
//     let spanBelow = false;

//     // Fill the scanline and check for spans above and below
//     while (currentX < canvasWidth && getRectColor(currentX, currentY) === startColor) {
//       paintPixelColor(currentX, currentY, color);

//       // Check above the current scanline
//       if (!spanAbove && currentY > 0 && getRectColor(currentX, currentY - 1) === startColor) {
//         stack.push({ x: currentX, y: currentY - 1 });
//         spanAbove = true;
//       } else if (spanAbove && currentY > 0 && getRectColor(currentX, currentY - 1) !== startColor) {
//         spanAbove = false;
//       }

//       // Check below the current scanline
//       if (!spanBelow && currentY < canvasHeight - 1 && getRectColor(currentX, currentY + 1) === startColor) {
//         stack.push({ x: currentX, y: currentY + 1 });
//         spanBelow = true;
//       } else if (spanBelow && currentY < canvasHeight - 1 && getRectColor(currentX, currentY + 1) !== startColor) {
//         spanBelow = false;
//       }

//       // Move to the next pixel on the scanline
//       currentX++;
//     }
//   }
// }
function matrixMultiply(m1, m2) {
  var result = [];
  for (var i = 0; i < m1.length; i++) {
      result[i] = [];
      for (var j = 0; j < m2[0].length; j++) {
          var sum = 0;
          for (var k = 0; k < m1[0].length; k++) {
              sum += m1[i][k] * m2[k][j];
          }
          result[i][j] = sum;
      }
  }
  return result;
}
function matrixMultiply2(m1, m2) {
  var numRowsM1 = m1.length;
  var numColsM1 = m1[0].length;
  var numRowsM2 = m2.length;
  var numColsM2 = m2[0].length;

  // Adjust the dimensions of the matrices
  if (numColsM1 !== numRowsM2) {
    return null; // Matrices are incompatible for multiplication
  }

  var adjustedM1 = m1;
  var adjustedM2 = m2;

  if (numColsM1 < numColsM2) {
    adjustedM1 = addColumns(m1, numColsM2 - numColsM1);
  } else if (numColsM1 > numColsM2) {
    adjustedM2 = addColumns(m2, numColsM1 - numColsM2);
  }

  // Perform matrix multiplication with adjusted matrices
  var result = [];
  for (var i = 0; i < adjustedM1.length; i++) {
    result[i] = [];
    for (var j = 0; j < adjustedM2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < adjustedM1[0].length; k++) {
        sum += adjustedM1[i][k] * adjustedM2[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}

// Helper function to add columns filled with zeroes to a matrix
function addColumns(matrix, numCols) {
  var newMatrix = [];
  for (var i = 0; i < matrix.length; i++) {
    //newMatrix[i] = matrix[i].concat(Array(numCols).fill(1));
  }
  return newMatrix;
}

function matrixMultiply2(matrix1, matrix2) {
  const rows1 = matrix1.length;
  const cols1 = matrix1[0].length;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0].length;

  if (cols1 !== rows2) {
    throw new Error('Matrix dimensions are not compatible for multiplication');
  }

  const result = [];

  for (let i = 0; i < rows1; i++) {
    const row = [];

    for (let j = 0; j < cols2; j++) {
      let sum = 0;

      for (let k = 0; k < cols1; k++) {
        sum += matrix1[i][k] * matrix2[k][j];
      }

      row.push(sum);
    }

    result.push(row);
  }

  return result;
}
function matrixXVector(matrix, vector) {
  if (matrix.length !== 3 || matrix[0].length !== 3 || vector.length !== 3) {
    throw new Error('Invalid matrix or vector dimensions');
  }

  var result = [0, 0, 0];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      result[i] += matrix[i][j] * vector[j];
    }
  }

  return result;
}



 


//Translation
// THIS MODIFYS THE POLYGON TO THE POLYLINE FOR SOME REASON!!??! HOW?:
// function translatePolygon(polygon, dx, dy) {
//   // Iterate over each vertex of the polygon
//   console.log(polygon);
//   for (let i = 0; i < polygon.length; i++) {
//     const vertex = polygon[i];

//     // Translate the vertex by adding the displacement values
//     vertex[0] += dx;
//     vertex[1] += dy;
//   }

//   // Return the modified polygon array
//   polyLine(polygon);
//   return polygon;
// }

function translatePolygon(polygon, dx, dy) {
  const modifiedPolygon = [];

  // Iterate over each vertex of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const vertex = polygon[i].slice(); // Create a copy of the vertex

    // Translate the vertex by adding the displacement values
    vertex[0] += dx;
    vertex[1] += dy;

    // Add the translated vertex to the modified polygon array
    modifiedPolygon.push(vertex);
  }
  polyLine(modifiedPolygon);
  return modifiedPolygon;
}

//Rotation
function rotatePolygon(polygon, angle, pivotX, pivotY) {
  const modifiedPolygon = [];
  // Convert the angle to radians
  const radians = (Math.PI / 180) * angle;

  // Iterate over each vertex of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const vertex = polygon[i];

    const x = vertex[0];
    const y = vertex[1];

    // Translate the pivot point to the origin
    const translatedX = x - pivotX;
    const translatedY = y - pivotY;

    // Apply the rotation formula
    const rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    const rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

    // Translate the rotated vertex back to its original position
    vertex[0] = rotatedX + pivotX;
    vertex[1] = rotatedY + pivotY;
    modifiedPolygon.push(vertex);
  }

  polyLine(modifiedPolygon);
  return modifiedPolygon
}

//Scaling
function scalePolygon(polygon, scaleX, scaleY, fixedX, fixedY) {
  const modifiedPolygon = [];
  // Iterate over each vertex of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const vertex = polygon[i];

    const x = vertex[0];
    const y = vertex[1];

    // Translate the fixed point to the origin
    const translatedX = x - fixedX;
    const translatedY = y - fixedY;

    // Apply the scaling factors
    const scaledX = translatedX * scaleX;
    const scaledY = translatedY * scaleY;

    // Translate the scaled vertex back to its original position
    vertex[0] = scaledX + fixedX;
    vertex[1] = scaledY + fixedY;
    modifiedPolygon.push(vertex);
  }

  polyLine(modifiedPolygon);
  return modifiedPolygon
}
function scalePolygonMatrix(polygon, scaleX, scaleY, fixedX, fixedY) {
  // Create the scaling matrix
  const scalingMatrix = [
    [scaleX, 0, (1 - scaleX) * fixedX],
    [0, scaleY, (1 - scaleY) * fixedY],
    [0, 0, 1]
  ];
  let scaledVertices = [];
  // Iterate over each vertex of the polygon
  console.log("len");
  console.log(polygon.length);
  for (let i = 0; i < polygon[0].length; i++) {
    const vertex = polygon[i];

    let column = [];
    for(var c=0; c < polygon.length; c++){
      column.push(polygon[c][i]);
    }
    console.log("polyS");
    console.log(column);
    console.log("Sca");
    console.log(scalingMatrix);
    // Apply the scaling matrix to the vertex vector
    const scaledVertex = matrixXVector(scalingMatrix,column);
    console.log("scaledVertex");
    console.log(scaledVertex);
    scaledVertices.push(scaledVertex);
  }
  const scaledMatrix = transposeMatrix(scaledVertices);
  console.log("ts");
  console.log(scaledVertices);
  return scaledMatrix
}
function vertices3d2Matrix(vertices) {
  const numRows = vertices.length;
  const numCols = vertices[0].length;

  // Create an empty matrix with the appropriate dimensions
  const matrix = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    matrix[i] = new Array(numCols).fill(0);
  }

  // Copy the vertices into the matrix
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      matrix[j][i] = vertices[i][j];
    }
  }

  return matrix;
}
function vertices2d2Matrix(vertices) {
  const numRows = vertices.length;
  const numCols = vertices[0].length;

  // Create an empty matrix with the appropriate dimensions
  const matrix = new Array(numRows);
  for (let i = 0; i < numRows; i++) {
    matrix[i] = new Array(numCols).fill(0);
  }

  // Copy the vertices into the matrix
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      matrix[j][i] = vertices[i][j];
    }
  }
  for (let j = 0; j <= numCols; j++) {
    console.log(numCols);
    matrix[numRows - 1][j] = 1;
  }

  return matrix;
}
function transposeMatrix(matrix) {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const transposedMatrix = [];

  for (let j = 0; j < numCols; j++) {
    transposedMatrix[j] = [];
    for (let i = 0; i < numRows; i++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}

//Broken!?
function translatePolygonMatrix(polygon, dx, dy) {
  
  const translationMatrix = [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1]
  ];
  

  // Create a new array to store the transformed polygon
  const transformedPolygon = [];
  const transformedPolygon2 = [];
  // Iterate over each vertex of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const vertex = polygon[i];
    
    // Convert the vertex to homogeneous coordinates [x, y, 1]
    const homogeneousMatrix = [
      [vertex[0]],
      [vertex[1]],
      [1]
    ];

    // Apply the translation matrix to the vertex
    
    const translatedVertex = matrixMultiply(translationMatrix, homogeneousMatrix);

    // Add the transformed vertex to the new polygon array
    console.log(translatedVertex);
    transformedPolygon.push([translatedVertex[0], translatedVertex[1]]);
    transformedPolygon2.push([translatedVertex[0][0], translatedVertex[1][0]]);
  }

  // Return the transformed polygon
  console.log(transformedPolygon2);
  
  polyLine(transformedPolygon2);
  return transformedPolygon;
}
//Wrong
function translatePolygonMatrix2(polygon, dx, dy, dz) {
  const translationMatrix = [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1]
  ];

  ///const homogeneousMatrix = vertices2d2Matrix(polygon);
  //console.log(homogeneousMatrix);
  
  //const translatedMatrix = matrixXVector(translationMatrix, homogeneousMatrix);
  
  let traslatedVertices = [];
 
  for (let i = 0; i < polygon[0].length; i++) {

    let column = [];
    for(var c=0; c < polygon.length; c++){
      column.push(polygon[c][i]);
    }
    console.log("polyV");
    console.log(column);
    console.log("trans");
    console.log(translationMatrix);
    
    //let traslatedVertice = matrixXVector(translationMatrix,column);
    traslatedVertice = [column[0] + dx ,column[1] + dy, column[2] + dz];
    console.log("transV");
    console.log(traslatedVertice);
    traslatedVertices.push(traslatedVertice);


  }
  console.log("tv");
  console.log(traslatedVertices);
  return transposeMatrix(traslatedVertices);
}


function rotateYPolygonMatrix(polygon, angle, pivotX, pivotY) {
  // Convert the angle to radians
  const radians = (Math.PI / 180) * angle;

const rotationMatrix = [
  [Math.cos(radians), 0, Math.sin(radians)],
  [0, 1, 0],
  [-Math.sin(radians), 0, Math.cos(radians)]
];
  let rotatedVertices = [];
  
 
  
  for (let i = 0; i < polygon[0].length; i++) {

    let column = [];
    for(var c=0; c < polygon.length; c++){
      column.push(polygon[c][i]);
    }
  
    console.log("polyC");
    console.log(column);
    console.log("rot");
    console.log(rotationMatrix);

    let rotatedVertice = matrixXVector(rotationMatrix,column);
    rotatedVertices.push(rotatedVertice);
    
    console.log("rotated");
    console.log(rotatedVertice);
    
  }
  const rotatedMatrix = transposeMatrix(rotatedVertices);
  console.log("rotatedMatrix");
  console.log(rotatedMatrix);
  //polyLine(translatedMatrix);
  //rasterize3DMatrix(rotatedMatrix);
  //rasterizePolygon(rotatedMatrix);
  return rotatedMatrix;
}

function rotateXPolygonMatrix(polygon, angle, pivotX, pivotY) {
  // Convert the angle to radians
  const radians = (Math.PI / 180) * angle;

  const rotationMatrix = [
  [1, 0, 0],
  [0, Math.cos(radians), -Math.sin(radians)],
  [0, Math.sin(radians), Math.cos(radians)]
  ];
  let rotatedVertices = [];
  for (let i = 0; i < polygon[0].length; i++) {

    let column = [];
    for(var c=0; c < polygon.length; c++){
      column.push(polygon[c][i]);
    }
  
    console.log("polyC");
    console.log(column);
    console.log("rot");
    console.log(rotationMatrix);

    let rotatedVertice = matrixXVector(rotationMatrix,column);
    rotatedVertices.push(rotatedVertice);
    
    console.log("rotated");
    console.log(rotatedVertice);
    
  }
  const rotatedMatrix = transposeMatrix(rotatedVertices);
  console.log("rotatedMatrix");
  console.log(rotatedMatrix);
  //polyLine(translatedMatrix);
  //rasterize3DMatrix(rotatedMatrix);
  //rasterizePolygon(rotatedMatrix);
  return rotatedMatrix;
}
function rotateZPolygonMatrix(polygon, angle, pivotX, pivotY) {
  // Convert the angle to radians
  const radians = (Math.PI / 180) * angle;
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);
  const rotationMatrix = [
    [cosTheta, -sinTheta, 0, 0],
    [sinTheta, cosTheta, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];

  let rotatedVertices = [];
  for (let i = 0; i < polygon[0].length; i++) {

    let column = [];
    for(var c=0; c < polygon.length; c++){
      column.push(polygon[c][i]);
    }
  
    console.log("polyC");
    console.log(column);
    console.log("rot");
    console.log(rotationMatrix);

    let rotatedVertice = matrixXVector(rotationMatrix,column);
    rotatedVertices.push(rotatedVertice);
    
    console.log("rotated");
    console.log(rotatedVertice);
    
  }
  const rotatedMatrix = transposeMatrix(rotatedVertices);
  console.log("rotatedMatrix");
  console.log(rotatedMatrix);
  //polyLine(translatedMatrix);
  //rasterize3DMatrix(rotatedMatrix);
  //rasterizePolygon(rotatedMatrix);
  return rotatedMatrix;
}

function rasterize3DMatrix(matrix) {
  console.log("call");
  
  const matrixWidth = matrix.length;
  const matrixHeight = matrix[0].length;
  const matrixDepth = matrix[0][0].length;
  console.log(matrixWidth);
  console.log(matrixHeight);
  console.log(matrixDepth);

  // Scale the 3D matrix to fit the canvas
  const scaleX = canvas.width / matrixWidth;
  const scaleY = canvas.height / matrixHeight;
  const scaleZ = Math.min(scaleX, scaleY); // Maintain aspect ratio

  for (let z = 0; z < matrixDepth; z++) {
    for (let y = 0; y < matrixHeight; y++) {
      for (let x = 0; x < matrixWidth; x++) {
        // Calculate the 2D coordinates
        const xPos = x * scaleZ;
        const yPos = y * scaleZ;

          // If the matrix value is non-zero, draw lines between neighboring points
          const nextX = (x + 1) * scaleZ;
          const nextY = y * scaleZ;
          const nextZ = z * scaleZ;

          const nextXPos = nextX * scaleZ;
          const nextYPos = nextY * scaleZ;
          const nextZPos = nextZ * scaleZ;

          // Draw lines using Bresenham's algorithm
          console.log(xPos);
          bresenham(xPos, yPos, nextXPos, nextYPos);
          bresenham(xPos, yPos, xPos, nextZPos);
          bresenham(nextXPos, yPos, nextXPos, nextZPos);
          bresenham(xPos, nextYPos, nextXPos, nextYPos);
          bresenham(xPos, nextYPos, xPos, nextZPos);
          bresenham(nextXPos, nextYPos, nextXPos, nextZPos);

          // Paint current point
          paintPixelCoords(xPos, yPos);
      
      }
    }
  }
}

function rasterizePolygon(vertices3Daux) {
  console.log("raster");

  const vertices3Dm8 = [
    
    [0, 2, 2, 0, 0, 2, 2, 0],
   
    [0, 0, 2, 2, 0, 0, 2, 2],
   
    [2, 2, 2, 2, 0, 0, 0, 0]
  ]
  const scaledPoly = scalePolygonMatrix(vertices3Dm8,10, 10, 0, 0);
  let vertices3D2 = translatePolygonMatrix2(vertices3Daux,10,10,10);
  vertices3D2 = rotateYPolygonMatrix(vertices3D2, 55, 0,0);
  vertices3D2 = rotateXPolygonMatrix(vertices3D2, 55, 0,0);

  let vertices3D= rotateYPolygonMatrix(vertices3Daux, 55, 0,0);
  vertices3D = rotateXPolygonMatrix(vertices3D,50,0,0);

  console.log("test");
  console.log(vertices3Daux);
  vertices3Daux = vertices3D;
  let vertices = vertices3Daux[0].map((_, i) => [vertices3Daux[0][i], vertices3Daux[1][i]]);

  console.log("vertices");
  console.log(vertices);
  let v1 = [];
  let v2 = [];
  //Talvez organizar a matrix orignal dessa forma: 
  let edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Front face
    [4, 5], [5, 6], [6, 7], [7, 4], // Back face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connect corresponding vertices between front and back faces
  ];
  
  const colorList = ["#8eea6d", "#4e71fb", "#3772aa", "#ee22a2", "#018453", "#123992", "#3048de", "#8b8cc0"]
  for (let i = 0; i < edges.length; i++) {
    color = colorList[i];
    // v1 = vertices[i];
    // v2 = vertices[(i + 1) % vertices.length];
    const v1 = vertices[edges[i][0]];
    const v2 = vertices[edges[i][1]];
    bresenham(Math.round(v1[0]), Math.round(v1[1]), Math.round(v2[0]), Math.round(v2[1]));
  }

  vertices = vertices3D2[0].map((_, i) => [vertices3D2[0][i], vertices3D2[1][i]]);
  const lenHalf = vertices.length/2;
  for (let i = 0; i < vertices.length/2; i++) {
    color = colorList[i];
    v1 = vertices[i];
    v2 = vertices[(i + 1) % lenHalf];
  

    bresenham(Math.round(v1[0]), Math.round(v1[1]), Math.round(v2[0]), Math.round(v2[1]));
    v1 = vertices[i + lenHalf];
    v2 = vertices[((i + 1) % lenHalf) + lenHalf];
    bresenham(Math.round(v1[0]), Math.round(v1[1]), Math.round(v2[0]), Math.round(v2[1]));
    v1 = vertices[i];
    v2 = vertices[i + lenHalf];
    bresenham(Math.round(v1[0]), Math.round(v1[1]), Math.round(v2[0]), Math.round(v2[1]));
  }

  

}
function rotatePolygonMatrix3d(polygon, angle, pivotX, pivotY) {
  // Convert the angle to radians
  const radians = (Math.PI / 180) * angle;

  // Create the rotation matrix
  const rotationMatrix = [
    [Math.cos(radians), 0, Math.sin(radians)],
    [0, 1, 0],
    [-Math.sin(radians), 0, Math.cos(radians)]
  ];

  const rotatedVertices = [];

  for (let i = 0; i < polygon.length; i++) {
    const vertex = polygon[i];
    const translatedX = vertex[0] - pivotX;
    const translatedY = vertex[1] - pivotY;
    const rotatedX = rotationMatrix[0][0] * translatedX + rotationMatrix[0][2] * translatedY + pivotX;
    const rotatedY = vertex[1];
    const rotatedZ = rotationMatrix[2][0] * translatedX + rotationMatrix[2][2] * translatedY + pivotY;
    rotatedVertices.push([rotatedX, rotatedY, rotatedZ]);
  }

  return rotatedVertices;
}
function handleMode(x, y) {
  if (mode === "paint") {
    paintPixelInsta(x, y);
  }
  if (mode === "line" || mode === "lineBegin") {
    if (mode === "line") {
      console.log("startXYplaced");
      startXY = [x, y];
      mode = "lineBegin";
      return;
    }
    if (mode === "lineBegin") {
      console.log("endXYplaced");

      endXY = [x, y];
      mode = "paint";
      bresenham(startXY[0], startXY[1], endXY[0], endXY[1]);
    }
  }
  if (mode === "circle" || mode === "circleBegin") {
    if (mode === "circle") {
      console.log("startXYplaced");
      startXY = [x, y];
      mode = "circleBegin";
      return;
    }

    if (mode === "circleBegin") {
      console.log("radiusPlaced");
      endXY = [x, y];
      var dist = Math.floor(
        Math.sqrt(
          Math.pow(startXY[0] - endXY[0], 2) +
            Math.pow(startXY[1] - endXY[1], 2)
        )
      );
      mode = "paint";
      paintCircle(startXY[0], startXY[1], dist);
    }
  }
  if (mode === "fill") {
    var color = document.getElementById("color-picker").value;
    console.log("fillBegin");
    startXY = [x, y];
    console.log(startXY[0]);
    floodFill(startXY[0], startXY[1], color);
    console.log("fillEnd");
    mode = "paint";
  }
  if (mode === "fill2") {
    var color = document.getElementById("color-picker").value;
    console.log("fillBegin");
    startXY = [x, y];
    console.log(startXY[0]);
    scanFill(startXY[0], startXY[1], color);
    console.log("fillEnd");
    mode = "paint";
  }
  if (mode === "bezier") {
    console.log("startXYplaced");
    pointsArray.push([x, y]);
    //mode = "bezierEnd";
    return;
  }
  if (mode === "polyLine") {
    console.log("startXYplaced");
    pointsArray.push([x, y]);
    //mode = "bezierEnd";
    return;
  }
}
function bresenhamMouse() {
  mode = "line";
}
function circleMouse() {
  mode = "circle";
}
function polyLineMouse() {
  mode = "polyLine";
}
function polyLineEnd() {
  console.log("array");
  console.log(pointsArray);
  polyLine(pointsArray);
  mode = "paint";
  pointsArray = [];
}
function fillMouse() {
  mode = "fill";
}
function fill2Mouse() {
  mode = "fill2";
}
function bezierCurveMouse() {
  mode = "bezier";
}
function endBezier() {
  console.log("array");
  //console.log(pointsArray);
  paintBezierCurve(pointsArray, bezierResolution);
  mode = "paint";
  pointsArray = [];
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function runSelected() {
  var algo = document.getElementById("select").value;

  //var text = algo.options[algo.selectedIndex].text;
  console.log(algo);

  var x1 = Number(document.getElementById("x1").value);
  var y1 = Number(document.getElementById("y1").value);
  var x2 = Number(document.getElementById("x2").value);
  var y2 = Number(document.getElementById("y2").value);
  var text = document.getElementById("text").value;
  //depois converter hex to rgb
  var color = document.getElementById("color-picker").value;
  switch (algo) {
    case "0":
      paintPixelCoords(x1, y1);
      break;
    case "1":
      bresenham(x1, y1, x2, y2);
      break;
    case "2":
      paintCircle(x1, y1, x2);
      break;
    case "3":
    case "4":
    case "5":
    case "6":
      floodFill(x1, y1, color);
      break;
    case "7":
      scanFill(x1, y1, color);
      break;
    case "8":
  }
}
requestAnimationFrame(processPixelQueue);


// Example usage:
//Examples:
//paintPixelCoords(0,0);
//bresenham(10,10,20,20);
//paintCircle(10,10,15);
//boundFill(10,10,"rgb(200, 0, 0)", "rgb(0, 0, 0)");
//floodFill(10,10,"rgb(200, 0, 0)", "rgb(0, 0, 0)"); <-- muito lento kkkk
//stackFill(10,10,"rgb(200, 0, 0)", "rgb(0, 0, 0)");
//floodFill2(10,10,"rgb(200, 0, 0)");
//polyLine([[15,5],[65,5],[65,55]]);
//translatePolygon([[15,5],[65,5],[65,55]],5,5);
//translatePolygonMatrix([[15,5],[65,5],[65,55]],5,5);
//rotatePolygon([[15,5],[65,5],[65,55]],90,15,5);
//scalePolygon([[15,5],[65,5],[65,55]],10,10,15,5);
//paintBezierCurve([[50, 100],[200, 50],[300, 150],[450, 100]], 100);
//paintBezierCurve([[10, 20],[40, 10],[60, 30],[90, 20]], 100);

// let vertices3Daux= [
    
//   [0, 10, 10, 0, 0, 10, 10, 0],
 
//   [0, 0, 10, 10, 0, 0, 10, 10],
 
//   [0, 0, 0, 0, 10, 10, 10, 10]
// ];
//rasterizePolygon(vertices3Daux);
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// let coord = { x: 0, y: 0 };

// document.addEventListener("mousedown", start);
// document.addEventListener("mouseup", stop);
// window.addEventListener("resize", resize);

// resize();

// function resize() {
//   ctx.canvas.width = window.innerWidth;
//   ctx.canvas.height = window.innerHeight;
// }
// function reposition(event) {
//   coord.x = event.clientX - canvas.offsetLeft;
//   coord.y = event.clientY - canvas.offsetTop;
// }
// function start(event) {
//   document.addEventListener("mousemove", draw);
//   reposition(event);
// }
// function stop() {
//   document.removeEventListener("mousemove", draw);
// }
// function draw(event) {
//   ctx.beginPath();
//   ctx.lineWidth = 5;
//   ctx.lineCap = "round";
//   ctx.strokeStyle = "#ACD3ED";
//   ctx.moveTo(coord.x, coord.y);
//   reposition(event);
//   ctx.lineTo(coord.x, coord.y);
//   ctx.stroke();
// }