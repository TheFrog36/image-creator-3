let width
let height
let targetImgColorAvg 
let maxRectNumber = 100
const targetCanvas = document.getElementById('target-canvas')
const targetCTX = targetCanvas.getContext('2d')
const outputCanvas = document.getElementById('output-canvas')
const outputCTX = outputCanvas.getContext('2d')
const inputCanvas = document.getElementById('input-canvas')
const inputCTX = inputCanvas.getContext('2d')
var myWorker = new Worker('worker.js');
let inputCanvasData

let counter = 0


function init() {
    base_image = new Image();
    base_image.src = './assets/images/aivazovsky.png';
    base_image.onload = () => {
        width = base_image.width
        height = base_image.height
        setCanvasSizes()  //Imposto la dimensione di tutte le canvas alle dimensioni dell'immagine
        targetCTX.drawImage(base_image, 0, 0);
        outputCTX.fillStyle = 'rgba(255, 255, 255, 1)'
        outputCTX.fillRect(0, 0, width, height)
        inputCanvasData = inputCTX.getImageData(0,0,width,height)
        myWorker.postMessage({instruction: 'start', canvasWidth: width, canvasHeight: height, inputData: inputCanvasData.data});
        myWorker.addEventListener("message", function(event) {
          // console.log(event.data)
          drawRectOnCanvas(event.data.rectangle, outputCTX)  //Prende il rettangolo restituito dal worker e lo disegna
          temparray = event.data.imgData
          inputCanvasData.data = temparray//l'array con i dati probabilmente deve essere un clamped array
          counter++
          console.log(counter);
          for (const line of event.data.perimeterData) {
            const pos = (line.y * width + line.x[0]) * 4
            inputCanvasData.data[pos] = 255
            inputCanvasData.data[pos + 3] = 255
            if(line.x[1]){
              const pos2 = (line.y * width + line.x[1]) * 4
              inputCanvasData.data[pos2] = 255
              inputCanvasData.data[pos2 + 3] = 255
            }
          }
          if(counter === 100) inputCTX.putImageData(inputCanvasData, 0, 0)
        });
    }
}

function setCanvasSizes(){
    targetCanvas.height = height
    targetCanvas.width = width
    outputCanvas.height = height
    outputCanvas.width = width
    inputCanvas.height = height
    inputCanvas.width = width
}

function calculateDifference(color1, color2) {
  dRsqr = ((color1[0] - color2[0]) / 255) ** 2
  dGsqr = ((color1[1] - color2[1]) / 255) ** 2
  dBsqr = ((color1[2] - color2[2]) / 255) ** 2
  Rmod = (color1[0] + color2[0]) / (2 * 255)
  Rcomp = (2 + Rmod) * dRsqr
  Gcomp = 4 * dGsqr
  Bcomp = (3 - Rmod) * dBsqr
  deltaC = Math.sqrt(Rcomp + Gcomp + Bcomp)
  return deltaC / 3
}

function drawRect(rectangle, outputCTX) {  //Draws the selected rectangle on the output canvas
  const colorString = rectangle.generateRBGString()
  outputCTX.save() //  Salvo la posizione e rotazione originale
  outputCTX.fillStyle = colorString
  outputCTX.translate(rectangle.x, rectangle.y)  //Sposto la canvas e la ruoto per poter disegnare il rettangolo
  outputCTX.rotate(rectangle.rad)
  outputCTX.fillRect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height)
  outputCTX.restore()  // Rimetto la canvas a posto
}

init()

function drawRect([red, green, blue, opacity, randomX, randomY, rectWidth, rectHeight, rad], canvasCTX) {
  const colorString = 'rgba(#RED, #GREEN, #BLUE, #OPACITY)'
  canvasCTX.save()
  canvasCTX.fillStyle = colorString
    .replace('#RED', red)
    .replace('#GREEN', green)
    .replace('#BLUE', blue)
    .replace('#OPACITY', opacity)
  canvasCTX.translate(randomX, randomY)
  canvasCTX.rotate(rad)
  canvasCTX.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight)
  canvasCTX.restore()
}


function drawRectOnCanvas(rectangle, canvasCTX){
  const colorString = Rectangle.generateRBGString(rectangle.red, rectangle.green, rectangle.blue, rectangle.alpha)
  canvasCTX.save()
  canvasCTX.fillStyle = colorString
  canvasCTX.translate(rectangle.x, rectangle.y)
  canvasCTX.rotate(rectangle.rad)
  canvasCTX.fillRect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height)
  canvasCTX.restore()
}

function checkIfArrayIsEmpty(array){
  let counter = 0
  for(let i = 0; i < array.length; i++) if(array[i] !== 0) counter++
  return counter
}