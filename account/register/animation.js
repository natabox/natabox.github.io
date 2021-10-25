(() => {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    window.onresize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let rainDrops = []
    class rain {
        x
        y
        v
        size
        draw() {
            ctx.beginPath()
            ctx.fillStyle = "#ffffff"
            ctx.rect(this.x, this.y, this.size, this.size)
            ctx.fill()
        }
        move() {
            this.y -= this.v
            if (this.y + 20 < 0) {
                this.y = canvas.height + 10
                this.v = random(1, 4)
            }
        }
        constructor(x, y, v, size) {
            this.x = x
            this.y = y
            this.v = v
            this.size = size
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < rainDrops.length; i++) {
            rainDrops[i].draw()
            rainDrops[i].move()
        }
    }

    function start() {
        for (let i = 0; i < 25; i++) {
            rainDrops.push(new rain(random(0, canvas.width), random(0, canvas.height + random(0, 200)), random(1, 4), random(1, 3)))
        }
        setInterval(loop, 50)
    }

    function random(min, max) {
        return (Math.floor(Math.random() * (max - min)) + min)
    }
    start()
})()