(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com']
    const url = urls[0]

    const filesContainer = document.querySelector('.files')
    const filesInput = document.querySelector('input#upload')
    const filesLabel = document.querySelector('label.upload__btn')
    const searchInput = document.querySelector('input#search')
    const langsBtns = document.querySelectorAll('.lang img')
    const dropArea = document.querySelector('.drop')
    const dropAreaEl = document.querySelector('.drop-area')
    const logoutBtn = document.querySelector('.logout')
    const uploading = document.querySelector('.uploading')
    const sortSelect = document.querySelector('select[name="sort"]')
    const orderSelect = document.querySelector('select[name="order"]')
    const previewInput = document.querySelector('input[name="preview"]')
    const maxFileSize = 2048

    try {
        previewInput.checked = JSON.parse(localStorage.getItem('settings')).preview
    } catch (e) {
        previewInput.checked = true
    }

    previewInput.onchange = () => {
        localStorage.setItem('settings', JSON.stringify({
            preview: previewInput.checked
        }))
        renderAll()
    }


    let sortMethod = sortSelect.value
    let direction = parseInt(orderSelect.value)

    sortSelect.oninput = () => {
        sortMethod = sortSelect.value
        renderAll()
    }
    orderSelect.oninput = () => {
        direction = parseInt(orderSelect.value)
        renderAll()
    }

    let fileContainers = document.querySelectorAll('.file')

    logoutBtn.onclick = () => {
        localStorage.removeItem('account')
        window.location.href = window.location.href.replace('/box', '/account')
    }

    const langs = {
        usa: {
            Download: 'Download',
            Upload: 'Upload',
            Delete: 'Delete',
            Link: 'Generate link',
            Publiclink: 'This link will be public!',
            Succeslink: 'Successfully generated link',
            Generate: 'Generate',
            Copy: 'Copy',
            Category: 'Categories',
            Newcat: 'New category',
            Create: 'Create',
            Cat: 'Category',
            Color: 'Color',
            Confirmation: 'Are you sure you want to delete the file',
            Yes: 'Yes',
            Cancel: 'Cancel',
            Search: 'Search files',
            Drag: 'Drop here to upload',
            Properties: 'Properties',
            Name: 'Name',
            Type: 'Type',
            Size: 'Size',
            Date: 'Date',
            Visualize: 'No preview available',
            Visualization: 'Preview',
            Limit: `Error: Max file size exceeded (${maxFileSize}MB)`,
            Options: {
                Sort: 'Sort by',
                Order: 'Order',
                Ascending: '↑ Ascending',
                Descending: '↓ Descending',
                Preview: 'Images preview',
            },
            Week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
        brazil: {
            Download: 'Download',
            Upload: 'Upload',
            Delete: 'Excluir',
            Link: 'Gerar link',
            Publiclink: 'Este link será público!',
            Succeslink: 'Link gerado com sucesso',
            Generate: 'Gerar',
            Copy: 'Copiar',
            Category: 'Categorias',
            Newcat: 'Nova categoria',
            Create: 'Criar',
            Cat: 'Categoria',
            Color: 'Cor',
            Confirmation: 'Tem certeza que gostaria de excluir o arquivo',
            Yes: 'Sim',
            Cancel: 'Cancelar',
            Search: 'Pesquisar arquivos',
            Drag: 'Solte para fazer upload',
            Properties: 'Propriedades',
            Name: 'Nome',
            Type: 'Tipo',
            Size: 'Tamanho',
            Date: 'Data',
            Visualize: 'Nenhuma visualização disponível',
            Visualization: 'Visualizar',
            Limit: `Erro: Tamanho máximo de arquivo excedido (${maxFileSize}MB)`,
            Options: {
                Sort: 'Agrupar por',
                Order: 'Ordem',
                Ascending: '↑ Crescente',
                Descending: '↓ Decrescente',
                Preview: 'Visualização das imagens',
            },
            Week: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        },
        japan: {
            Download: 'ダウンロード',
            Upload: 'アップロード',
            Delete: '消去',
            Link: 'リンクを生成する',
            Publiclink: 'このリンクは公開されます!',
            Succeslink: '正常に生成されたリンク',
            Generate: '生成する',
            Copy: '写し',
            Category: 'カテゴリ',
            Newcat: '新しいカテゴリ',
            Create: '創造する',
            Cat: 'カテゴリ',
            Color: '色',
            Confirmation: 'このファイルを削除してもよろしいですか',
            Yes: 'はい',
            Cancel: 'キャンセル',
            Search: 'ファイル検索',
            Drag: 'ここにドロップしてアップロード',
            Properties: 'プロパティ',
            Name: '名前',
            Type: 'タイプ',
            Size: 'サイズ',
            Date: '日にち',
            Visualize: 'プレビュー不可',
            Visualization: 'プレビュー',
            Limit: `エラー: 最大ファイル サイズを超えました (${maxFileSize} MB)`,
            Options: {
                Sort: '並べ替え順',
                Order: '命令',
                Ascending: '↑ 昇順',
                Descending: '↓ 下行',
                Preview: '画像プレビュー',
            },
            Week: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        },
        russia: {
            Download: 'скачать',
            Upload: 'загрузить',
            Delete: 'удалять',
            Link: 'сгенерировать ссылку',
            Publiclink: 'эта ссылка будет общедоступной!',
            Succeslink: 'успешно сгенерированная ссылка',
            Generate: 'порождать',
            Copy: 'копировать',
            Category: 'Категории',
            Newcat: 'новая категория',
            Create: 'создавать',
            Cat: 'категория',
            Color: 'Цвет',
            Confirmation: 'Вы уверены, что хотите удалить файл',
            Yes: 'да',
            Cancel: 'Отмена',
            Search: 'искать файлы',
            Drag: 'хотите загрузить',
            Properties: 'свойства',
            Name: 'Имя',
            Type: 'тип',
            Size: 'размер',
            Date: 'Дата',
            Visualize: 'Предварительный просмотр недоступен',
            Visualization: 'Предварительный просмотр',
            Limit: `Ошибка: превышен максимальный размер файла (${maxFileSize} МБ)`,
            Options: {
                Sort: 'сортировать по',
                Order: 'порядок',
                Ascending: '↑ восходящий',
                Descending: '↓ спускающийся',
                Preview: 'предварительный просмотр изображений',
            },
            Week: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        }
    }

    let texts

    if (localStorage.getItem('lang') != undefined) {
        const currentLang = localStorage.getItem('lang')
        texts = langs[currentLang]
        langsBtns[0].parentElement.className = `lang ${currentLang}`
        filesLabel.children[0].innerText = texts.Upload
    } else {
        texts = langs.brazil
        filesLabel.children[0].innerText = texts.Upload
    }
    sortSelect.children[0].innerText = texts.Name
    sortSelect.children[1].innerText = texts.Size
    sortSelect.children[2].innerText = texts.Type
    sortSelect.children[3].innerText = texts.Date
    orderSelect.children[0].innerText = texts.Options.Ascending
    orderSelect.children[1].innerText = texts.Options.Descending
    sortSelect.parentElement.children[0].innerText = texts.Options.Sort
    orderSelect.parentElement.children[0].innerText = texts.Options.Order
    previewInput.parentElement.children[0].innerText = texts.Options.Preview
    searchInput.placeholder = texts.Search
    langsBtns.forEach(e => {
        e.onclick = () => {
            localStorage.setItem('lang', e.className)
            e.parentElement.className = `lang ${e.className}`
            texts = langs[e.className]
            searchInput.placeholder = texts.Search
            filesLabel.children[0].innerText = texts.Upload

            sortSelect.parentElement.children[0].innerText = texts.Options.Sort
            orderSelect.parentElement.children[0].innerText = texts.Options.Order

            sortSelect.children[0].innerText = texts.Name
            sortSelect.children[1].innerText = texts.Size
            sortSelect.children[2].innerText = texts.Type
            sortSelect.children[3].innerText = texts.Date

            orderSelect.children[0].innerText = texts.Options.Ascending
            orderSelect.children[1].innerText = texts.Options.Descending

            previewInput.parentElement.children[0].innerText = texts.Options.Preview
        }
    })


    let selectedElement
    let selectedIndex

    const key = 'supersecretkey17845'

    function decrypt(msg) {
        return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8)
    }


    const files = []
    const filesCategories = []

    function getCatNameById(id) {
        for (let i = 0; i < filesCategories.length; i++) {
            if (filesCategories[i].id == id) return filesCategories[i].name
        }
        return null
    }

    function getCatIdsByName(name) {
        name = name.toLowerCase()
        const ids = []
        for (let i = 0; i < filesCategories.length; i++) {
            if (filesCategories[i].name.toLowerCase().includes(name)) ids.push(filesCategories[i].id)
        }
        return ids
    }

    fetch(`${url}/category`, {
            method: 'GET',
            headers: {
                User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                Password: JSON.parse(decrypt(localStorage.getItem('account'))).password,
            }
        })
        .then(response => response.json())
        .then(res => {
            filesCategories.length = 0
            res.forEach(e => {
                filesCategories.push(e)
            })
            renderAll()
        })


    searchInput.oninput = () => render(files.filter(e => {
        return e.name.toLowerCase().includes(searchInput.value.toLowerCase()) || getCatIdsByName(searchInput.value).includes(e.catid)
    }))



    function sortBy(key) {
        files.sort((a, b) => {
            if (direction == 1) {
                if (a[key] > b[key]) {
                    return 1
                }
                if (a[key] < b[key]) {
                    return -1
                }
                return 0
            } else if (direction == -1) {
                if (a[key] < b[key]) {
                    return 1
                }
                if (a[key] > b[key]) {
                    return -1
                }
                return 0
            }
        })
    }


    searchInput.onsubmit = e => e.preventDefault()


    function renderAll() {
        const contextMenus = document.querySelectorAll('.context-menu')
        const tooltips = document.querySelectorAll('.tooltip')
        for (let i = 0; i < contextMenus.length; i++) {
            contextMenus[i].remove()
        }
        for (let i = 0; i < tooltips.length; i++) {
            tooltips[i].remove()
        }
        searchInput.value = ''
        sortBy(sortMethod)
        filesContainer.innerHTML = ''
        files.forEach(e => {
            e.render(filesContainer, previewInput.checked, filesCategories)
        })
        updateToolTips()
    }

    function render(arr) {
        filesContainer.innerHTML = ''
        arr.forEach(e => {
            e.render(filesContainer, previewInput.checked, filesCategories)
        })
        updateToolTips()
    }

    function getAllFiles() {
        const acc = JSON.parse(decrypt(localStorage.getItem('account')))
        files.length = 0
        fetch(url + '/files', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User': acc.email,
                    'Password': acc.password,
                },
            })
            .then(res => res.json())
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    const x = result[i]

                    const time = x.date.split(" ")[1]
                    const date = x.date.split(" ")[0]

                    const h = time.split(":")[0]
                    const m = time.split(":")[1]
                    const s = time.split(":")[2]

                    const d = date.split("/")[0]
                    const mo = date.split("/")[1]
                    const y = date.split("/")[2]

                    const jsDate = new Date(y, String(parseInt(mo) - 1), d, h, m, s)

                    files.push(
                        new File(x.id, x.name, x.type, (parseFloat(x.size) / 1024).toFixed(2) + ' KB', jsDate, x.path, x.categoryId)
                    )
                }
                renderAll()
            })
            .catch(err => {
                console.error('Oops, something went wrog: ', err)
            })
    }


    function updateToolTips() {
        const contextMenu = document.createElement('div')
        contextMenu.className = 'context-menu'
        contextMenu.addEventListener('contextmenu', ev => {
            ev.preventDefault()
        })

        const visualizeBtn = document.createElement('div')
        visualizeBtn.className = 'context-menu__visualize'
        visualizeBtn.innerText = texts.Visualization

        const downloadBtn = document.createElement('div')
        downloadBtn.className = 'context-menu__download'
        downloadBtn.innerText = texts.Download

        const linkBtn = document.createElement('div')
        linkBtn.className = 'context-menu__link'
        linkBtn.innerText = texts.Link

        const categoryBtn = document.createElement('div')
        categoryBtn.className = 'context-menu__category'
        categoryBtn.innerText = texts.Category

        const deleteBtn = document.createElement('div')
        deleteBtn.className = 'context-menu__delete'
        deleteBtn.innerText = texts.Delete

        const infoBtn = document.createElement('div')
        infoBtn.className = 'context-menu__info'
        infoBtn.innerText = texts.Properties

        contextMenu.appendChild(visualizeBtn)
        contextMenu.appendChild(downloadBtn)
        contextMenu.appendChild(linkBtn)
        contextMenu.appendChild(categoryBtn)
        contextMenu.appendChild(deleteBtn)
        contextMenu.appendChild(infoBtn)

        document.addEventListener('click', e => {
            contextMenu.remove()
        })

        fileContainers = document.querySelectorAll('.file')
        fileContainers.forEach(e => {
            const tooltip = document.createElement('div')
            tooltip.className = 'tooltip'

            function createContextMenu(event) {
                event.preventDefault()
                visualizeBtn.innerText = texts.Visualization
                downloadBtn.innerText = texts.Download
                deleteBtn.innerText = texts.Delete
                infoBtn.innerText = texts.Properties
                categoryBtn.innerText = texts.Category
                linkBtn.innerText = texts.Link

                selectedElement = e
                findObject()
                tooltip.remove()
                visualizeBtn.onclick = () => {
                    tooltip.remove()
                    visualize()
                }
                downloadBtn.onclick = () => {
                    tooltip.remove()
                    downloadFile()
                }
                deleteBtn.onclick = () => {
                    tooltip.remove()
                    deleteFile()
                }
                infoBtn.onclick = () => {
                    tooltip.remove()
                    showProperties()
                }
                linkBtn.onclick = () => {
                    tooltip.remove()
                    generateLink()
                }
                categoryBtn.onclick = () => {
                    tooltip.remove()
                    categories()
                }
                document.body.appendChild(contextMenu)
                if (event.changedTouches == undefined)
                    contextMenu.style = `${window.innerHeight - event.clientY > contextMenu.offsetHeight ? 'top: ' + event.clientY : 'bottom: 0'}px; ${window.innerWidth - (event.clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.clientX + 10) : 'right: 0'}px;`
                else
                    contextMenu.style = `${window.innerHeight - event.changedTouches[0].clientY > contextMenu.offsetHeight ? 'top: ' + event.changedTouches[0].clientY : 'bottom: 0'}px; ${window.innerWidth - (event.changedTouches[0].clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.changedTouches[0].clientX + 10) : 'right: 0'}px;`
            }

            function reloadCategories(show) {
                categories(show)
            }

            function categories(show) {
                const backdrop = document.createElement('div')
                const categories = document.createElement('div')
                const spinner = document.createElement('div')
                backdrop.className = 'backdrop'
                categories.className = 'categories'
                spinner.className = 'spinner'

                const closeBtn = document.createElement('button')
                closeBtn.className = 'closebtn'
                closeBtn.appendChild(createIcon('close'))
                closeBtn.onclick = () => {
                    backdrop.remove()
                }

                backdrop.onclick = (e) => {
                    if (e.target == backdrop) backdrop.remove()
                }

                categories.appendChild(spinner)
                backdrop.appendChild(categories)
                if (show == null || show == true || show == undefined) document.body.appendChild(backdrop)


                const acc = JSON.parse(decrypt(localStorage.getItem('account')))
                fetch(`${url}/category`, {
                        method: 'GET',
                        headers: {
                            User: acc.email,
                            Password: acc.password,
                        }
                    })
                    .then(response => response.json())
                    .then(res => {
                        filesCategories.length = 0

                        const span = document.createElement('span')
                        span.innerText = texts.Category

                        const add = document.createElement('div')
                        const newSpan = document.createElement('span')
                        newSpan.innerText = texts.Newcat
                        add.className = 'category add'
                        add.appendChild(createIcon('add-circle-outline'))
                        add.appendChild(newSpan)

                        spinner.remove()

                        categories.appendChild(span)
                        categories.appendChild(add)

                        add.onclick = () => {
                            const newCat = document.createElement('div')
                            newCat.className = 'backdrop'

                            newCat.onclick = (e) => {
                                if (e.target == newCat) newCat.remove()
                            }

                            const create = document.createElement('div')
                            create.className = 'create-category'

                            const newCatSpan = document.createElement('span')
                            newCatSpan.innerText = texts.Newcat

                            const form = document.createElement('form')


                            const nameLabel = document.createElement('label')
                            nameLabel.setAttribute('for', 'name')
                            const nameSpan = document.createElement('span')
                            nameSpan.innerText = texts.Name
                            const nameInput = document.createElement('input')
                            nameInput.type = 'text'
                            nameInput.placeholder = texts.Name
                            nameInput.id = 'name'
                            nameInput.required = true

                            const colorLabel = document.createElement('label')
                            colorLabel.setAttribute('for', 'color')
                            const colorSpan = document.createElement('span')
                            colorSpan.innerText = texts.Color
                            const colorInput = document.createElement('input')
                            colorInput.type = 'color'
                            colorInput.placeholder = 'color'
                            colorInput.id = 'color'

                            const submit = document.createElement('input')
                            submit.type = 'submit'
                            submit.id = 'sub'
                            submit.value = texts.Create

                            form.onsubmit = e => {
                                e.preventDefault()
                                const catName = nameInput.value
                                const catColor = colorInput.value
                                const spin = document.createElement('div')
                                spin.className = 'spinner'
                                form.remove()
                                create.appendChild(spin)
                                const acc = JSON.parse(decrypt(localStorage.getItem('account')))
                                fetch(`${url}/category`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            User: acc.email,
                                            Password: acc.password,
                                        },
                                        body: JSON.stringify({
                                            name: catName,
                                            color: catColor,
                                        })
                                    })
                                    .then((e) => e.json())
                                    .then(result => {
                                        newCat.remove()
                                        reloadCategories()
                                    })
                            }

                            nameLabel.appendChild(nameSpan)
                            nameLabel.appendChild(nameInput)
                            colorLabel.appendChild(colorSpan)
                            colorLabel.appendChild(colorInput)
                            form.appendChild(nameLabel)
                            form.appendChild(colorLabel)
                            form.appendChild(submit)

                            create.appendChild(newCatSpan)
                            create.appendChild(form)

                            newCat.appendChild(create)

                            backdrop.remove()
                            document.body.appendChild(newCat)
                        }

                        res.forEach(e => {
                            filesCategories.push(e)
                            const cat = document.createElement('div')
                            const color = document.createElement('div')
                            const name = document.createElement('div')
                            const deleteBtn = document.createElement('div')
                            deleteBtn.className = 'delete'
                            name.className = 'name'
                            color.className = 'color'
                            cat.className = 'category'

                            cat.onclick = (ev) => {
                                if (ev.target == deleteBtn) {
                                    fetch(`${url}/category/${e.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                User: acc.email,
                                                Password: acc.password,
                                            }
                                        })
                                        .then(() => {
                                            backdrop.remove()
                                            reloadCategories()
                                        })
                                        .catch((e) => {
                                            console.error(e)
                                        })
                                } else {
                                    fetch(`${url}/files/${files[selectedIndex].id}/category/${e.id}`, {
                                            method: 'PUT',
                                            headers: {
                                                User: acc.email,
                                                Password: acc.password,
                                            }
                                        })
                                        .then((res) => res.json())
                                        .then(result => {
                                            getAllFiles()
                                            backdrop.remove()
                                            reloadCategories(false)
                                        })
                                        .catch(e => {
                                            console.error(e)
                                        })
                                }
                            }

                            name.innerText = e.name

                            color.style.backgroundColor = e.color

                            deleteBtn.appendChild(createIcon('trash'))

                            cat.appendChild(color)
                            cat.appendChild(name)
                            cat.appendChild(deleteBtn)

                            categories.appendChild(cat)
                        })
                        renderAll()
                    })
            }

            function generateLink() {
                const backdrop = document.createElement('div')
                const linkEl = document.createElement('div')
                const span = document.createElement('span')
                const innerDiv = document.createElement('div')
                const spinner = document.createElement('div')
                const input = document.createElement('input')
                const button = document.createElement('button')
                const copyBtn = document.createElement('button')
                backdrop.className = 'backdrop'
                linkEl.className = 'generate-link'
                span.innerText = texts.Publiclink
                spinner.className = 'spinner'
                input.type = 'text'
                input.readOnly = 'true'
                button.innerText = texts.Generate
                copyBtn.innerText = texts.Copy

                backdrop.onclick = (e) => {
                    if (e.target == backdrop) backdrop.remove()
                }

                copyBtn.onclick = () => {
                    input.focus()
                    input.select()
                    document.execCommand('copy')
                }

                button.onclick = () => {
                    button.remove()
                    innerDiv.appendChild(spinner)
                    const acc = JSON.parse(decrypt(localStorage.getItem('account')))
                    fetch(`${url}/link/${files[selectedIndex].id}`, {
                            method: 'POST',
                            headers: {
                                User: acc.email,
                                Password: acc.password,
                            },
                        })
                        .then(response => response.json())
                        .then(res => {
                            const href = window.location.href
                            spinner.remove()
                            span.innerText = texts.Succeslink
                            input.value = `${href.split('/box')[0]}/box/file/?=${res.param}`
                            innerDiv.appendChild(input)
                            innerDiv.appendChild(copyBtn)
                        }).catch(err => {
                            console.error('Error: ' + err)
                        })
                }

                const closeBtn = document.createElement('button')
                closeBtn.className = 'closebtn'
                closeBtn.appendChild(createIcon('close'))
                closeBtn.onclick = () => {
                    backdrop.remove()
                }

                innerDiv.appendChild(button)
                linkEl.appendChild(span)
                linkEl.appendChild(innerDiv)
                linkEl.appendChild(closeBtn)
                backdrop.appendChild(linkEl)
                document.body.appendChild(backdrop)
            }

            function visualize() {
                selectedElement = e
                findObject()
                const backdrop = document.createElement('div')
                backdrop.className = 'backdrop'
                let el = undefined
                backdrop.onclick = (e) => {
                    if (e.target == backdrop) backdrop.remove()
                }

                if (imgTypes.includes(files[selectedIndex].type)) {
                    el = document.createElement('img')
                    el.src = files[selectedIndex].path
                } else if (videoTypes.includes(files[selectedIndex].type)) {
                    el = document.createElement('video')
                    el.src = files[selectedIndex].path
                    el.setAttribute('type', 'video/' + files[selectedIndex].type)
                    el.setAttribute('controls', 'true')
                } else if (files[selectedIndex].type == 'pdf' || files[selectedIndex].type == 'txt') {
                    el = document.createElement('iframe')
                    el.src = files[selectedIndex].path
                } else if (audioTypes.includes(files[selectedIndex].type)) {
                    el = document.createElement('audio')
                    el.src = files[selectedIndex].path
                    el.setAttribute('controls', 'true')
                } else {
                    el = document.createElement('div')
                    el.innerText = texts.Visualize
                    el.classList.add('empty')
                }
                el.oncontextmenu = e => {
                    e.preventDefault()
                }
                el.classList.add('visualize')
                backdrop.appendChild(el)
                document.body.appendChild(backdrop)
            }

            e.addEventListener('contextmenu', createContextMenu)
            e.addEventListener('touchend', createContextMenu)
            e.addEventListener('dblclick', visualize)


            if (e.children[1].innerText.length <= 22) return
            tooltip.innerText = e.children[1].innerText
            e.children[1].addEventListener('mouseover', e => {
                tooltip.style = `${window.innerHeight - (e.clientY + 10) > tooltip.offsetHeight ? 'top: '+(e.clientY + 10)+'px' : `bottom: 0`}; ${window.innerWidth - (e.clientX + 10) > tooltip.offsetWidth ? 'left: '+(e.clientX + 10)+'px' : 'right: 0'};`

                document.body.appendChild(tooltip)
            })
            e.children[1].addEventListener('mousemove', e => {
                tooltip.style = `${window.innerHeight - (e.clientY + 10) > tooltip.offsetHeight ? 'top: '+(e.clientY + 10)+'px' : `bottom: 0`}; ${window.innerWidth - (e.clientX + 10) > tooltip.offsetWidth ? 'left: '+(e.clientX + 10)+'px' : 'right: 0'};`
            })
            e.children[1].addEventListener('mouseleave', (e) => {
                tooltip.remove()
            })
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

    function downloadFile() {
        const url = files[selectedIndex].path
        const fileName = files[selectedIndex].name
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.target = '_blank'
                link.download = fileName
                link.click()
            })
    }


    function deleteFile() {
        const backdrop = document.createElement('div')
        const confirmation = document.createElement('div')
        const paragraph = document.createElement('p')
        const buttons = document.createElement('div')
        const cancelBtn = document.createElement('button')
        const yesBtn = document.createElement('button')
        backdrop.className = 'backdrop'
        confirmation.className = 'confirm'
        buttons.className = 'btns'
        paragraph.innerText = `${texts.Confirmation} "${files[selectedIndex].name}"?`
        cancelBtn.innerText = texts.Cancel
        yesBtn.innerText = texts.Yes
        confirmation.appendChild(paragraph)
        buttons.appendChild(cancelBtn)
        buttons.appendChild(yesBtn)
        confirmation.appendChild(buttons)
        backdrop.appendChild(confirmation)
        cancelBtn.onclick = () => {
            backdrop.remove()
        }
        yesBtn.onclick = () => {
            const spinner = document.createElement('div')
            spinner.className = 'spinner'
            buttons.remove()
            paragraph.remove()
            confirmation.appendChild(spinner)
            const acc = JSON.parse(decrypt(localStorage.getItem('account')))
            fetch(`${url}/files/${files[selectedIndex].id}`, {
                method: 'DELETE',
                headers: {
                    User: acc.email,
                    Password: acc.password
                }
            }).then(() => {
                getAllFiles()
                backdrop.remove()
            })
        }
        document.body.appendChild(backdrop)
    }

    function showProperties() {
        const backdrop = document.createElement('div')
        backdrop.className = 'backdrop'

        const propertiesEl = document.createElement('div')
        propertiesEl.className = 'properties'

        backdrop.addEventListener('click', e => {
            if (e.target == backdrop) backdrop.remove()
        })

        const table = document.createElement('table')

        const props = ['Name', 'Type', 'Size', 'Date', 'Cat']

        for (let i = 0; i < props.length; i++) {
            const tr = document.createElement('tr')
            const tdName = document.createElement('td')
            tdName.innerText = texts[props[i]]
            const tdValue = document.createElement('td')
            tdValue.innerText = files[selectedIndex][props[i].toLowerCase()]
            if (props[i] == 'Name') {
                tdValue.innerText = tdValue.innerText.replace(`.${files[selectedIndex].type}`, '')
            } else if (props[i] == 'Date') {
                const curDate = files[selectedIndex].date
                tdValue.innerText = `${texts.Week[curDate.getDay()]} ${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`
            } else if (props[i] == 'Size') {
                let size = parseFloat(files[selectedIndex].size.replace(' KB', ''))
                const sizes = ['KB', 'MB', 'GB']
                let selectedSize = 0
                while (size >= 1024) {
                    if (selectedSize >= sizes.length - 1) break
                    size /= 1024
                    selectedSize++
                }
                tdValue.innerText = `${size.toFixed(2)} ${sizes[selectedSize]}`
            } else if (props[i] == 'Cat') {
                const cat = filesCategories.filter(e => {
                    return e.id == files[selectedIndex].catid
                })
                if (cat[0] == null || cat[0] == undefined) tdValue.innerText = ''
                else tdValue.innerText = cat[0].name
            }

            tr.appendChild(tdName)
            tr.appendChild(tdValue)

            table.appendChild(tr)
        }

        propertiesEl.appendChild(table)

        const closeBtn = document.createElement('button')
        closeBtn.className = 'closebtn'
        closeBtn.appendChild(createIcon('close'))
        closeBtn.onclick = () => {
            backdrop.remove()
        }
        propertiesEl.appendChild(closeBtn)

        backdrop.appendChild(propertiesEl)

        document.body.appendChild(backdrop)
    }

    filesInput.addEventListener('change', () => {
        uploadFiles(filesInput.files)
    })

    document.body.addEventListener('dragenter', dragging, false)
    document.body.addEventListener('dragover', dragging, false)

    function dragging(e) {
        e.preventDefault()
        e.stopPropagation()
        dropArea.children[0].innerText = texts.Drag
        dropArea.classList.add('show')
    }

    function notDragging(e) {
        e.preventDefault()
        e.stopPropagation()
        dropArea.classList.remove('show')
    }
    document.addEventListener('dragleave', notDragging, false)
    document.body.addEventListener('drop', (e) => {
        e.preventDefault()
        notDragging(e)
        uploadFiles(e.dataTransfer.files)
    }, false)

    function uploadFiles(recievedFiles) {
        for (let i = 0; i < recievedFiles.length; i++) {
            if (recievedFiles[i].type == '') {
                showError('Tipo de arquivo não suportado')
                return
            }
        }
        uploading.classList.add('show')
        const acc = JSON.parse(decrypt(localStorage.getItem('account')))
        const formData = new FormData()
        for (let i = 0; i < recievedFiles.length; i++) {
            formData.append(`file[]`, recievedFiles[i], recievedFiles[i].name)
        }
        fetch(url + '/files/upload', {
                method: 'POST',
                headers: {
                    User: acc.email,
                    Password: acc.password
                },
                body: formData,
            })
            .then(res => res.json())
            .then(result => {
                result.forEach(e => {
                    const time = e.date.split(" ")[1]
                    const date = e.date.split(" ")[0]

                    const h = time.split(":")[0]
                    const m = time.split(":")[1]
                    const s = time.split(":")[2]

                    const d = date.split("/")[0]
                    const mo = date.split("/")[1]
                    const y = date.split("/")[2]

                    const jsDate = new Date(y, String(parseInt(mo) - 1), d, h, m, s)

                    files.push(
                        new File(e.id, e.name, e.type, (parseFloat(e.size) / 1024).toFixed(2) + ' KB', jsDate, e.path, e.categoryId)
                    )
                })
                renderAll()
                uploading.classList.remove('show')
            })
            .catch(err => {
                console.error('Error:', err)
                uploading.classList.remove('show')
                showError(texts.Limit)
            })
    }

    function createIcon(name) {
        const icon = document.createElement('ion-icon')
        icon.setAttribute('name', name)
        return icon
    }

    function showError(msg) {
        uploading.classList.remove('show')
        const errorEl = document.createElement('div')
        errorEl.className = 'error'
        errorEl.appendChild(createIcon('close-circle-outline'))
        const p = document.createElement('p')
        p.innerText = msg
        errorEl.appendChild(p)
        document.body.appendChild(errorEl)
        document.addEventListener('click', () => {
            errorEl.remove()
        })
    }


    getAllFiles()
})()