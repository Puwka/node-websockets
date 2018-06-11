const socket = io();  



socket.on('connect', () => {
    const query = window.location.search
    let parsedQuery = query.split('&')
    parsedQuery[0] = parsedQuery[0].replace(/\?/, '')
    
    let kostyl = parsedQuery.map(param => {
        let splittedParam = param.split('=')
        let result = {}
        result[splittedParam[0]] = splittedParam[1]
        return result
    })
    let params = {}
    kostyl.forEach(param => {
        for (let key in param) {
            params[key] = param[key]
        }
    })
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err)
            window.location.href = '/'
        }
        console.log('No error')
    })
})

socket.on('disconnect', () => {
    console.log('cya')
})

socket.on('updateUserList', (users) => {
    const usersContainer = document.querySelector('#users')
    usersContainer.innerHTML = '<ol></ol>'
    users.forEach(user => {
        usersContainer.querySelector('ol').innerHTML += `<li>${user}</li>`
    })
})

socket.on('newMessage', ({from = 'Guest', text, createdAt = generateDate()}) => {
    
    chat.innerHTML += `<li class="message"><div class="message__title">
    <h4>${from}</h4><span>${createdAt}</span></div><div class="message__body">
    <p>${text}</p></div></li>`;

    scrollToBottom();
})

socket.on('newLocationMessage', ({latitude, longitude, from = 'Guest', createdAt = generateDate()}) => {
    chat.innerHTML += `<li class="message"><div class="message__title">
    <h4>${from}</h4><span>${createdAt}</span></div><div class="message__body">
    <p>I'm
    <a target="blank" href="https://www.google.com/maps?q=${latitude},${longitude}">here</a></p>
    </div></li>`

    scrollToBottom();
})

const chat = document.querySelector('#messages')
const form = document.querySelector('#message__form')
const locationBtn = document.querySelector('#send-location')
form.addEventListener('submit', submitHandler)
locationBtn.addEventListener('click', sendLocation)


function generateDate () {
    const timestamp = new Date()
    let hours = timestamp.getHours()
    let minutes = timestamp.getMinutes()
    let seconds = timestamp.getSeconds()
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`
    return `${hours}:${minutes}:${seconds}`
}

function submitHandler(e) { 
    e.preventDefault()
    const input = form.querySelector('[name=message]')
    let text = input.value
    socket.emit('createMessage', {text},
        (res) => {
            input.value = ''
        }
    )
    scrollToBottom(true)
}

function sendLocation() {
    let btn = event.currentTarget
    btn.setAttribute('disabled', true)
    btn.innerText = 'Sending...'
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            socket.emit('createLocationMessage', data, (res) => {
                btn.removeAttribute('disabled')
                btn.innerText = 'Send location'
            })
        }, e => alert('Can\'t reach your geolocation, Mr.Spy'))
        scrollToBottom(true)
    } else {
        alert('Can\'t reach your geolocation, Mr.Spy')
    }
}

function scrollToBottom (bool) {

    const newMessage = chat.querySelector('li:last-child')
    const clientHeight = chat.clientHeight;
    const scrollTop = chat.scrollTop;
    const scrollHeight = chat.scrollHeight;
    const newMessageHeight = newMessage.clientHeight
    let lastMessageHeight = 0
    if (newMessage.previousElementSibling) lastMessageHeight = newMessage.previousElementSibling.clientHeight

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight || bool) {
        chat.scrollTop = scrollHeight
    }
}