let width
let height
let targetImgColorAvg 

const targetCanvas = document.getElementById('target-canvas')
const targetCTX = targetCanvas.getContext('2d')
const outputCanvas = document.getElementById('output-canvas')
const outputCTX = outputCanvas.getContext('2d')
const inputCanvas = document.getElementById('input-canvas')
const inputCTX = inputCanvas.getContext('2d')


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
        const rect = new Rectangle()
        
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

init()