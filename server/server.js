import path from 'path'
import http from 'http'
import koa from 'koa'
import config from './config/default'
import serve from 'koa-static'
import err from './middleware/error';
import socket from 'socket.io'
import {generateMessage} from './utils/message'


const clientPath = path.join(__dirname, '../client')
const port = process.env.PORT || config.server.port

const app = new koa();
app.use(err);
app.use(serve(clientPath));

const server = http.createServer(app.callback());
const io = socket(server);


io.on('connection', socket => {
    console.log('new user! AHOY!')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat, m8!'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined, go message him!'))

    socket.on('createMessage', (data, callback) => {
        
        io.emit('newMessage', data)
        callback()
    })

    socket.on('createLocationMessage', (data, callback) => {
        io.emit('newLocationMessage', data)
        callback()
    })

    socket.on('disconnect', () => {
        console.log('Bye bye, User')
    })
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
