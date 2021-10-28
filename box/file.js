const imgTypes = ['png', 'jpg', 'jpeg', 'jfif', 'ico', 'svg', 'gif']
const videoTypes = ['mp4', 'mov', 'wmv', 'avi', 'mkv', 'webp']
const audioTypes = ['m4a', 'mp3', 'wav', 'wma', 'ogg', 'aac']

class File {
    id
    name
    type
    size
    date
    path
    element
    catid
    imgTypes
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
        div.className = `file ${this.type}`
        div.setAttribute("draggable", "true")
        const img = document.createElement('div')
        img.className = 'file__img'
        if (imgTypes.includes(this.type.toLowerCase()) && renderImgs) {
            img.className = 'file__img rendered'
            img.style = `background-image: url(${this.path})`
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