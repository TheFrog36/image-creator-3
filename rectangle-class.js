class Rectangle {
    
    // constructor(width, height, centerX, centerY, rotation, outerWidth, outerHeight, red, green, blue, alpha){
    //     this.width = width
    //     this.height = height
    //     this.centerX = centerX
    //     this.centerY = centerY
    //     this.rotation = rotation
    //     this.outerWidth = outerWidth
    //     this.outerHeight = outerHeight
    //     this.red = red
    //     this.green = green
    //     this.blue = blue
    //     this.alpha = alpha
    // }

    fillColors(){
        this.red = Math.round(Math.random() * 255)
        this.green = Math.round(Math.random() * 255)
        this.blue = Math.round(Math.random() * 255)
        this.alpha = Math.round(Math.random() * 100) / 100
    }

    generateRBGString(){
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }
    
    generateCenterCoordinates(canvasWidth, canvasHeight){
        this.width = Math.random() * canvasWidth
        this.height = Math.random() * canvasHeight
    }

    generateOuterRect(){
        
    }

    static randomRect(){
      const newRect = new Rectangle()
      newRect.fillColors()



      return newRect
    }

}