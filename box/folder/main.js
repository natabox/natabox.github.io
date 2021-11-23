import File, {
    types,
    visualizable,
    docs
} from '../file.js'

import Folder from '../folder.js'

(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com']
    const url = urls[1]
    let filesContainer = document.querySelector('.files')
    let foldersContainer = document.querySelector('.folders')

    const downloading = document.querySelector('.downloading')

    const files = []
    const folders = []

    const pathEl = document.querySelector('.path')
    const backBtn = pathEl.children[0]

    let selectedIndex
    let selectedElement

    let selectedFolderIndex
    let selectedFolderElement

    let path = '/'

    backBtn.onclick = () => {
        if (path == '/') return
        filesContainer.innerHTML = ''
        foldersContainer.innerHTML = ''
        const spinner = document.createElement('div')
        spinner.className = 'loading'
        foldersContainer.appendChild(spinner)
        let rem = 0
        for (let i = path.length - 2; i >= 0; i--) {
            if (path.charAt(i) == '/') {
                rem = i
                break
            }
        }
        path = path.substring(0, rem + 1)
        let pathTxt = pathEl.children[1].innerText
        rem = 0
        for (let i = pathTxt.length - 2; i >= 0; i--) {
            if (pathTxt.charAt(i) == '/') {
                rem = i
                break
            }
        }
        pathEl.children[1].innerText = pathTxt.substring(0, rem + 1)
        getFiles()
    }


    function renderAll() {
        filesContainer.innerHTML = ''
        foldersContainer.innerHTML = ''
        sort()
        files.forEach(e => {
            e.render(filesContainer, true)
        })
        folders.forEach(e => {
            e.render(foldersContainer)
        })
        updateClicks()
    }

    function sort() {
        files.sort((a, b) => {
            let aname = a.name.toLowerCase()
            let bname = b.name.toLowerCase()
            if (aname > bname) {
                return 1
            }
            if (aname < bname) {
                return -1
            }
            return 0
        })
        folders.sort((a, b) => {
            let aname = a.name.toLowerCase()
            let bname = b.name.toLowerCase()
            if (aname > bname) {
                return 1
            }
            if (aname < bname) {
                return -1
            }
            return 0
        })
    }

    function getFiles() {
        const loading = document.createElement('div')
        loading.className = 'loading'
        filesContainer.innerHTML = ''
        foldersContainer.innerHTML = ''
        foldersContainer.appendChild(loading)
        const param = window.location.href.split('?=')[1].replaceAll('/', '')
        let loaded = false
        const pathArr = path.split('/')
        fetch(path == '/' ? `${url}/folder/public/param/${param}` : `${url}/folder/public/id/${pathArr[pathArr.length - 2]}`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(res => {
                folders.length = 0
                res.forEach(e => {
                    folders.push(new Folder(e.id, e.name))
                })
                if (loaded) renderAll()
                loaded = true
            })
            .catch(err => {
                loading.remove()
                console.error(err)
                // alert('Pasta não encontrada')
            })

        fetch(path == '/' ? `${url}/folder/files/public/param/${param}` : `${url}/folder/files/public/id/${pathArr[pathArr.length - 2]}`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(res => {
                files.length = 0
                res.forEach(e => {
                    const time = e.date.split(" ")[1]
                    const date = e.date.split(" ")[0]

                    const h = time.split(":")[0]
                    const m = time.split(":")[1]
                    const s = time.split(":")[2]

                    const d = date.split("/")[0]
                    const mo = date.split("/")[1]
                    const y = date.split("/")[2]

                    const jsDate = new Date(y, String(parseInt(mo) - 1), d, h, m, s)

                    files.push(new File(e.id, e.name, e.type, (parseFloat(e.size) / 1024).toFixed(2) + ' KB', jsDate, e.path, e.categoryId, e.folderid, '../assets/img/types/'))
                })
                if (loaded) renderAll()
                loaded = true
            })
            .catch(err => {
                console.error(err)
            })
    }

    function updateClicks() {
        filesContainer = document.querySelector('.files')
        foldersContainer = document.querySelector('.folders')
        const fileContainers = document.querySelectorAll('.file')

        const contextMenu = document.createElement('div')
        contextMenu.className = 'context-menu'

        const visualizeBtn = document.createElement('div')
        visualizeBtn.className = 'context-menu__visualize'
        visualizeBtn.innerText = 'Visualizar'

        const downloadBtn = document.createElement('div')
        downloadBtn.className = 'context-menu__download'
        downloadBtn.innerText = 'Download'

        contextMenu.appendChild(visualizeBtn)
        contextMenu.appendChild(downloadBtn)

        document.addEventListener('click', e => {
            contextMenu.remove()
        })

        fileContainers.forEach(e => {
            e.removeAttribute('draggable')

            function createContextMenu(event) {
                event.preventDefault()
                contextMenu.remove()
                selectedElement = e
                findObject()
                downloadBtn.onclick = download
                visualizeBtn.onclick = visualize
                document.body.appendChild(contextMenu)
                if (event.changedTouches == undefined)
                    contextMenu.style = `${window.innerHeight - event.clientY > contextMenu.offsetHeight ? 'top: ' + event.clientY : 'bottom: 0'}px; ${window.innerWidth - (event.clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.clientX + 10) : 'right: 0'}px;`
                else
                    contextMenu.style = `${window.innerHeight - event.changedTouches[0].clientY > contextMenu.offsetHeight ? 'top: ' + event.changedTouches[0].clientY : 'bottom: 0'}px; ${window.innerWidth - (event.changedTouches[0].clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.changedTouches[0].clientX + 10) : 'right: 0'}px;`

            }
            e.oncontextmenu = createContextMenu
            e.addEventListener('touchend', createContextMenu)

            e.ondblclick = () => {
                selectedElement = e
                findObject()
                visualize()
            }

            function download() {
                downloading.classList.add('show')
                fetch(files[selectedIndex].path)
                    .then(res => res.blob())
                    .then(blob => {
                        downloading.classList.remove('show')
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.target = '_blank'
                        link.download = files[selectedIndex].name
                        link.click()
                        showSuccess('Downloaded')
                    })
                    .catch(e => {
                        downloading.classList.remove('show')
                        showError('Tente novamente')
                    })
            }

            function visualize() {
                const backdrop = document.createElement('div')
                backdrop.className = 'backdrop'
                let el = undefined
                backdrop.onclick = (e) => {
                    if (e.target == backdrop) backdrop.remove()
                }

                if (types.img.includes(files[selectedIndex].type.toLowerCase())) {
                    const image = document.createElement('img')
                    el = document.createElement('div')
                    el.classList.add('image')
                    image.src = files[selectedIndex].path
                    el.appendChild(image)
                    if (image.width >= image.height) {
                        image.style.width = '80vmin'
                        image.style.maxWidth = '1000px'
                    } else {
                        image.style.height = '80vmin'
                        image.style.maxHeight = '1000px'
                    }
                    setTimeout(() => imgLens(image), 100)
                } else if (types.video.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('video')
                    el.src = files[selectedIndex].path
                    el.setAttribute('type', 'video/' + files[selectedIndex].type.toLowerCase())
                    el.setAttribute('controls', 'true')
                } else if (visualizable.includes(files[selectedIndex].type.toLowerCase())) {
                    if (files[selectedIndex].type == 'pdf') {
                        el = document.createElement('iframe')
                        el.src = files[selectedIndex].path
                    } else {
                        const spinner = document.createElement('div')
                        spinner.className = 'spinner'
                        el = document.createElement('div')
                        el.classList.add('text')
                        el.appendChild(spinner)
                        fetch(files[selectedIndex].path, {
                                headers: {
                                    'cache-control': 'no-cache'
                                }
                            })
                            .then(res => res.text())
                            .then(txt => {
                                el.removeChild(spinner)
                                el.innerText = txt
                            })
                            .catch(err => console.error(err))
                    }
                } else if (types.audio.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('audio')
                    el.src = files[selectedIndex].path
                    el.setAttribute('controls', 'true')
                } else if (docs.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('iframe')
                    el.src = `https://view.officeapps.live.com/op/embed.aspx?src=${files[selectedIndex].path}`
                } else {
                    el = document.createElement('div')
                    el.innerText = 'Nenhuma visualização disponível'
                    el.classList.add('empty')
                }
                el.oncontextmenu = e => {
                    e.preventDefault()
                }
                el.classList.add('visualize')
                backdrop.appendChild(el)
                document.body.appendChild(backdrop)
            }
        })
        const folderContainers = document.querySelectorAll('.folder')
        folderContainers.forEach(e => {
            e.ondblclick = () => {
                selectedFolderElement = e
                findFolder()
                updatePath()
                getFiles()
            }
            e.oncontextmenu = ev => {
                ev.preventDefault()
            }
        })
    }

    function findFolder() {
        folders.every((e, i) => {
            if (e.element == selectedFolderElement) {
                selectedFolderIndex = i
                return false
            }
            return true
        })
    }

    function findObject() {
        files.every((e, i) => {
            if (e.element == selectedElement) {
                selectedIndex = i
                return false
            }
            return true
        })
    }

    function updatePath() {
        path += folders[selectedFolderIndex].id + "/"
        let name
        folders.every((e) => {
            if (e.id == folders[selectedFolderIndex].id) {
                name = e.name
                return false
            }
            return true
        })
        pathEl.children[1].innerText += name + "/"
    }

    function createIcon(name) {
        const icon = document.createElement('ion-icon')
        icon.setAttribute('name', name)
        return icon
    }

    function showError(msg) {
        createInfo('error', 'close-circle-outline', msg)
    }

    function showSuccess(msg) {
        createInfo('success', 'checkmark-circle-outline', msg)
    }

    function createInfo(type, icon, msg) {
        downloading.classList.remove('show')
        document.querySelectorAll('.info').forEach(e => e.remove())
        const successEl = document.createElement('div')
        successEl.className = 'info ' + type
        successEl.appendChild(createIcon(icon))
        const p = document.createElement('p')
        p.innerText = msg
        successEl.appendChild(p)
        document.body.appendChild(successEl)
        document.addEventListener('click', () => {
            successEl.remove()
        })
    }

    function imgLens(img) {
        let zoom = 3
        const lens = document.createElement('div')
        lens.className = 'lens'
        lens.style.backgroundImage = `url(${img.src})`
        lens.style.backgroundRepeat = 'no-repeat'
        lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`
        const bw = 5
        let w = lens.offsetWidth / 2
        let h = lens.offsetHeight / 2
        lens.addEventListener('mousemove', move)
        img.addEventListener('mousemove', move)

        img.addEventListener('mousedown', (e) => {
            e.preventDefault()
            img.parentElement.insertBefore(lens, img)
            w = lens.offsetWidth / 2
            h = lens.offsetHeight / 2
            move(e)
            // document.body.style.overflow = 'hidden'
        })
        document.querySelector('.backdrop').addEventListener('mouseup', () => {
            try {
                img.parentElement.removeChild(lens)
            } catch (e) {}
            // document.body.style = ''
        })

        function move(e) {
            e.preventDefault()
            e.stopPropagation()
            const pos = getMousePosition(e)
            const x = clamp(pos.x, w / zoom, img.width - (w / zoom))
            const y = clamp(pos.y, h / zoom, img.height - (h / zoom))
            lens.style.left = `${x - w}px`
            lens.style.top = `${y - h}px`
            lens.style.backgroundPosition = `-${(x * zoom) - w + bw}px -${(y * zoom) - h + bw}px`
        }

        function getMousePosition(e) {
            const rect = img.getBoundingClientRect()
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }

        lens.onwheel = (e) => {
            e.preventDefault()
            if (e.deltaY < 0) {
                zoom = Math.min(10, zoom + .25)
            } else {
                zoom = Math.max(1.25, zoom - .25)
            }
            lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`
            move(e)
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }


    if (window.location.href.includes('?=')) {
        getFiles()
    } else {
        alert('Pasta não encontrada')
    }
})()