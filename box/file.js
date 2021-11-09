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

        function setBg(imgname) {
            img.style = `background-image: url(${document.title.includes('folder') ? '../' : ''}assets/img/types/${imgname}.png)`
        }
        if (types.img.includes(this.type.toLowerCase()) && renderImgs) {
            img.className = 'file__img rendered'
            let bgImg = new Image()
            bgImg.onload = () => {
                img.style = `background-image: url(${bgImg.src})`
                img.classList.add('loaded')
            }
            bgImg.src = this.path
        } else if (types.video.includes(this.type.toLowerCase()) && renderImgs) {
            img.className = 'file__img rendered'
            const videoEl = document.createElement('video')
            // videoEl.setAttribute('controls', 'false')
            videoEl.setAttribute('muted', '')
            videoEl.onplay = () => {
                videoEl.pause()
                videoEl.currentTime = 0
            }
            videoEl.onloadeddata = () => {
                videoEl.currentTime = 0
                img.classList.add('loaded')
                img.appendChild(videoEl)
                const playCircle = document.createElement('ion-icon')
                playCircle.setAttribute('name', 'play-circle')
                img.appendChild(playCircle)
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
    toString() {
        return `name: '${this.name}', type: '${this.type}', path: '${this.path}', size: '${this.size}', date: '${this.date}'`
    }
}