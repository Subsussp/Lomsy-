import Konva from 'konva'
import './style.css'

let stage = new Konva.Stage({
  container: 'app',
  width: window.innerWidth,
  height: window.innerHeight
})

let layer = new Konva.Layer()
let hexagon = new Konva.RegularPolygon({
  x: stage.width() / 2,
  y: stage.height() / 2,
  sides: 16,
  radius: 200,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 2,
})

layer.add(hexagon)
stage.add(layer)
layer.draw()