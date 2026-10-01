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
let layer = new Konva.Layer({
  clip:{
    x:0,
    y:0,
    width:stage.width(),
    height:stage.height()
  }
})
let drawingLayer = new Konva.Layer()
let shiftClicked = false;
let isDrawing = false;


let mouseDraw = new Konva.Line({
  id:"mouseDrawing",
  stroke: "black",
  strokeWidth:3,
  lineCap:"round",
  lineJoin:"round",
  points:[]
})
let mouseDownPos;
// mouse drawing logic 
stage.on("mousedown",(e)=>{
  isDrawing = true

  let pos = stage.getPointerPosition()
  if(!pos)return
  mouseDownPos = pos
  mouseDraw.points([pos.x,pos.y])
  drawingLayer.add(mouseDraw)
})
window.addEventListener('keydown',(key)=>{
  if(key.shiftKey){
    shiftClicked = true
  }
})
window.addEventListener('keyup',(key)=>{
  if(shiftClicked){
    shiftClicked = false
  }
})
stage.on('mousemove',(e)=>{
  if(!isDrawing)return
  const pos = stage.getPointerPosition()
  if(!pos)return
  if(shiftClicked){
    mouseDraw.points([mouseDownPos!.x,mouseDownPos!.y,pos.x,pos.y])

  }else{
    mouseDraw.points([...mouseDraw.points(), pos.x, pos.y])
  }
  drawingLayer.batchDraw()
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
  mouseDownPos = null
})

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
let mode = window.localStorage.getItem('mode')
if(mode){
  btns.forEach((btn)=>btn.id == mode ? btn.classList.add('active') : btn.classList.remove('active'))
}
btns.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    if(btn.classList.contains('active') && !btn.classList.contains("comment")){
      btn.classList.add("comment")
      animate(layer.getCanvas(), {opacity:0})
    }else{
      btns.forEach((btn)=>{btn.classList.remove('active');btn.classList.remove('comment');})
      btn.classList.toggle('active')
      window.localStorage.setItem('mode',btn.id)
      drawActiveMode(btn.id)
    }

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
stage.add(drawingLayer)
layer.draw()