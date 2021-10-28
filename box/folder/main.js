(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com']
    const url = urls[1]
    let filesContainer = document.querySelector('.files')
    let foldersContainer = document.querySelector('.folders')

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
        filesContainer.appendChild(spinner)
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
        filesContainer.appendChild(loading)
        foldersContainer.innerHTML = ''
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
                alert('Pasta não encontrada')
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

                    files.push(new File(e.id, e.name, e.type, (parseFloat(e.size) / 1024).toFixed(2) + ' KB', jsDate, e.path, e.categoryId))
                })
                if (loaded) renderAll()
                loaded = true
            })
            .catch(err => {

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
                fetch(files[selectedIndex].path)
                    .then(res => res.blob())
                    .then(blob => {
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.target = '_blank'
                        link.download = files[selectedIndex].name
                        link.click()
                    })
            }

            function visualize() {
                const backdrop = document.createElement('div')
                backdrop.className = 'backdrop'
                let el = undefined
                backdrop.onclick = (e) => {
                    if (e.target == backdrop) backdrop.remove()
                }

                if (imgTypes.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('img')
                    el.src = files[selectedIndex].path
                } else if (videoTypes.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('video')
                    el.src = files[selectedIndex].path
                    el.setAttribute('type', 'video/' + files[selectedIndex].type.toLowerCase())
                    el.setAttribute('controls', 'true')
                } else if (files[selectedIndex].type.toLowerCase() == 'pdf' || files[selectedIndex].type.toLowerCase() == 'txt') {
                    el = document.createElement('iframe')
                    el.src = files[selectedIndex].path
                } else if (audioTypes.includes(files[selectedIndex].type.toLowerCase())) {
                    el = document.createElement('audio')
                    el.src = files[selectedIndex].path
                    el.setAttribute('controls', 'true')
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


    if (window.location.href.includes('?=')) {
        getFiles()
    } else {
        alert('Pasta não encontrada')
    }
})()