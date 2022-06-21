let rect 
if ('function' === typeof importScripts) {
  importScripts('./rectangle-class.js');
  self.addEventListener('message', function(event){
    if(event.data === 'start'){
      for(let i = 0 ; i < 1; i ++){
        rect = Rectangle.randomRect(800,600,1)
        
        self.postMessage(rect);
      }
      
    }
  })
  
}
