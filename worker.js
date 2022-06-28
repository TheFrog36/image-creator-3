let rectangle 
let canvasWidth
let canvasHeight
let inputData 
if ('function' === typeof importScripts) {
  importScripts('./rectangle-class.js');
  self.addEventListener('message', function(event){
    if(event.data.instruction === 'start'){
      inputData = event.data.inputData
      canvasHeight = event.data.canvasHeight
      canvasWidth = event.data.canvasWidth
      for(let i = 0 ; i < 100; i ++){
        rectangle = Rectangle.randomRect(canvasWidth,canvasHeight,i)
        // Calculate vertices relative to 0,0
        const pointsRelativeToZero = calculateVerticesRelativeToZeroZero(rectangle)
        // Move vertices to the center of canvas to ensure drawLineBetweenVertices doesn't yeet out of the array
        const pointsRelativeToCenter = movePointsRelativeToCenter(pointsRelativeToZero)
        // Maybe i can skip the new array part and fill? 
        let imgDataArray = new Array(canvasWidth * canvasHeight * 4)
        imgDataArray.fill(0)
        imgDataArray = putVerticesInArray(pointsRelativeToCenter, imgDataArray)
        // Writing the points between verices in the array
        imgDataArray = drawLineBetweenVertices(imgDataArray, pointsRelativeToCenter)
        // A perimeter can be described as a y and the left most x and right most x in y where the rect is defined
        let rectanglePerimeter = getRectanglePerimeterCoords(imgDataArray, pointsRelativeToCenter)
        rectanglePerimeter = traslatePerimeter(rectanglePerimeter)
        // Start the similarity checks?
        // - Get target img data
        // - For each rect, check difference
        // - Save chadRect
        // - Pass chadRect to script.js and let it draw it
        self.postMessage({rectangle: rectangle, perimeterData: rectanglePerimeter});
      }
    }
  })
  
}


function calculateVerticesRelativeToZeroZero(rectangle){ // Calcolo i vertici considerando il rettangolo a 0,0
  point1 = calculateRectVertex(rectangle, -1, 1)
  point2 = calculateRectVertex(rectangle, 1, 1)
  point3 = {Rx: point1.Rx * -1, Ry: point1.Ry * -1}  // Rispetto l'origine, il terzo e quarto punto sono speculari a 1 e 2. 
  point4 = {Rx: point2.Rx * -1, Ry: point2.Ry * -1}  // ^ cosi evito di fare ulteriori seno coseno
  return [point1, point2, point3, point4]
}

function calculateRectVertex(rectangle, xSide, ySide) {  // Side -1 || 1
  const width = rectangle.width
  const height = rectangle.height
  const rad = rectangle.rad

  //The offset of a corner in local coordinates (i.e. relative to the pivot point)
  //(which corner will depend on the coordinate reference system used in your environment)
  Ox = width / 2 * xSide
  Oy = height / 2 * ySide

  //The rotated position of this corner in world coordinates    
  let Rx = (Ox * Math.cos(rad)) - (Oy * Math.sin(rad))
  let Ry = (Ox * Math.sin(rad)) + (Oy * Math.cos(rad))
  Rx = Math.round(Rx)
  Ry = Math.round(Ry)
  return { Rx, Ry }
}

function movePointsRelativeToCenter(points){  
  let centeredPoints = []
  for (const point of points) {
    centeredPoint = {
      Rx: point.Rx + canvasWidth / 2, 
      Ry: point.Ry + canvasHeight / 2
    }
    centeredPoints.push(centeredPoint)
  }
  return centeredPoints
}

function putVerticesInArray(points, array){
  for (const point of points) {
    pos = (point.Ry * canvasWidth + point.Rx) * 4
    array[pos] = rectangle.red
    array[pos + 1] = rectangle.green
    array[pos + 2] = rectangle.blue
    array[pos + 3] = rectangle.alpha * 255
    return array
  }
}

function drawLineBetweenVertices(array, points){
  plotLine(points[0].Rx, points[0].Ry, points[1].Rx, points[1].Ry, array)
  plotLine(points[1].Rx, points[1].Ry, points[2].Rx, points[2].Ry, array)
  plotLine(points[2].Rx, points[2].Ry, points[3].Rx, points[3].Ry, array)
  plotLine(points[3].Rx, points[3].Ry, points[0].Rx, points[0].Ry, array)
  return array
}

function plotLine(x0, y0, x1, y1, array) { // Bresenham's line algorithm
  // Fast(?) since is not using Sin or Cos
  // Gets to point, and calculates each pixel between them
  dx = Math.abs(x1 - x0)
  sx = x0 < x1 ? 1 : -1
  dy = -Math.abs(y1 - y0)
  sy = y0 < y1 ? 1 : -1
  error = dx + dy
  while (true) {
    putPixel(x0, y0, array)
    if (x0 == x1 && y0 == y1) break
    e2 = 2 * error
    if (e2 >= dy) {
      if (x0 == x1) break
      error = error + dy
      x0 = x0 + sx
    }
    if (e2 <= dx) {
      if (y0 == y1) break
      error = error + dx
      y0 = y0 + sy
    }
  }
}

function putPixel(x,y, array){  // No need for colors rn tbh
  const point = (y * canvasWidth + x) * 4
  array[point] = rectangle.red
  array[point + 1] = rectangle.green
  array[point + 2] = rectangle.blue
  array[point + 3] = rectangle.alpha * 255
}

function getRectanglePerimeterCoords(array, points){
  const highestY = points[3].Ry  // Defining area to check
  const lowestY = points[1].Ry
  const leftX = points[0].Rx
  const rightX = points[2].Rx
  let perimeterData = []

  for(let y = highestY; y <= lowestY; y++){
    let firstPoint = undefined
    let secondPoint = undefined
    for(let x = leftX; x <= rightX; x++){
      const pos = (y * canvasWidth + x) * 4
      if(array[pos+ 3]  !== 0){
        firstPoint === undefined? firstPoint = x: secondPoint = x
      }
    }
    // FirstPoint is the lest most x of the perimeter, Second is the rightMost at line Y
    perimeterData.push({y: y, x: [firstPoint, secondPoint]})  
  }
  return perimeterData
  // Prendo prima i limiti esterni dei punti
}

function traslatePerimeter(array){  // Correcting perimeter coords once traslated to the rectangle real coords
  let traslatedPerimeter = []
  x = rectangle.x
  y = rectangle.y
  for (const point of array) {
    const traslatedY = point.y + y - canvasHeight/ 2  //Sottraggo canvasHeight/2 perchè i punti al momento sono centrati
    if(traslatedY > canvasHeight-1 || traslatedY < 0) continue 
    traslatedLeftX = point.x[0] + x - canvasWidth / 2
    traslatedRightX = point.x[1] + x - canvasWidth / 2
    // if the rectangle is going outside left or right, dont save the data of the outside part
    if(traslatedLeftX > canvasWidth) continue
    if(traslatedRightX < 0) continue
    if(traslatedLeftX < 0) traslatedLeftX = 0
    if(traslatedRightX > canvasWidth) traslatedRightX = canvasWidth-1
    traslatedPerimeter.push({y: traslatedY, x: [traslatedLeftX, traslatedRightX]})
  }
  return traslatedPerimeter
}

