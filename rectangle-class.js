class Rectangle {

  fillColors() {
    this.red = Math.round(Math.random() * 255)
    this.green = Math.round(Math.random() * 255)
    this.blue = Math.round(Math.random() * 255)
    this.alpha = Math.round(Math.random() * 100) / 100
  }

  generateRBGString() {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
  }

  generateCenterCoordinates(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
  }

  generateDimensions(){
    this.width = Math.random() * 100 + 1
    this.height = Math.random() * 100 + 1
  }

  generateRotation(){
    const randomAngle = Math.random() * 90
    this.rad = randomAngle * Math.PI / 180
  }

  generateOuterRect(x, y, rectWidth, rectHeight, rotationRad) {
    const newWidth = (rectWidth * Math.cos(rotationRad)) + (rectHeight * Math.sin(rotationRad))  //Dimensioni del rettangolo che contiene il rettangolo precedente ruotato
    const newHeight = (rectWidth * Math.sin(rotationRad)) + (rectHeight * Math.cos(rotationRad))
    const topLeftX = Math.max(x - newWidth / 2, 0)
    const topLeftY = Math.max(y - newHeight / 2, 0)
    const botRightX = Math.min(x + newWidth / 2, width)
    const botRightY = Math.min(y + newHeight / 2, height)
    const adjustedNewWidth = botRightX - topLeftX
    const adjustedNewHeight = botRightY - topLeftY
    return [Math.floor(topLeftX), Math.floor(topLeftY), Math.floor(adjustedNewWidth), Math.floor(adjustedNewHeight)]
  }

  static randomRect(canvasWidth, canvasHeight, numberRect) {
    const newRect = new Rectangle()
    newRect.fillColors()
    newRect.generateCenterCoordinates(canvasWidth, canvasHeight)
    newRect.generateDimensions()
    newRect.generateRotation()
    return newRect
  }

}

