import Konva from 'konva'
import './style.css'
import {animate, stagger} from "motion"

let stage = new Konva.Stage({
  container: 'app',
  width: window.innerWidth,
  height: window.innerHeight
})
let polySides = 100
let polyX = stage.width() / 2
let polyY = stage.height() / 2
let polyRadius = 1920
let layer = new Konva.Layer()

console.log(polyX);
console.log(polyY);

animate('nav li', {y: 0},{delay: stagger(0.4)})

for (let i = 0; i < polySides + 1; i++) {
  let angle = (360 / polySides) 
  console.log(angle * i);
  let finalX = Math.cos(angle * i/ 180 * Math.PI) * polyRadius + polyX 
  let finalY = Math.sin(angle * i / 180 * Math.PI) * polyRadius + polyY 
  let line = new Konva.Line({
    points: [polyX,polyY,finalX,finalY],
    stroke: 'red',
    strokeWidth: 1
  })
  layer.add(line)
}
stage.add(layer)
layer.draw()