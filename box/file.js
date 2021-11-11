const types = {
    img: ['png', 'jpg', 'jpeg', 'jfif', 'ico', 'svg', 'gif', 'tif', 'tiff', 'bmp'],
    video: ['mp4', 'mov', 'wmv', 'avi', 'mkv', 'webp', 'webm'],
    audio: ['m4a', 'mp3', 'wav', 'wma', 'ogg', 'aac'],
    zip: ['zip', '7z', 'rar', 'pie', 'xz', 'tar'],
    slide: ['ppt', 'pptx'],
    sheet: ['xls', 'xlsx'],
    code: [
        'md', 'markdown', 'cs', 'c', 'cpp', 'js',
        'css', 'html', 'java', 'jar', 'h', 'py',
        'json', 'php', 'bat', 'cmd', 'dos', 'jsx'
    ],
    txt: ['txt', 'bib', 'readme']
}
const visualizable = ['pdf'].concat(types.code, types.txt)
const notVisualizable = ['md', 'markdown', 'jar']
for (let i = 0; i < notVisualizable.length; i++) {
    visualizable.splice(visualizable.indexOf(notVisualizable[i]), 1)
}

class File {
    id
    name
    type
    size
    date
    path
    element
    catid
    folder
    constructor(id, name, type, size, date, path, cat, folder) {
        this.id = id
        this.name = name
        this.type = type
        this.size = size
        this.date = date
        this.path = path
        this.catid = cat
        this.folder = folder
    }
    render(el, renderImgs, categories) {
        const div = document.createElement('div')
        div.className = `file ${this.type.toLowerCase()}`
        div.setAttribute("draggable", "true")
        const img = document.createElement('div')
        img.className = 'file__img'

        function reduceImg(url, w, h) {
            return new Promise((resolve, reject) => {
                console.log(url)
                const canvas = document.createElement('canvas')
                canvas.width = w
                canvas.height = h
                const ctx = canvas.getContext('2d')
                const reimg = new Image()
                reimg.crossOrigin = 'Anonymous'
                reimg.src = url
                reimg.onload = () => {
                    try {
                        ctx.scale(w / reimg.width, h / reimg.height)
                        ctx.drawImage(reimg, 0, 0)
                        resolve(canvas.toDataURL())
                    } catch (e) {
                        reject(e)
                    }
                }
            })
        }

        function setBg(imgname) {
            img.style = `background-image: url(${document.title.includes('folder') ? '../' : ''}assets/img/types/${imgname}.png)`
        }
        if (types.img.includes(this.type.toLowerCase()) && renderImgs) {
            img.className = 'file__img rendered'
            let bgImg = new Image()
            // bgImg.crossOrigin = 'Anonymous'
            bgImg.onload = () => {
                /* reduceImg(this.path, 250, 250)
                    .then(data => {
                        //img.style = `background-image: url(${data})`
                        console.log(data)
                    }).catch(e => {
                        console.error(e)
                    }) */
                //img.style = `background-image: url(${bgImg.src})`

                img.appendChild(bgImg)
                img.classList.add('loaded')
            }
            bgImg.src = this.path
        } else if (types.video.includes(this.type.toLowerCase()) && renderImgs) {
            img.className = 'file__img rendered'
            const videoEl = document.createElement('video')
            videoEl.loop = true
            videoEl.muted = true
            videoEl.onloadeddata = () => {
                videoEl.currentTime = 0
                img.classList.add('loaded')
                img.appendChild(videoEl)
                const playCircle = document.createElement('ion-icon')
                playCircle.setAttribute('name', 'play-circle')
                img.appendChild(playCircle)
                this.element.addEventListener('mouseover', () => {
                    videoEl.currentTime = 0
                    videoEl.play()
                    videoEl.muted = true
                    videoEl.loop = true
                })
                this.element.addEventListener('mouseleave', () => {
                    videoEl.currentTime = 0
                    videoEl.pause()
                })
            }
            videoEl.src = this.path
        } else {
            let set = false
            for (const [key, value] of Object.entries(types)) {
                if (value.includes(this.type.toLowerCase())) {
                    setBg(key)
                    set = true
                    break
                }
            }
            if (!set) {
                const testImg = new Image()
                testImg.onload = () => {
                    setBg(this.type)
                }
                testImg.src = `${document.title.includes('folder') ? '../' : ''}assets/img/types/${this.type}.png`
            }
        }
        div.appendChild(img)
        const name = document.createElement('div')
        name.className = 'file__name'
        const spanName = document.createElement('span')
        spanName.innerText = this.name
        name.appendChild(spanName)
        div.appendChild(name)
        if (categories != null) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id == this.catid) {
                    div.style.borderColor = categories[i].color
                    break
                }
            }
        }

        el.appendChild(div)
        this.element = div
    }
}