import Konva from 'konva'
import './style.css'
import {animate, scale, stagger,hover} from "motion"

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
let isDrawing = false;
console.log(polyX);
console.log(polyY);

let mouseDraw = new Konva.Line({
  id:"mouseDrawing",
  stroke: "black",
  strokeWidth:3,
  lineCap:"round",
  lineJoin:"round",
  points:[]
})

// mouse drawing logic 
stage.on("mousedown",(e)=>{
  isDrawing = true

  let pos = stage.getPointerPosition()
  if(!pos)return
  mouseDraw.points([pos.x,pos.y])
  layer.add(mouseDraw)
})
stage.on('mousemove',(e)=>{
  if(!isDrawing)return
  const pos = stage.getPointerPosition()
  if(!pos)return
  let guides = layer.getChildren().filter(
    (child): child is Konva.Line => 
    child instanceof Konva.Line && 
    child.id() != 'mouseDrawing')
  let drawingPos = snapToGuides(pos,guides)
  mouseDraw.points([...mouseDraw.points(), pos.x, pos.y])
  layer.batchDraw()
})
stage.on('mouseup',(e)=>{
  isDrawing = false
  mouseDraw = new Konva.Line({
  id:"mouseDrawing",
  stroke: "black",
  strokeWidth:3,
  lineCap:"round",
  lineJoin:"round",
  points:[]
})
})

function snapToGuides(
  mouse: { x: number; y: number },
  guides: Konva.Line[],
  threshold = 15
): { x: number; y: number } {
  let closestPoint = mouse
  let closestDistance = Infinity

  for (const guide of guides) {
    const points = guide.points()

    const a = {
      x: points[0],
      y: points[1]
    }

    const b = {
      x: points[2],
      y: points[3]
    }

    const dx = b.x - a.x
    const dy = b.y - a.y

    const t =
      ((mouse.x - a.x) * dx +
        (mouse.y - a.y) * dy) /
      (dx * dx + dy * dy)

    const point = {
      x: a.x + t * dx,
      y: a.y + t * dy
    }

    const distance = Math.hypot(
      mouse.x - point.x,
      mouse.y - point.y
    )

    if (distance < closestDistance) {
      closestDistance = distance
      closestPoint = point
    }
  }

  return closestDistance <= threshold
    ? closestPoint
    : mouse
}
// buttons animation using framer 

animate('nav li', {y: [50 ,0], opacity: [0,1]},{delay: stagger(0.2)})
hover('nav li ',(element)=>{
  let placeholder = element.querySelector('.placeholder')
  let appear = element.querySelector('.appear')
  animate(element, { width: "120px"})
  animate(placeholder, {opacity:0})
  animate(appear, {opacity:1})
  return ()=> {
    animate(element,{ width: "fit-content"})
    animate(appear, {opacity:0})
    animate(placeholder, {opacity:1,letterSpacing: "normal"})
  }
})

// buttons functionality 

let btns = document.querySelectorAll('li')
btns.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    btns.forEach((btn)=>btn.classList.remove('active'))
    btn.classList.toggle('active')
    drawActiveMode(btn.id)
  })
})

// shapes logic i guess? 
let activeMode = findActiveMode(btns)
drawActiveMode(activeMode)

function findActiveMode(btns: any[] | NodeListOf<HTMLLIElement>){
  for(const btn of btns ){
    if(btn.classList.contains('active')){
      return btn.id
    }
  }
  return undefined
}

function drawActiveMode(id:string){
  layer.destroyChildren()
  if(id === 'vp1'){
    create_add_vanshing_point_shape(layer,0,0,'red')
  }
  if(id === 'vp2'){
    create_add_vanshing_point_shape(layer,-polyX,0,'red')
    create_add_vanshing_point_shape(layer,polyX,0,'blue')
    
  }
  if(id === 'vp3'){
    create_add_vanshing_point_shape(layer,-polyX,-polyY * 2 / 3,'blue')
    create_add_vanshing_point_shape(layer,polyX,-polyY * 2 / 3,'red')
    create_add_vanshing_point_shape(layer,0,polyY,'red')
  }
  if(id === 'vp4'){
    create_add_vanshing_point_shape(layer,-polyX,0,'blue')
    create_add_vanshing_point_shape(layer,0,-polyY,'grey')
    create_add_vanshing_point_shape(layer,polyX,0,'red')
    create_add_vanshing_point_shape(layer,0,polyY,'black')
  }
}
function create_add_vanshing_point_shape(layer:Konva.Layer,xOffset:number,yOffset:number,color:string){
  for (let i = 0; i < polySides + 1; i++) {
    let angle = (360 / polySides) 
    let finalX = Math.cos(angle * i/ 180 * Math.PI) * polyRadius + polyX 
    let finalY = Math.sin(angle * i / 180 * Math.PI) * polyRadius + polyY 
    let line = new Konva.Line({
      points: [xOffset + polyX,yOffset+polyY,xOffset+ finalX,yOffset+finalY],
      stroke: color,
      strokeWidth: 1
    })
    layer.add(line)
  }
}

stage.add(layer)
layer.draw()