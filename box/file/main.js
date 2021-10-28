(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com']
    const url = urls[1]
    if (window.location.href.includes('?=')) {
        const param = window.location.href.split('?=')[1].replaceAll('/', '')
        fetch(`${url}/link/${param}`, {
            method: 'GET'
        }).then(response => response.json()).then(res => {
            if (res.message == 'Link not found') {
                throw new Error("404")
            }
            const iframe = document.createElement('iframe')
            const downloadBtn = document.createElement('button')
            downloadBtn.innerText = 'Download'
            downloadBtn.onclick = () => {
                downloadFile(res.filePath, param)
            }
            iframe.src = res.filePath
            document.body.appendChild(iframe)
            document.body.appendChild(downloadBtn)
        }).catch(err => {
            const h1 = document.createElement('h1')
            h1.innerText = 'File not found'
            document.body.appendChild(h1)
        })
    } else {
        const h1 = document.createElement('h1')
        h1.innerText = 'Invalid URL'
        document.body.appendChild(h1)
    }

    function downloadFile(path, param) {
        const url = path
        const fileName = param
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
})()