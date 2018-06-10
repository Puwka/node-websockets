const socket = io();  



socket.on('connect', () => {
    console.log('Connected to server')
})

socket.on('disconnect', () => {
    console.log('Bye bye, User!')
})

socket.on('newMessage', ({from = 'Guest', text, createdAt = new Date().getTime()}) => {
    console.log(`${createdAt} | ${from} texting: ${text}`)
    
    chat.innerHTML += `<p><strong>${createdAt}</strong> | <strong>${from}</strong> texting: ${text} </p>`

})

socket.on('newLocationMessage', ({latitude, longitude, from = 'Guest', createdAt = new Date().getTime()}) => {
    chat.innerHTML += `<p><strong>${createdAt}</strong> | 
    <strong>${from}</strong> calling that his geoposition is
    <a target="blank" href="https://www.google.com/maps?q=${latitude},${longitude}">here</a>`
})

const chat = document.querySelector('#chat')
const form = document.querySelector('#message__form')
const locationBtn = document.querySelector('#send-location')
form.addEventListener('submit', submitHandler)
locationBtn.addEventListener('click', sendLocation)


function submitHandler(e) {
    e.preventDefault()
    let text = form.querySelector('[name=message]').value
    socket.emit('createMessage', {text},
        (res) => {
            console.log(res)
        }
    )
}

function sendLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let data = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            socket.emit('createLocationMessage', data, (res) => {
                console.log(res)
            })
        }, e => alert('Can\'t reach your geolocation, Mr.Spy'))
    } else {
        alert('Can\'t reach your geolocation, Mr.Spy')
    }
}