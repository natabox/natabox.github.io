(() => {
    const url = 'https://natabox.herokuapp.com'

    const login_form = document.querySelector('.login')
    const login_email = document.querySelector('.login input[name="email"]')
    const login_password = document.querySelector('.login input[name="password"]')


    login_form.onsubmit = e => {
        e.preventDefault()
        login(login_email.value, login_password.value)
    }

    function login(u, p) {
        fetch(url + "/users/login", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'User': u,
                'Password': p
            }
        }).then((res) => {
            console.log(res)

            if (res.status == '404') return "usuario ou senha incorretos"
            return res.json()
        }).then(result => {
            if (typeof result == 'string') {
                console.log(result)
            } else {
                localStorage.setItem('account', encrypt(JSON.stringify({
                    email: u,
                    password: p
                })))
                window.location.href = window.location.href.replace('/account', '/box')
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const key = 'supersecretkey17845'

    function encrypt(msg) {
        return CryptoJS.AES.encrypt(msg, key).toString()
    }
})()