class Ripple {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.strokeStyle = '#9C27B0'
        context.lineWidth = this.r/12
        context.globalAlpha = 1
        context.beginPath()
        context.arc(0,0,this.r,0,2*Math.PI)
        context.stroke()
        context.restore()
    }
    update() {

    }
    stopUpdating() {

    }
}
