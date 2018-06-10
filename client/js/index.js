const socket = io();  

function message(params) {
    socket.emit('createMessage', params)
}

socket.on('connect', () => {
    console.log('Connected to server')

    socket.emit('createMessage', {
        from: 'Mr. Noname',
        text: 'Ahoy back to ya',
        createdAt: '0.0.1'
    })
})

socket.on('disconnect', () => {
    console.log('Someone syebalsya')
})

socket.on('newMessage', ({from, text, createdAt}) => {
    console.log(`${createdAt} | ${from} texting: ${text}`)
})

