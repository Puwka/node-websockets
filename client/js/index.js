const socket = io();  



socket.on('connect', () => {
    console.log('Connected to server')
})

socket.on('disconnect', () => {
    console.log('Bye bye, User!')
})

socket.on('newMessage', ({from = 'Guest', text, createdAt = new Date().getTime()}) => {
    console.log(`${createdAt} | ${from} texting: ${text}`)
    
    chat.innerHTML += `<p><strong>${createdAt}</strong> | <strong>${from}</strong>: ${text} </p>`

})

socket.on('newLocationMessage', ({latitude, longitude, from = 'Guest', createdAt = new Date().getTime()}) => {
    chat.innerHTML += `<p><strong>${createdAt}</strong> | 
    <strong>${from}</strong> calling that his geoposition is
    <a target="blank" href="https://www.google.com/maps?q=${latitude},${longitude}">here</a>`
})

const chat = document.querySelector('#messages')
const form = document.querySelector('#message__form')
const locationBtn = document.querySelector('#send-location')
form.addEventListener('submit', submitHandler)
locationBtn.addEventListener('click', sendLocation)


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