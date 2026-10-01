import Konva from 'konva'
import './style.css'
import { RegularPolygon } from 'konva/lib/shapes/RegularPolygon'

let stage = new Konva.Stage({
  container: 'app',
  width: window.innerWidth,
  height: window.innerHeight
})
let polySides = 16 
let polyX = stage.width() / 2
let polyY = stage.height() / 2
let layer = new Konva.Layer()
let polygon = new Konva.RegularPolygon({
  x: polyX,
  y: polyY ,
  sides: polySides,
  radius: 200,
  // fill: 'red',
  stroke: 'black',
  strokeWidth: 2,
})
console.log(polyX);
console.log(polyY);

for (let i = 0; i < polySides + 1; i++) {
  let angle = (360 / polySides) 
  console.log(angle * i);
  let finalX = Math.cos(angle * i/ 180 * Math.PI) * 200 + polyX 
  let finalY = Math.sin(angle * i / 180 * Math.PI) * 200 + polyY 
  let line = new Konva.Line({
    points: [polyX,polyY,finalX,finalY],
    stroke: 'black',
    strokeWidth: 1
  })
  layer.add(line)
}
layer.add(polygon)
stage.add(layer)
layer.draw()