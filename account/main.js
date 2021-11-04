(() => {
    const urls = ['http://localhost:3000', 'https://natabox.herokuapp.com', 'https://ec2-18-230-154-13.sa-east-1.compute.amazonaws.com:8080']
    const url = urls[1]

    const login_form = document.querySelector('.login')
    const login_email = document.querySelector('.login input[name="email"]')
    const login_password = document.querySelector('.login input[name="password"]')
    const login_btn = document.querySelector('.login button.submit')

    let logging = false

    const error = document.createElement('div')
    error.className = 'error'

    const spinner = document.createElement('div')
    spinner.className = 'spinner'

    login_form.onsubmit = e => {
        e.preventDefault()
        login(login_email.value, login_password.value)
    }

    function login(u, p) {
        if (logging) return
        logging = true
        login_btn.innerText = ''
        login_btn.appendChild(spinner)
        error.remove()
        fetch(url + "/users/login", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'User': u,
                'Password': p
            }
        }).then((res) => {
            if (res.status == '404') throw new Error("Usuário ou senha incorretos")
            return res.json()
        }).then(result => {
            localStorage.setItem('account', encrypt(JSON.stringify({
                email: u,
                password: p
            })))
            window.location.href = window.location.href.replace('/account', '/box')
        }).catch((err) => {
            error.innerText = err.message
            document.body.appendChild(error)
            spinner.remove()
            login_btn.innerText = 'Login'
            logging = false
        })
    }

    const key = 'supersecretkey17845'

    function encrypt(msg) {
        return CryptoJS.AES.encrypt(msg, key).toString()
    }
})()