import File, {
    types,
    visualizable
} from './file.js'

import Folder from './folder.js'


(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com', 'https://ec2-18-230-154-13.sa-east-1.compute.amazonaws.com:8080']
    const url = urls[1]

    const filesContainer = document.querySelector('.files')
    const foldersContainer = document.querySelector('.folders')
    const filesInput = document.querySelector('input#upload')
    const filesLabel = document.querySelector('.upload__btn')
    const searchInput = document.querySelector('input#search')
    const langsBtns = document.querySelectorAll('.lang img')
    const dropArea = document.querySelector('.drop')
    const logoutBtn = document.querySelector('.logout')
    const uploading = document.querySelector('.uploading')
    const downloading = document.querySelector('.downloading')
    const sortSelect = document.querySelector('select[name="sort"]')
    const orderSelect = document.querySelector('select[name="order"]')
    const previewInput = document.querySelector('input[name="preview"]')
    const pathEl = document.querySelector('.path')
    const backBtn = document.querySelector('.path ion-icon')
    const maxFileSize = 2048
    const newFolderBtn = document.querySelector('.createfolder')
    const dropdown = document.querySelector('.dropdown')
    const textFile = document.querySelector('.newtext')

    filesLabel.onclick = () => {
        dropdown.classList.toggle('show')
    }

    document.addEventListener('click', e => {
        if (e.target != filesLabel) {
            try {
                if (e.target.parentElement != filesLabel) {
                    try {
                        if (e.target.parentElement.parentElement != filesLabel) {
                            dropdown.classList.remove('show')
                        }
                    } catch (e) {
                        dropdown.classList.remove('show')
                    }
                }
            } catch (e) {

            }
        }
    })

    let path = "/"

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
        getAllFiles()
    }

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

    sortSelect.oninput = renderAll
    orderSelect.oninput = renderAll


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
            Rename: 'Rename',
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
            ConfirmationFolder: 'Are you sure you want to delete the folder',
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
            Newfolder: 'New folder',
            New: 'New',
            Folder: 'Folder',
            TextFile: 'Text file',
            FolderFiles: 'Delete all files from the folder to delete it',
            Try: 'Try again',
            Save: 'Save',
        },
        brazil: {
            Download: 'Download',
            Upload: 'Upload',
            Delete: 'Excluir',
            Rename: 'Renomear',
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
            ConfirmationFolder: 'Tem certeza que gostaria de excluir a pasta',
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
            Newfolder: 'Nova pasta',
            New: 'Novo',
            Folder: 'Pasta',
            TextFile: 'Arquivo de texto',
            FolderFiles: 'Apague todos os arquivos da pasta para apagá-la',
            Try: 'Tente novamente',
            Save: 'Salvar',
        },
        japan: {
            Download: 'ダウンロード',
            Upload: 'アップロード',
            Delete: '消去',
            Rename: '改名する',
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
            ConfirmationFolder: 'フォルダを削除してもよ思いますか',
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
            Newfolder: '新しいフォルダー',
            New: '新機能',
            Folder: 'フォルダ',
            TextFile: 'テキストファイル',
            FolderFiles: 'フォルダからすべてのファイルを削除して削除します',
            Try: 'もう一度やり直してください',
            Save: 'セーブ',
        },
        russia: {
            Download: 'скачать',
            Upload: 'загрузить',
            Delete: 'удалять',
            Rename: 'переименовать',
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
            ConfirmationFolder: 'Вы уверены, что хотите удалить папку',
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
            Newfolder: 'новая папка',
            New: 'Новые функции',
            Folder: 'папка',
            TextFile: 'текстовый файл',
            FolderFiles: 'Удалите все файлы из папки, чтобы удалить ее',
            Try: 'Повторить',
            Save: 'спасать',
        }
    }

    let texts

    if (localStorage.getItem('lang') != undefined) {
        texts = langs[localStorage.getItem('lang')]
        langsBtns[0].parentElement.className = `lang ${localStorage.getItem('lang')}`
    } else {
        texts = langs.brazil
    }
    filesLabel.children[1].innerText = texts.New
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
    newFolderBtn.children[1].innerText = texts.Folder
    textFile.children[1].innerText = texts.TextFile
    langsBtns.forEach(e => {
        e.onclick = () => {
            localStorage.setItem('lang', e.className)
            e.parentElement.className = `lang ${e.className}`
            texts = langs[e.className]
            searchInput.placeholder = texts.Search
            filesLabel.children[1].innerText = texts.New

            sortSelect.parentElement.children[0].innerText = texts.Options.Sort
            orderSelect.parentElement.children[0].innerText = texts.Options.Order

            sortSelect.children[0].innerText = texts.Name
            sortSelect.children[1].innerText = texts.Size
            sortSelect.children[2].innerText = texts.Type
            sortSelect.children[3].innerText = texts.Date

            orderSelect.children[0].innerText = texts.Options.Ascending
            orderSelect.children[1].innerText = texts.Options.Descending

            previewInput.parentElement.children[0].innerText = texts.Options.Preview

            newFolderBtn.children[1].innerText = texts.Folder

            filesLabel.children[1].innerText = texts.New
            filesInput.parentElement.children[1].innerText = texts.Upload

            textFile.children[1].innerText = texts.TextFile
        }
    })


    let selectedElement
    let selectedIndex

    let selectedFolderElement
    let selectedFolderIndex

    const key = 'supersecretkey17845'

    function decrypt(msg) {
        return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8)
    }


    const files = []
    const filesCategories = []
    const folders = []

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
        .then(response => {
            if (response.status == 500) throw new Error("password")
            if (response.status != 200) throw new Error("error")
            return response.json()
        })
        .then(res => {
            filesCategories.length = 0
            res.forEach(e => {
                filesCategories.push(e)
            })
            renderAll()
        })
        .catch(error => {
            if (error.message == 'password') {
                window.location.href = window.location.href.replace('/box', '/account')
                return
            }
        })


    searchInput.oninput = () => {
        render(files.filter(e => {
            return e.name.toLowerCase().includes(searchInput.value.toLowerCase()) || getCatIdsByName(searchInput.value).includes(e.catid)
        }))
        renderFolders(folders.filter(e => {
            return e.name.toLowerCase().includes(searchInput.value.toLowerCase())
        }))
    }



    function sortBy(key) {
        files.sort((a, b) => {
            let aname = a[key]
            let bname = b[key]
            if (typeof a[key] == 'string') {
                aname = a[key].toLowerCase()
                bname = b[key].toLowerCase()
            }
            if (parseInt(orderSelect.value) == 1) {
                if (aname > bname) {
                    return 1
                }
                if (aname < bname) {
                    return -1
                }
                return 0
            } else if (parseInt(orderSelect.value) == -1) {
                if (aname < bname) {
                    return 1
                }
                if (aname > bname) {
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
        sortBy(sortSelect.value)
        filesContainer.innerHTML = ''
        foldersContainer.innerHTML = ''
        files.forEach(e => {
            e.render(filesContainer, previewInput.checked, filesCategories)
        })
        folders.forEach(e => {
            e.render(foldersContainer)
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

    function renderFolders(arr) {
        foldersContainer.innerHTML = ''
        arr.forEach(e => {
            e.render(foldersContainer)
        })
        updateToolTips()
    }

    function getAllFiles() {
        const acc = JSON.parse(decrypt(localStorage.getItem('account')))
        let loaded = false
        files.length = 0
        folders.length = 0
        fetch(`${url}/files/folder/${path == "/" ? '-1' : path.split('/')[path.split('/').length - 2]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User': acc.email,
                    'Password': acc.password,
                },
            })
            .then(res => {
                if (res.status == 500) throw new Error("password")
                if (res.status != 200) throw new Error("error")
                return res.json()
            })
            .then(result => {
                for (const x of result) {
                    const time = x.date.split(" ")[1].split(":")
                    const date = x.date.split(" ")[0].split("/")
                    const jsDate = new Date(date[2], String(parseInt(date[1]) - 1), date[0], time[0], time[1], time[2])
                    files.push(
                        new File(x.id, x.name, x.type, (parseFloat(x.size) / 1024).toFixed(2) + ' KB', jsDate, x.path, x.categoryId)
                    )
                }
                if (loaded) renderAll()
                loaded = true
            })
            .catch(err => {
                if (err.message == 'password') {
                    window.location.href = window.location.href.replace('/box', '/account')
                    return
                }
            })

        fetch(`${url}/folder/${path == "/" ? '-1' : path.split('/')[path.split('/').length - 2]}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User': acc.email,
                    'Password': acc.password,
                },
            })
            .then(res => {
                if (res.status == 500) throw new Error("password")
                if (res.status != 200) throw new Error("error")
                return res.json()
            })
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    folders.push(new Folder(result[i].id, result[i].name))
                }
                folders.sort((a, b) => {
                    const aname = a.name.toLowerCase()
                    const bname = b.name.toLowerCase()
                    if (parseInt(orderSelect.value) == 1) {
                        if (aname > bname) {
                            return 1
                        }
                        if (aname < bname) {
                            return -1
                        }
                        return 0
                    } else if (parseInt(orderSelect.value) == -1) {
                        if (aname < bname) {
                            return 1
                        }
                        if (aname > bname) {
                            return -1
                        }
                        return 0
                    }
                })
                if (loaded) renderAll()
                loaded = true
            })
            .catch(error => {
                if (error.message == 'password') {
                    window.location.href = window.location.href.replace('/box', '/account')
                    return
                }
            })

    }

    textFile.onclick = () => {
        const spinner = document.createElement('div')
        spinner.className = 'spinner'

        const backdrop = document.createElement('div')
        backdrop.className = 'backdrop'
        backdrop.onclick = (e) => {
            if (e.target == backdrop) backdrop.remove()
        }

        const textEditor = document.createElement('div')
        textEditor.className = 'textEditor'

        const form = document.createElement('form')
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.placeholder = texts.Name
        nameInput.required = true

        const textArea = document.createElement('textarea')

        const btn = document.createElement('button')
        btn.innerText = texts.Upload

        form.onsubmit = (e) => {
            e.preventDefault()
            if (nameInput.value == '' || nameInput.value == ' ') nameInput.value = 'Text'
            form.remove()
            textEditor.appendChild(spinner)
            fetch(url + '/files/text/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                        Password: JSON.parse(decrypt(localStorage.getItem('account'))).password
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        text: textArea.value == '' ? ' ' : textArea.value,
                        folderid: path == "/" ? null : path.split('/')[path.split('/').length - 2]
                    })
                })
                .then(res => res.json())
                .then((r) => {
                    if (r == undefined) throw new Error("err")
                    getAllFiles()
                    backdrop.remove()
                })
                .catch(e => {
                    showError('Error')
                    backdrop.remove()
                })
        }
        form.appendChild(nameInput)
        form.appendChild(textArea)
        form.appendChild(btn)

        textEditor.appendChild(form)

        backdrop.appendChild(textEditor)

        document.body.appendChild(backdrop)

        setTimeout(() => {
            nameInput.focus()
        })
    }


    function updateToolTips() {
        const contextMenu2 = document.createElement('div')
        contextMenu2.className = 'context-menu'
        contextMenu2.addEventListener('contextmenu', ev => {
            ev.preventDefault()
        })

        const deleteBtn2 = document.createElement('div')
        deleteBtn2.className = 'context-menu__delete'
        deleteBtn2.innerText = texts.Delete

        const linkBtn2 = document.createElement('div')
        linkBtn2.className = 'context-menu__link'
        linkBtn2.innerText = texts.Link

        contextMenu2.appendChild(linkBtn2)
        contextMenu2.appendChild(deleteBtn2)


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

        const renameBtn = document.createElement('div')
        renameBtn.className = 'context-menu__rename'
        renameBtn.innerText = texts.Rename

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
        contextMenu.appendChild(renameBtn)
        contextMenu.appendChild(linkBtn)
        contextMenu.appendChild(categoryBtn)
        contextMenu.appendChild(deleteBtn)
        contextMenu.appendChild(infoBtn)

        document.addEventListener('click', e => {
            contextMenu.remove()
            contextMenu2.remove()
        })

        document.querySelectorAll('.file').forEach(e => {
            e.addEventListener('dragstart', e => {
                selectedElement = e.target
                findObject()
            })
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
                renameBtn.innerText = texts.Rename

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
                renameBtn.onclick = () => {
                    tooltip.remove()
                    rename()
                }

                document.body.appendChild(contextMenu)
                if (event.changedTouches == undefined)
                    contextMenu.style = `${window.innerHeight - event.clientY > contextMenu.offsetHeight ? 'top: ' + event.clientY : 'bottom: 0'}px; ${window.innerWidth - (event.clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.clientX + 10) : 'right: 0'}px;`
                else
                    contextMenu.style = `${window.innerHeight - event.changedTouches[0].clientY > contextMenu.offsetHeight ? 'top: ' + event.changedTouches[0].clientY : 'bottom: 0'}px; ${window.innerWidth - (event.changedTouches[0].clientX + 10) > contextMenu.offsetWidth ? 'left: ' + (event.changedTouches[0].clientX + 10) : 'right: 0'}px;`
            }

            function rename() {
                const backdrop = document.createElement('div')
                backdrop.className = 'backdrop'
                backdrop.onclick = e => {
                    if (e.target == backdrop) backdrop.remove()
                }
                const rename = document.createElement('div')
                rename.className = 'rename'
                const form = document.createElement('form')
                const input = document.createElement('input')
                input.type = 'text'
                input.value = files[selectedIndex].name.replace(`.${files[selectedIndex].type}`, '')
                const btn = document.createElement('button')
                btn.innerText = texts.Rename

                const spinner = document.createElement('div')
                spinner.className = 'spinner'
                form.onsubmit = e => {
                    e.preventDefault()
                    rename.innerHTML = ''
                    rename.appendChild(spinner)
                    fetch(`${url}/files/rename/${files[selectedIndex].id}`, {
                            method: 'PUT',
                            headers: {
                                User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                                Password: JSON.parse(decrypt(localStorage.getItem('account'))).password,
                            },
                            body: input.value.replace(`.${files[selectedIndex].type}`, '')
                        })
                        .then(response => {
                            if (response.status == 404) throw new Error("Error")
                            return response.json()
                        })
                        .then(res => {
                            getAllFiles()
                            backdrop.remove()
                        })
                        .catch(err => {
                            backdrop.remove()
                        })
                }
                form.appendChild(input)
                form.appendChild(btn)
                rename.appendChild(form)
                backdrop.appendChild(rename)
                document.body.appendChild(backdrop)
                setTimeout(() => {
                    input.focus()
                    input.select()
                })
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
                            setTimeout(() => {
                                nameLabel.focus()
                            })
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
                                    categories.innerHTML = ''
                                    categories.appendChild(spinner)
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
                    setTimeout(() => {
                        imgLens(image)
                    }, 100)
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
                        el.appendChild(spinner)
                        const saveBtn = document.createElement('button')
                        const saveBtnSpan = document.createElement('span')
                        const saveIcon = createIcon('save')
                        saveBtnSpan.innerText = texts.Save
                        saveBtn.appendChild(saveIcon)
                        saveBtn.appendChild(saveBtnSpan)
                        let mode = null
                        if (files[selectedIndex].type == 'html') mode = 'xml'
                        else if (files[selectedIndex].type == 'css') mode = 'css'
                        else if (files[selectedIndex].type == 'js') mode = 'javascript'
                        else if (files[selectedIndex].type == 'c' || files[selectedIndex].type == 'cs' || files[selectedIndex].type == 'cpp') mode = 'clike'
                        const editor = CodeMirror(el, {
                            lineNumbers: true,
                            tabSize: 4,
                            mode: mode,
                            lineWrapping: true,
                            theme: 'material-darker'
                        })
                        saveBtn.onclick = () => {
                            fetch(`${url}/files/text/${files[selectedIndex].id}`, {
                                    method: 'PUT',
                                    headers: {
                                        User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                                        Password: JSON.parse(decrypt(localStorage.getItem('account'))).password,
                                    },
                                    body: editor.getValue()
                                })
                                .catch(e => {
                                    console.error(e)
                                })
                        }
                        fetch(files[selectedIndex].path, {
                                headers: {
                                    'cache-control': 'no-cache'
                                }
                            })
                            .then(res => res.text())
                            .then(txt => {
                                el.removeChild(spinner)
                                editor.setValue(txt)
                                editor.refresh()
                                backdrop.appendChild(saveBtn)
                            })
                            .catch(err => console.error(err))
                    }
                } else if (types.audio.includes(files[selectedIndex].type.toLowerCase())) {
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
        document.querySelectorAll('.folder').forEach(e => {
            e.addEventListener('dragover', e => {
                if (e.dataTransfer.items[0] != undefined) return
                if (!e.target.classList.contains('folder')) {
                    e.target.parentElement.classList.add('drag')
                    selectedFolderElement = e.target.parentElement
                    findFolder()
                } else {
                    e.target.classList.add('drag')
                    selectedFolderElement = e.target
                    findFolder()
                }
            })
            e.addEventListener('dragleave', e => {
                if (e.dataTransfer.items[0] != undefined) return
                if (!e.target.classList.contains('folder')) {
                    e.target.parentElement.classList.remove('drag')
                    selectedFolderElement = null
                    selectedFolderIndex = null
                } else {
                    e.target.classList.remove('drag')
                    selectedFolderElement = null
                    selectedFolderIndex = null
                }
            })
            e.addEventListener('drop', e => {
                if (!e.target.classList.contains('folder')) {
                    e.target.parentElement.classList.remove('drag')
                } else {
                    e.target.classList.remove('drag')
                }
            })
            e.ondblclick = () => {
                selectedFolderElement = e
                findFolder()
                filesContainer.innerHTML = ''
                foldersContainer.innerHTML = ''
                const spinner = document.createElement('div')
                spinner.className = 'loading'
                foldersContainer.appendChild(spinner)
                updatePath()
                getAllFiles()
            }
            e.oncontextmenu = (ev) => {
                ev.preventDefault()
                selectedFolderElement = e
                findFolder()
                createContextMenu(ev)
            }

            function createContextMenu(event) {
                deleteBtn2.innerText = texts.Delete
                linkBtn2.innerText = texts.Link

                selectedFolderElement = e
                findFolder()
                deleteBtn2.onclick = deleteFolder
                linkBtn2.onclick = linkFolder

                document.body.appendChild(contextMenu2)
                if (event.changedTouches == undefined)
                    contextMenu2.style = `${window.innerHeight - event.clientY > contextMenu2.offsetHeight ? 'top: ' + event.clientY : 'bottom: 0'}px; ${window.innerWidth - (event.clientX + 10) > contextMenu2.offsetWidth ? 'left: ' + (event.clientX + 10) : 'right: 0'}px;`
                else
                    contextMenu2.style = `${window.innerHeight - event.changedTouches[0].clientY > contextMenu2.offsetHeight ? 'top: ' + event.changedTouches[0].clientY : 'bottom: 0'}px; ${window.innerWidth - (event.changedTouches[0].clientX + 10) > contextMenu2.offsetWidth ? 'left: ' + (event.changedTouches[0].clientX + 10) : 'right: 0'}px;`

            }

            function linkFolder() {
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
                    fetch(`${url}/folder/public/${folders[selectedFolderIndex].id}`, {
                            method: 'PUT',
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
                            input.value = `${href.split('/box')[0]}/box/folder/?=${res.param}`
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

    function findObject() {
        files.every((e, i) => {
            if (e.element == selectedElement) {
                selectedIndex = i
                return false
            }
            return true
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

    function downloadFile() {
        downloading.classList.add('show')
        fetch(files[selectedIndex].path)
            .then(response => response.blob())
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
                showError(texts.Try)
            })
    }

    function deleteFolder() {
        const backdrop = document.createElement('div')
        const confirmation = document.createElement('div')
        const paragraph = document.createElement('p')
        const buttons = document.createElement('div')
        const cancelBtn = document.createElement('button')
        const yesBtn = document.createElement('button')
        backdrop.className = 'backdrop'
        confirmation.className = 'confirm'
        buttons.className = 'btns'
        paragraph.innerText = `${texts.ConfirmationFolder} "${folders[selectedFolderIndex].name}"?`
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
            fetch(`${url}/folder/${folders[selectedFolderIndex].id}`, {
                    method: 'DELETE',
                    headers: {
                        User: acc.email,
                        Password: acc.password
                    }
                })
                .then((res) => {
                    backdrop.remove()
                    if (res.status == 409) throw new Error("409")
                    getAllFiles()
                })
                .catch(err => {
                    if (err.message.includes("409")) showError(texts.FolderFiles)
                })
        }
        document.body.appendChild(backdrop)
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
            const spinner2 = document.createElement('div')
            spinner2.className = 'spinner'
            files[selectedIndex].element.appendChild(spinner2)
            files[selectedIndex].element.classList.add('moving')
            backdrop.remove()
            const acc = JSON.parse(decrypt(localStorage.getItem('account')))
            fetch(`${url}/files/${files[selectedIndex].id}`, {
                method: 'DELETE',
                headers: {
                    User: acc.email,
                    Password: acc.password
                }
            }).then(() => {
                getAllFiles()
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

    document.addEventListener('dragenter', dragging, false)
    document.addEventListener('dragover', dragging, false)
    document.addEventListener('dragleave', notDragging, false)

    const dropAreaBlock = document.querySelector('.drop-area')

    dropArea.onclick = () => {
        dropArea.classList.remove('show')
        dropAreaBlock.classList.remove('active')
    }
    dropAreaBlock.onclick = dropArea.onclick

    function dragging(e) {
        e.preventDefault()
        e.stopPropagation()
        if (document.querySelector('.backdrop')) return
        if (e.dataTransfer.items[0] == undefined) return
        dropAreaBlock.classList.add('active')
        if (dropArea.children[0].innerText != texts.Drag) dropArea.children[0].innerText = texts.Drag
        dropArea.classList.add('show')
    }

    function notDragging(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.target == dropAreaBlock) {
            dropArea.classList.remove('show')
            dropAreaBlock.classList.remove('active')
        }
    }

    setTimeout(() => {
        dropAreaBlock.classList.remove('active')
        dropArea.classList.remove('show')
    }, 100)

    document.body.addEventListener('drop', (e) => {
        e.preventDefault()
        if (document.querySelector('.backdrop')) return
        if (e.dataTransfer.files.length == 0) {
            if (e.target.classList.contains('folder') || e.target.parentElement.classList.contains('folder')) {
                const spinner = document.createElement('div')
                spinner.className = 'spinner'
                files[selectedIndex].element.appendChild(spinner)
                files[selectedIndex].element.classList.add("moving")
                fetch(`${url}/files/${files[selectedIndex].id}/folder/${folders[selectedFolderIndex].id}`, {
                        method: 'PUT',
                        headers: {
                            User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                            Password: JSON.parse(decrypt(localStorage.getItem('account'))).password
                        }
                    })
                    .then(e => {
                        if (e.status == 403) throw new Error("Folder not found")
                        return e.json()
                    })
                    .then(res => {
                        getAllFiles()
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }
            return
        }
        notDragging(e)
        uploadFiles(e.dataTransfer.files)
    }, false)

    function uploadFiles(recievedFiles) {
        for (let i = 0; i < recievedFiles.length; i++) {
            if (recievedFiles[i].type == '' && recievedFiles[i].size == 0) {
                showError('Tipo de arquivo não suportado')
                return
            }
        }

        document.querySelectorAll('.info').forEach(e => e.remove())
        uploading.classList.add('show')
        const acc = JSON.parse(decrypt(localStorage.getItem('account')))
        const formData = new FormData()
        for (let i = 0; i < recievedFiles.length; i++) {
            formData.append(`file[]`, recievedFiles[i], recievedFiles[i].name)
        }
        formData.append('folder', path == "/" ? '-1' : path.split('/')[path.split('/').length - 2])
        fetch(url + '/files/upload', {
                method: 'POST',
                headers: {
                    User: acc.email,
                    Password: acc.password
                },
                body: formData,
            })
            .then(res => {
                return res.json()
            })
            .then(result => {
                for (const e of result) {
                    const time = e.date.split(" ")[1].split(":")
                    const date = e.date.split(" ")[0].split("/")
                    const jsDate = new Date(date[2], String(parseInt(date[1]) - 1), date[0], time[0], time[1], time[2])
                    files.push(
                        new File(e.id, e.name, e.type, (parseFloat(e.size) / 1024).toFixed(2) + ' KB', jsDate, e.path, e.categoryId)
                    )
                }
                renderAll()
                uploading.classList.remove('show')
                const successFileCount = result.reduce((prev, cur) => {
                    return cur != null ? prev + 1 : prev
                }, 0)
                showSuccess(`${successFileCount} ${successFileCount <= 1 ? 'file' : 'files'} uploaded!`)
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
        createInfo('error', 'close-circle-outline', msg)
    }

    function showSuccess(msg) {
        createInfo('success', 'checkmark-circle-outline', msg)
    }

    function createInfo(type, icon, msg) {
        uploading.classList.remove('show')
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


    document.addEventListener('keyup', e => {
        const backdrop = document.querySelectorAll('.backdrop')
        if (backdrop.length > 0) {
            if (e.key == 'Escape') {
                backdrop.forEach(e => {
                    e.remove()
                })
            }
            return
        }
        if ((e.key == 'n' || e.key == 'N') && e.shiftKey) {
            if (document.activeElement == searchInput) return
            e.preventDefault()
            newFolder()
        }
    })

    function newFolder() {
        let creating = false
        const backdrop = document.createElement('div')
        backdrop.className = 'backdrop'
        backdrop.onclick = e => {
            if (e.target == backdrop) backdrop.remove()
        }
        const newfolder = document.createElement('div')
        newfolder.className = 'newfolder'
        const form = document.createElement('form')
        const input = document.createElement('input')
        input.type = 'text'
        input.value = texts.Newfolder
        const btn = document.createElement('button')
        btn.innerText = texts.Newfolder

        const spinner = document.createElement('div')
        spinner.className = 'spinner'

        form.onsubmit = (e) => {
            e.preventDefault()
            if (creating) return
            creating = true
            newfolder.innerHTML = ''
            newfolder.appendChild(spinner)
            fetch(url + '/folder', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        User: JSON.parse(decrypt(localStorage.getItem('account'))).email,
                        Password: JSON.parse(decrypt(localStorage.getItem('account'))).password
                    },
                    body: JSON.stringify({
                        name: input.value,
                        folderId: path == "/" ? null : path.split('/')[path.split('/').length - 2]
                    })
                })
                .then(response => response.json())
                .then(res => {
                    getAllFiles()
                    backdrop.remove()
                })
                .catch(err => {
                    console.error(err)
                    backdrop.remove()
                })
        }

        form.appendChild(input)
        form.appendChild(btn)
        newfolder.appendChild(form)
        backdrop.appendChild(newfolder)
        document.body.appendChild(backdrop)
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

    newFolderBtn.onclick = newFolder

    getAllFiles()
})()