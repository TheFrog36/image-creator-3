let rectangle 
let canvasWidth
let canvasHeight
if ('function' === typeof importScripts) {
  importScripts('./rectangle-class.js');
  self.addEventListener('message', function(event){
    if(event.data.instruction === 'start'){
      canvasHeight = event.data.canvasHeight
      canvasWidth = event.data.canvasWidth
      for(let i = 0 ; i < 1; i ++){
        rectangle = Rectangle.randomRect(canvasWidth,canvasHeight,i)
        console.log(canvasWidth, canvasHeight);
        const pointsRelativeToZero = calculateVerticesRelativeToZeroZero(rectangle)
        const pointsRelativeToCenter = movePointsRelativeToCenter(pointsRelativeToZero, rectangle.x, rectangle.y)

        
        self.postMessage(calculateVerticesRelativeToZeroZero(rectangle));
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

function movePointsRelativeToCenter(points, x, y){
  
  console.log(x,y)
  let centeredPoints = []
  for (const point of points) {
    centeredPoint = {
      Rx: point.Rx + x, 
      Ry: point.Ry + y
    }
    centeredPoints.push(centeredPoint)
  }
  return centeredPoints
}