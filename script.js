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
        myWorker.postMessage({instruction: 'start', canvasWidth: width, canvasHeight: height});
        myWorker.addEventListener("message", function(event) {
          // console.log(event.data)
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