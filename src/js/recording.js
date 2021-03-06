import {  mouseDownHandler } from "./setup/dragAndDrop"
export let RECORDING = false
let CHORD_COUNT = 1
export const DOMAIN = "http://127.0.0.1:8000"
//export const DOMAIN = "https://timbreplay-backend-zivzm7dwda-uc.a.run.app"

async function fetchAudio(x, y) {
  const requestOptions = {
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
  }
  let esc = encodeURIComponent
  return fetch(
    DOMAIN + "/generate?x=" + esc(x) + "&y=" + esc(y),
    requestOptions
  ).then((res) => {
    if (!res.ok) throw new Error(`${res.status} = ${res.statusText}`) // response.body is a readable stream.
    // Calling getReader() gives us exclusive access to
    // the stream's content
    const reader = res.body.getReader()
    // read() returns a promise that resolves
    // when a value has been received
    return reader.read().then((result) => {
      return result
    })
  })
}

export function addPoint(d3, svg, scaleX, scaleY) {
  return async function () {
    if (RECORDING) {
      const mouse = d3.mouse(this)
      const clickedX = scaleX.invert(mouse[0])
      const clickedY = scaleY.invert(mouse[1])

      const id = btoa(clickedX.toString() + clickedY.toString())

      const new_point = svg
        .append("rect")
        .attr("x", mouse[0] - 16)
        .attr("y", mouse[1] - 16)
        .attr("width", 32)
        .attr("height", 32)
        .attr("fill", "#de8a0d")
        .attr("id", "dot:" + id)

      new_point
        .transition()
        .duration(500)
        .attr("x", mouse[0] - 8)
        .attr("y", mouse[1] - 8)
        .attr("width", 16)
        .attr("height", 16)

      const url = await fetchAudio(clickedX, clickedY).then((response) => {
        new_point.transition().duration(100).attr("fill", "#0d33de")
        // response.value for fetch streams is a Uint8Array
        var blob = new Blob([response.value], { type: "audio/wav" })
        var url = window.URL.createObjectURL(blob)
        window.audio = new Audio()
        window.audio.src = url
        window.audio.play()
        return url
      })

      const container = document.querySelector("#box-record")
      const template = document.querySelector("#chord-template")

      // Clone the new row and insert it into the table
      const row = template.content.cloneNode(true)
      const playButton = row.querySelector("div.chord-play")

      const audio = new Audio()
      audio.src = url

      const title = row.querySelector("p.chord-name")
      title.innerHTML = `Chord ${CHORD_COUNT}`

      container.appendChild(row)

      const lastRow = container.querySelector(".recorded-chord:last-child")
      lastRow.id = id
      // make drag lines icon draggable https://htmldom.dev/drag-and-drop-element-in-a-list/
      const draglines=lastRow.children[0]
      draglines.addEventListener("mousedown", mouseDownHandler(id))

      lastRow.querySelector(".chord-delete").id = "delete:" + id
      playButton.appendChild(audio)
      CHORD_COUNT += 1
    }
  }
}

export function deletePoint(deleteButton) {
  let id = deleteButton.id
  id = id.replace("delete:", "")
  const fullRow = document.getElementById(id)
  fullRow.remove()
  const dot = document.getElementById('dot:'+id)
  dot.remove()
}

export function toggleRec() {
  RECORDING = !RECORDING

  const content_boxes = document.querySelectorAll("div#box-content > div")

  content_boxes.forEach((elem) => elem.classList.add("hide"))
  content_boxes[2].classList.remove("hide")

  const recording_label = document.querySelector("#recording-label")

  if (!RECORDING) {
    recording_label.classList.add("hide")
  } else {
    recording_label.classList.remove("hide")
  }
}

export function stopRec() {
  if (RECORDING) {
    toggleRec()
  }
}

window.toggleRec = toggleRec
window.deletePoint = deletePoint
window.stopRec = stopRec
