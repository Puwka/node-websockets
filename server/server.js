import path from 'path'
import http from 'http'
import koa from 'koa'
import config from './config/default'
import serve from 'koa-static'
import err from './middleware/error';
import socket from 'socket.io'

const clientPath = path.join(__dirname, '../client')
const port = process.env.PORT || config.server.port

const app = new koa();
app.use(err);
app.use(serve(clientPath));

const server = http.createServer(app.callback());
const io = socket(server);

io.on('connection', socket => {
    console.log('new user! AHOY!')

    socket.emit('newMessage', {
        from: 'Puwka',
        text: 'Hello m8s',
        createdAt: '0.0.1'
    })

    socket.on('createMessage', (data) => {
        socket.emit('newMessage', data)
    })

    socket.on('disconnect', () => {
        console.log('User syebalsya')
    })
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
