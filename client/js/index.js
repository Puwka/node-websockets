const socket = io();  



socket.on('connect', () => {
    console.log('Connected to server')
})

socket.on('disconnect', () => {
    console.log('Bye bye, User!')
})

socket.on('newMessage', ({from = 'Guest', text, createdAt = generateDate()}) => {
    
    chat.innerHTML += `<li class="message"><div class="message__title">
    <h4>${from}</h4><span>${createdAt}</span></div><div class="message__body">
    <p>${text}</p></div></li>`

})

socket.on('newLocationMessage', ({latitude, longitude, from = 'Guest', createdAt = generateDate()}) => {
    chat.innerHTML += `<li class="message"><div class="message__title">
    <h4>${from}</h4><span>${createdAt}</span></div><div class="message__body">
    <p>I'm
    <a target="blank" href="https://www.google.com/maps?q=${latitude},${longitude}">here</a></p>
    </div></li>`
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
    } else {
        alert('Can\'t reach your geolocation, Mr.Spy')
    }
}