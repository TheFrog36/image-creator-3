class Rectangle {

  fillColors() {
    this.red = Math.round(Math.random() * 255)
    this.green = Math.round(Math.random() * 255)
    this.blue = Math.round(Math.random() * 255)
    this.alpha = Math.round(Math.random() * 100) / 100
  }

  static generateRBGString(red, green, blue, alpha) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  generateCenterCoordinates(canvasWidth, canvasHeight) {
    const x = Math.random() * canvasWidth
    const y = Math.random() * canvasHeight
    this.x = Math.round(x)
    this.y = Math.round(y)
  }

  generateDimensions(canvasWidth, canvasHeight){
    // this.width = Math.round(Math.random() * 100 + 1)
    // this.height = Math.round(Math.random() * 100 + 1)
    this.width = Math.round(Math.random() * canvasWidth/2 + 1)
    this.height = Math.round(Math.random() * canvasHeight/2 + 1)
  }

  generateRotation(){
    const randomAngle = Math.random() * 90
    const rad = randomAngle * Math.PI / 180
    this.rad = Math.round(rad * 100) / 100
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

  static randomRect(canvasWidth, canvasHeight, order) {
    this.order = order
    const newRect = new Rectangle()
    newRect.fillColors()
    newRect.generateCenterCoordinates(canvasWidth, canvasHeight)
    newRect.generateDimensions(canvasWidth, canvasHeight)
    newRect.generateRotation()
    return newRect
  }

}

