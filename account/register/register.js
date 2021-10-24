(() => {
    const welcomeSpan = document.querySelector('span.welcome')
    typeAnimation(welcomeSpan, welcomeSpan.getAttribute('text'), 50, startForm, 200)

    const url = 'https://natabox.herokuapp.com'

    let registering = false

    const error = document.createElement('div')
    error.className = 'error'

    function typeAnimation(el, text, delay, callback, callbackDelay) {
        let i = 1
        el.innerText += text.charAt(0).replace(' ', '\xa0')
        let anim = setInterval(() => {
            if (i >= text.length - 1) {
                clearInterval(anim)
                try {
                    setTimeout(callback, callbackDelay)
                } catch (e) {

                }
            }
            el.innerText += text.charAt(i++).replace(' ', '\xa0')
        }, delay)
    }

    function startForm() {
        const form = document.createElement('form')
        form.onsubmit = e => e.preventDefault()
        createEmail(form)
        document.querySelector('.register').appendChild(form)
    }

    function createEmail(form) {
        if (document.querySelector('.email-container') != null) return

        let correct = false

        const emailContainer = document.createElement('div')
        emailContainer.className = 'email-container'

        const title = document.createElement('p')
        title.className = 'title email'
        title.innerText = 'Digite seu email'

        const inputsContainer = document.createElement('div')
        inputsContainer.className = 'inputs email'

        const input = document.createElement('input')
        input.type = 'email'

        input.onkeydown = (evt) => {
            if (evt.key === 'Enter' && correct) createPassword(form)
        }

        input.oninput = () => {
            if (checkEmail(input.value)) {
                inputsContainer.classList.add('correct')
                correct = true
            } else {
                inputsContainer.classList.remove('correct')
                correct = false
            }
        }

        const btn = document.createElement('button')
        btn.innerText = 'Continuar'

        btn.onclick = () => {
            if (correct) createPassword(form)
        }

        inputsContainer.appendChild(input)
        inputsContainer.appendChild(btn)

        emailContainer.appendChild(title)
        emailContainer.appendChild(inputsContainer)

        form.appendChild(emailContainer)
        input.focus()
    }

    function createPassword(form) {
        if (document.querySelector('.password-container') != null) return

        let correct = false

        const passwordContainer = document.createElement('div')
        passwordContainer.className = 'password-container'

        const title = document.createElement('p')
        title.className = 'title password'
        title.innerText = 'Crie uma senha'

        const inputsContainer = document.createElement('div')
        inputsContainer.className = 'inputs password'

        const input = document.createElement('input')
        input.type = 'password'

        input.onkeydown = (evt) => {
            if (evt.key === 'Enter' && correct) createName(form)
        }

        input.oninput = () => {
            if (checkPassword(input.value)) {
                inputsContainer.classList.add('correct')
                correct = true
            } else {
                inputsContainer.classList.remove('correct')
                correct = false
            }
        }

        const btn = document.createElement('button')
        btn.innerText = 'Continuar'

        btn.onclick = () => {
            if (correct) createName(form)
        }

        inputsContainer.appendChild(input)
        inputsContainer.appendChild(btn)

        passwordContainer.appendChild(title)
        passwordContainer.appendChild(inputsContainer)

        form.appendChild(passwordContainer)
        input.focus()
    }

    function createName(form) {
        if (document.querySelector('.name-container') != null) return

        let correct = false

        const nameContainer = document.createElement('div')
        nameContainer.className = 'name-container'

        const title = document.createElement('p')
        title.className = 'title name'
        title.innerText = 'Digite seu nome'

        const inputsContainer = document.createElement('div')
        inputsContainer.className = 'inputs name'

        const input = document.createElement('input')
        input.type = 'text'

        input.onkeydown = (evt) => {
            if (evt.key === 'Enter' && correct) createButton(form)
        }

        input.oninput = () => {
            if (checkName(input.value)) {
                inputsContainer.classList.add('correct')
                correct = true
            } else {
                inputsContainer.classList.remove('correct')
                correct = false
            }
        }

        const btn = document.createElement('button')
        btn.innerText = 'Continuar'

        btn.onclick = () => {
            if (correct) createButton(form)
        }

        inputsContainer.appendChild(input)
        inputsContainer.appendChild(btn)

        nameContainer.appendChild(title)
        nameContainer.appendChild(inputsContainer)

        form.appendChild(nameContainer)
        input.focus()
    }

    function createButton(form) {
        if (document.querySelector('form > button') != null) return
        const btn = document.createElement('button')
        btn.onclick = () => {
            if (registering) return
            const email = form.children[0].children[1].children[0]
            const password = form.children[1].children[1].children[0]
            const name = form.children[2].children[1].children[0]
            if (checkEmail(email.value) && checkPassword(password.value) && checkName(name.value)) {
                const user = new User(email.value, name.value, password.value)
                register(btn, user)
            }
        }
        btn.innerText = 'Criar conta'
        form.appendChild(btn)
    }

    function checkEmail(text) {
        return (text.includes('@') && text.includes('.') && text.length >= 5 && text.charAt(text.length - 1) != '.')
    }

    function checkPassword(text) {
        return (text.length >= 8 && text.length <= 30)
    }

    function checkName(text) {
        return (text.length >= 3 && text.length <= 20)
    }

    function register(btn, user) {
        error.remove()
        registering = true
        const spinner = document.createElement('div')
        spinner.className = 'spinner'
        btn.innerText = ''
        btn.appendChild(spinner)

        fetch(url + "/users", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }).then((res) => {
                console.log(res)
                if (res.status == 404) throw new Error("Usuario ja cadastrado")
                return res.json()
            })
            .then(result => {
                if (result == undefined) {
                    throw new Error("Usuario ja cadastrado")
                }
                console.log(result)
                success()
                registering = false
            }).catch((err) => {
                console.log(err)
                if (String(err).includes("Usuario ja cadastrado")) {
                    error.innerText = 'Email ja cadastrado'
                    document.body.appendChild(error)
                } else {
                    error.innerText = 'Erro, tente novamente'
                    document.body.appendChild(error)
                }
                registering = false
                spinner.remove()
                btn.innerText = 'Criar conta'
            })
    }

    function success() {
        const parentEl = welcomeSpan.parentElement
        const loginBtn = document.createElement('a')
        loginBtn.href = '../'
        loginBtn.innerText = 'Login →'
        parentEl.innerText = 'Usuário cadastrado com sucesso\n'
        parentEl.appendChild(loginBtn)
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
})()