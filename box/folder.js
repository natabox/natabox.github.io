class Folder {
    id
    name
    element
    render(el) {
        const div = document.createElement('div')
        div.className = `folder`
        const spanName = document.createElement('span')
        spanName.innerText = this.name
        div.appendChild(spanName)
        el.appendChild(div)
        this.element = div
    }
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}