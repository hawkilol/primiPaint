//Change bresenham to perma mode
//Todo optimize bresenham - get rid of the array and draw directly

var createNewCanvas = document.getElementById("createNewCanvas");
var mode = 'paint';
var startXY = 0;
var endXY = 0;
let inputWidth = 0;
let inputHeight = 0;
let pixelSize = 0;
function getWHinputs() {
   inputWidth = Number(document.getElementById("width").value);
   inputHeight = Number(document.getElementById("height").value);
   pixelSize = Number(document.getElementById("pixelSize").value);
   //console.log(inputWidth);
   //console.log(inputHeight);
   mainCreateCanvas();
}
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  

  //console.log(canvas.width)

  // Initialize grid
  const grid = [];
  let width = 0;
  let height = 0;
function mainCreateCanvas(){
  
  canvas.width = inputWidth;
  canvas.height = inputHeight;
  width = canvas.width / pixelSize;
  height = canvas.height / pixelSize;
  for (let i = 0; i < width; i++) {
    grid[i] = [];
    for (let j = 0; j < height; j++) {
      grid[i][j] = '#ffffff';
    }
  }

  // Draw grid
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      ctx.fillStyle = grid[i][j];
      ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
    }
  }

 
}
 // Paint pixel on click or drag
  let isPainting = false;
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mousemove', paintPixel);

  function startPainting(e) {
    isPainting = true;
    paintPixel(e);
  }

  function stopPainting() {
    isPainting = false;
  }

  function paintPixel(e) {
    if (!isPainting) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    paintPixelCoords(x,y);
  }

function paintPixelCoords(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const color = document.getElementById('color-picker').value;
      grid[x][y] = color;
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      handleMode(x, y);
      //console.log(grid);
    }
}

//paintArray
function paintArray(coordsArray){
  var x = 0;
  var y = 0;
  var xy = [[0,0]];
  for(let i = 0; i < coordsArray.length; i++){
      xy = coordsArray[i];
      x = xy[0];
      y = xy[1];
      //console.log(xPlot);
      paintPixelCoords(x, y);
  }
  return xy;
}
///Algos
// Bresenham / plotPixel

function plotPixel(x1, y1, x2,
								y2, dx, dy,
								decide)
	{
    let XYS = [];
    //this.XYS = []
		// pk is initial decision making parameter
		// Note:x1&y1,x2&y2, dx&dy values are interchanged
		// and passed in plotPixel function so
		// it can handle both cases when m>1 & m<1
		let pk = 2 * dy - dx;
		for (let i = 0; i <= dx; i++) {
			console.log(x1 + "," + y1);
      if(decide == 0 ){
        XYS.push([x1,y1]);
      }
      else{
        XYS.push([y1,x1]);
      }
			// checking either to decrement or increment the
			// value if we have to plot from (0,100) to
			// (100,0)
			if (x1 < x2)
				x1++;
			else
				x1--;
			if (pk < 0) {
				// decision value will decide to plot
				// either x1 or y1 in x's position
				if (decide == 0) {
					pk = pk + 2 * dy;
				}
				else
					pk = pk + 2 * dy;
			}
			else {
				if (y1 < y2)
					y1++;
				else
					y1--;
				pk = pk + 2 * dy - 2 * dx;
			}
		}
    return XYS;
	}
let coordsList = [];
//Bresenham
function bresenham(x1, y1, x2, y2){
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
      //XYS = plotPixel(x1, y1, x2, y2, dx, dy, 1);
            console.log("1");

		}
    coordsList = XYS;
    let xy = []
    let xPlot = 0;
    let yPlot = 0;
    const numbers = [1, 2, 3, 4, 5];
    const length = numbers.length;
    //console.log(length);
    // console.log(coordsList.length);
    for(let i = 0; i < coordsList.length; i++){
      xy = coordsList[i];
      xPlot = xy[0];
      yPlot = xy[1];
      //console.log(xPlot);
      paintPixelCoords(xPlot, yPlot);
    }
    return XYS;
}
//DrawCircle Polynomial
function paintCircle(x1,y1,radius){
  var x = radius;
  var y = 0;
  var radiusError = 1 - x;
  
  while (x >= y) {
    paintPixelCoords(x + x1, y + y1);
    paintPixelCoords(y + x1, x + y1);
    paintPixelCoords(-x + x1, y + y1);
    paintPixelCoords(-y + x1, x + y1);
    paintPixelCoords(-x + x1, -y + y1);
    paintPixelCoords(-y + x1, -x + y1);
    paintPixelCoords(x + x1, -y + y1);
    paintPixelCoords(y + x1, -x + y1);
    y++;
    
    if (radiusError < 0) {
        radiusError += 2 * y + 1;
    }
    else {
        x--;
        radiusError+= 2 * (y - x + 1);
    }
  }
}
//Polyline
//polyLine([10,10],[11,11],[12,12]);
function polyLine(coordsArr){
  //coordsArr = [[x1,y1],[x2,y2] ....]
  if(coordsArr.length< 3){
    return "Array < 3!  :("
  }
  var x = 0, y = 0, xyFirst = coordsArr[0], xyPrev = coordsArr[0], xyCurr = [0,0];
  
  for(var i = 1; i < coordsArr.length; i++){
    
    //x = xyPrev[0];
    //y = xyPrev[1];
    xyCurr = coordsArr[i]
    console.log("wtf");
    bresenham(xyPrev[0],xyPrev[1],xyCurr[0],xyCurr[1]);
    xyPrev = coordsArr[i];
  }
  bresenham(xyPrev[0],xyPrev[1],xyFirst[0],xyFirst[1]);
}
function handleMode(x ,y){
  if(mode === "line" || mode === "lineBegin"){
      if(mode === "line" ){
        console.log("startXYplaced");
        startXY = [x,y];
        mode = "lineBegin";
        return;
      }
      if(mode === "lineBegin"){
              console.log("endXYplaced");

        endXY = [x,y];
        mode = "paint";  
        bresenham(startXY[0], startXY[1], endXY[0], endXY[1]);
        
      }
      
      
   }
}
function bresenhamMouse(){
  
  mode = "line";
  //bresenham(0, 0, 10, 10);
  //console.log(lineX);
  //console.log(lineY);
  

  
//   lineX = ;
//   lineY = ;
}
function polyLineMouse(){
  mode = "polyLine";
}
//coordsList = bresenham(0, 0, 10, 10);

//paintPixelCoords(0, 0);



