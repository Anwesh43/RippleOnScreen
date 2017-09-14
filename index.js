class Ripple {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeStyle = '#9C27B0'
        context.lineWidth = this.r/12
        context.globalAlpha = this.state.scale
        context.beginPath()
        context.arc(0,0,this.r*this.state.scale,0,2*Math.PI)
        context.stroke()
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopUpdating() {
        return this.state.stopUpdating()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.deg += (2*Math.PI)/30
        this.scale = Math.abs(Math.sin(this.deg))
        if(this.deg > Math.PI) {
            this.deg = 0
        }
    }
    stopUpdating() {
        return this.deg == 0
    }
}
class Looper {
    start(cb) {
        this.interval = setInterval(()=>{
            cb()
        },50)
    }
    stop() {
        clearInterval(this.interval)
    }
}
const img = document.createElement('img')
const canvas  = document.createElement('canvas')
const w = window.innerWidth,h = window.innerHeight
const r = Math.min(w,h)/5
canvas.width = w
canvas.height = h
const ripples = []
const context = canvas.getContext('2d')
const render = () => {
      context.clearRect(0,0,w,h)
      context.globalAlpha = 0
      ripples.forEach((ripple,index)=>{
          ripple.draw(context)
          ripple.update()
          if(ripple.stopUpdating()) {
              ripples.splice(index,1)
          }
      })
      img.src = canvas.toDataURL()
}
document.body.appendChild(img)
window.onmousedown = (event) => {
    ripples.push(new Ripple(event.offsetX,event.offsetY,r))
}
const looper = new Looper()
looper.start(render)
