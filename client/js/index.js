const socket = io();  

function message(params) {
    socket.emit('createMessage', params)
}

socket.on('connect', () => {
    console.log('Connected to server')
})

socket.on('disconnect', () => {
    console.log('Bye bye, User!')
})

socket.on('newMessage', ({from, text, createdAt = new Date().getTime()}) => {
    console.log(`${createdAt} | ${from} texting: ${text}`)
})

