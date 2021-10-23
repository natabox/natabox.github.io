(() => {
    const url = 'https://natabox.herokuapp.com'

    const login_form = document.querySelector('.login')
    const login_email = document.querySelector('.login input[name="email"]')
    const login_password = document.querySelector('.login input[name="password"]')
    const login_submit = document.querySelector('.login input[name="submit"]')

    const register_form = document.querySelector('.register')
    const register_email = document.querySelector('.register input[name="email"]')
    const register_name = document.querySelector('.register input[name="name"]')
    const register_password = document.querySelector('.register input[name="password"]')
    const register_submit = document.querySelector('.register input[name="submit"]')

    login_form.onsubmit = e => {
        e.preventDefault()
        login(login_email.value, login_password.value)
    }
    register_form.onsubmit = e => {
        e.preventDefault()
        register(new User(register_email.value, register_name.value, register_password.value))
    }

    class User {
        email
        name
        password
        constructor(email, name, password) {
            this.email = email
            this.name = name
            this.password = password
        }
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
                window.location.href = window.location.href.replace('account', 'box')
            }
        }).catch((err) => {
            console.error(err)
        })
    }


    function register(user) {
        fetch(url + "/users", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }).then((res) => {
                console.log(res)
                return res.json()
            })
            .then(result => {
                if (result == undefined) {
                    console.log('usuario ja cadastrado')
                    return
                }
                console.log(result)
            }).catch((err) => {
                console.error(err)
            })
    }

    const key = 'supersecretkey17845'

    function encrypt(msg) {
        return CryptoJS.AES.encrypt(msg, key).toString()
    }


})()