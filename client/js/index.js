const socket = io();  



socket.on('connect', () => {
    console.log('Connected to server')
})

socket.on('disconnect', () => {
    console.log('Bye bye, User!')
})

socket.on('newMessage', ({from = 'Guest', text, createdAt = new Date().getTime()}) => {
    console.log(`${createdAt} | ${from} texting: ${text}`)
    
    const chat = document.querySelector('#chat')
    chat.innerHTML += `<p><strong>${createdAt}</strong> | <strong>${from}</strong> texting: ${text} </p>`

})

// socket.emit('createMessage', {
//     from: 'Client', text: 'acknowlege test'
// }, (result) => {
//     console.log(`Got that => ${result}`)
// })

const form = document.querySelector('#message__form')
form.addEventListener('submit', submitHandler)

function submitHandler(e) {
    e.preventDefault()
    let text = form.querySelector('[name=message]').value
    socket.emit('createMessage', {text},
        (res) => {
            console.log(res)
        }
    )
}