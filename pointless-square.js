
var starttime
//square colours
var col = ['red','blue','violet','green','pink','orange','yellow','azure','darkorange']

//Box properties
var Box = function() {
    var duration = 5000 //Duartion of square travelling across screen
    var size = 50 //Square size
    var distFromTop = 200 //Distance from top of background element
    var noOfColours = 0 //Number sof colours that the square randomly cycles through

    this.getDuration = function () { return duration }
    this.getSize = function () { return size } 
    this.getDistFromTop = function () { return distFromTop}
    this.getNoOfColours = function () { return noOfColours}
   
    this.setDuration = function (newDuration) { duration = newDuration }
    this.setSize = function (newSize) { size = newSize }
    this.setDistFromTop = function (newDistFromTop) { distFromTop = newDistFromTop } 
    this.setNoOfColours = function (newNoOfColours) { noOfColours = newNoOfColours}
}

var Canvas = function() {
    this.getWidth = function () { return document.getElementsByClassName('row')[1].offsetWidth}
    this.getHeight = function () { return document.getElementsByClassName('row')[1].offsetHeight}
}

document.addEventListener('DOMContentLoaded', start)

function start () {
    var boxElement = document.getElementById('animate')
    var boxProps = new Box()
    var canvasProps = new Canvas()
    
    //Event listensers for square controllers
    buttonEventListensers('speed', function(event) {changeSpeed(event, boxProps)})
    buttonEventListensers('size', function(event) {changeSize(event, boxProps, boxElement)})
    buttonEventListensers('height', function(event) {changePosition(event, boxProps, canvasProps, 
      boxElement)})
    buttonEventListensers('colour', function() {changeColourNum(event, boxProps)})

    //Kicks off animation    
    requestAnimationFrame(function(timestamp){
        starttime = timestamp || new Date().getTime() //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
        moveit(timestamp, boxElement, canvasProps, boxProps) 
    })

}

function buttonEventListensers(buttonClass,processFunction) {
    var buttons = document.getElementsByClassName(buttonClass)
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click',processFunction)
    }  
  }

// Changes the speed of the square
function changeSpeed(event, elProp) {
  var button = event.target.innerText   
  var increment = 250

  if (button == '+') {
    boxDuration = Math.max(3000, elProp.getDuration() - increment)
  } else {
    boxDuration = Math.min(9000, elProp.getDuration() + increment)  
  } 
  
  elProp.setDuration(boxDuration)  
}

//Changes the size of the square
function changeSize(event, elProp, el) {
  var button = event.target.innerText   
  var increment = 2
  var boxSize = elProp.getSize()
  if (button == '+') {
    boxSize = Math.min(70, boxSize + increment)
  } else {
    boxSize = Math.max(20,boxSize - increment)  
  }    
  elProp.setSize(boxSize) 
  el.style.width = boxSize + 'px'
  el.style.height = boxSize + 'px'
  //console.log('Click : ')  
}

//Chnages te vertical position of the square
function changePosition(event, elProp, backProp, el) {
  var button = event.target.innerText   
  var increment = backProp.getHeight()/20
  var boxDistFromTop = elProp.getDistFromTop()
  if (button == '+') {
    boxDistFromTop = Math.min(backProp.getHeight() - elProp.getSize(), boxDistFromTop + increment)
  } else {
    boxDistFromTop = Math.max(0,boxDistFromTop - increment)  
  }    
  elProp.setDistFromTop(boxDistFromTop) 
  el.style.top = boxDistFromTop + 'px'
  //console.log('Click : ')  
}

//Changes the number of colours the screen randomly cycles through
function changeColourNum(event, elProp) {
    var button = event.target.innerText 
    var numColours = elProp.getNoOfColours() 

    button == '+' ? Math.min(col.length, numColours ++) : 
                    Math.max(0, numColours --) 
    elProp.setNoOfColours(numColours)
  }

function changeColour(numColours, el) {
    el.style.backgroundColor = col[Math.floor(Math.random()*numColours)]
}


// Generalerised (sort off) request animation blue print from http://www.javascriptkit.com/javatutors/requestanimationframe.shtml

function move(timestamp, element, duration, animate, endanimation) {
    //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:
    var timestamp = timestamp || new Date().getTime()
    var runtime = timestamp - starttime
    var progress = runtime / duration

    progress = Math.min(progress, 1)
    animate(progress)

    if (runtime < duration){ // if duration not met yet
        requestAnimationFrame(function(timestamp){ // call requestAnimationFrame again with parameters
            move(timestamp, element, duration, animate, endanimation)
        }) 
    } 
    else {
        requestAnimationFrame(function(timestamp){
            starttime = timestamp || new Date().getTime() //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
            endanimation(timestamp)
        })    
    }
}

//Moves square across the screen
function moveit(timestamp, element, canProp, elProp) {

  var duration = elProp.getDuration()
  var distance = canProp.getWidth() - elProp.getSize()
    
  move(timestamp, element, duration, 
    function(progress) {
      element.style.left = (distance * progress).toFixed(2) + 'px'
      changeColour(elProp.getNoOfColours(),element) 
    }, 
    function (timestamp) { transout( timestamp, element, canProp, elProp) }
  )
}

//Moves square out of screen
function transout(timestamp, element, canProp, elProp) {

  var delta, x, y
  var size = elProp.getSize()
  var startpos = canProp.getWidth() - size
  var duration = elProp.getDuration()*(size/startpos)
    
  move(timestamp, element, duration, 
    function(progress) {
      progress = Math.min(progress, 1)
      //Delta is the amount the square shrinks per frame as it leaves the screen
      delta = parseFloat( (size * progress).toFixed(2) )
      y = size - delta
      //Need to move the shrinking square by delta every frame as the right edge stays in the same place
      x = startpos + delta
      element.style.width = y + 'px'
      element.style.left = x +'px'
    }, 
    function (timestamp) { 
      element.style.left = 0
      transin(timestamp, element, canProp, elProp) 
    }
  )
}

//Moves square into the screen
function transin(timestamp, element, canProp, elProp) {

  var size = elProp.getSize()
  var canvasWidth = canProp.getWidth()
  var duration = elProp.getDuration()*(size/canvasWidth) 
       
  move(timestamp, element, duration, 
    function(progress) {
      var delta = parseFloat( (size * progress).toFixed(2) )
      element.style.width = delta + 'px'
    }, 
    function (timestamp) { moveit (timestamp, element, canProp, elProp) }
  )   
}


