const createRandomColor = () => {
    const r = Math.floor(255*Math.random())
    const g = Math.floor(255*Math.random())
    const b = Math.floor(255*Math.random())
    return `rgb(${r},${g},${b})`
}
class Ripple {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.state = new State()
        this.color = createRandomColor()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeStyle = this.color
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
        this.deg += (2*Math.PI)/40
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
    constructor() {
        this.animated = false
        this.cbs = []
    }
    addCallbackToLoop(cb) {
        this.cbs.push(cb)
    }
    start() {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                this.cbs.forEach((cb)=>{
                    cb()
                })
            },75)
        }
    }
    stop() {
        if(this.animated) {
            clearInterval(this.interval)
            this.animated = false
        }
    }
    resume() {
        if(!this.animated) {
            console.log()
            this.start()
        }
    }
}

const w = window.innerWidth,h=window.innerHeight
const n = ((document.body.offsetHeight)/h)+1
const looper = new Looper()
function createImage(y) {
    const img = document.createElement('img')
    const canvas  = document.createElement('canvas')
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
    img.style.position = 'absolute'
    img.style.top = y
    console.log(y)
    img.style.left = 0
    document.body.appendChild(img)
    looper.addCallbackToLoop(render)
    img.onmousedown = (event) => {
        console.log(event)
        ripples.push(new Ripple(event.offsetX,event.offsetY,r))
        console.log(ripples)
    }
}
var y = 0
for(var i=0;i<n;i++) {
    createImage(y)
    y += h
}
looper.start()

var i = 0
window.onkeydown = (event) => {
    if(event.keyCode == 32) {
        if(i%2 == 0) {
            looper.stop()
        }
        else {
            looper.resume()
        }
        i++
    }
}
