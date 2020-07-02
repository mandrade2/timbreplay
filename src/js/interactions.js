import { toggleRec, RECORDING } from "./recording"

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen()
  }
}

let fullscreenOn = false
document.getElementById("fullscreen-button").onclick = () => {
  console.log("click")

  if (fullscreenOn) {
    closeFullscreen()
    fullscreenOn = false
  } else {
    openFullscreen()
    fullscreenOn = true
  }
}

// https://www.w3schools.com/howto/howto_js_draggable.asp
// Make the DIV element draggable:
dragElement(document.getElementById("control-box"))

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  if (document.getElementById("drag-section")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("drag-section").onmousedown = dragMouseDown
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px"
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px"
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}

function SelectBox(elementidx) {
  const content_boxes = document.querySelectorAll("div#box-content > div")
  const box_buttons = document.querySelectorAll("div#button-container > button")

  content_boxes.forEach((elem) => elem.classList.add("hide"))
  box_buttons.forEach((elem) => elem.classList.remove("selected"))
  if (elementidx == 1) {
    content_boxes[0].classList.remove("hide")
    box_buttons[0].classList.add("selected")
  }
  if (elementidx == 2) {
    content_boxes[1].classList.remove("hide")
    box_buttons[1].classList.add("selected")
  }
  if (elementidx == 3) {
    box_buttons[2].classList.add("selected")
    if (!RECORDING){
    content_boxes[2].classList.remove("hide")
    
    }else{
      content_boxes[3].classList.remove("hide")
    }
  }
}

document.onkeyup = function (e) {
  if (e.ctrlKey && e.which == 82) {
   toggleRec()
  } 
}

window.SelectBox = SelectBox
