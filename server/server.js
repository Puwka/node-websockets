import path from 'path'
import http from 'http'
import koa from 'koa'
import config from './config/default'
import serve from 'koa-static'
import err from './middleware/error';
import socket from 'socket.io'

import { Users } from './utils/users'
import { generateMessage } from './utils/message'
import { isRealString } from './utils/validation'

const clientPath = path.join(__dirname, '../client');
const port = process.env.PORT || config.server.port;

const app = new koa();
app.use(err);
app.use(serve(clientPath));

const server = http.createServer(app.callback());
const io = socket(server);
const users = new Users();


io.on('connection', socket => {
    // console.log('connected', socket.id);

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) return callback('Name and room name are required')

        socket.join(params.room)
        users.removeUser({id: socket.id})
        users.addUser({id: socket.id, name: params.name, room: params.room})

        io.to(params.room).emit('updateUserList', users.getUserList({room: params.room}))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat, m8!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined, go message him!`));

        callback()
    }) 

    

    socket.on('createMessage', (data, callback) => {
        if (!isRealString(data.text)) return
        data['from'] = users.getUser({id: socket.id}).name
        io.to(users.getUser({id: socket.id}).room).emit('newMessage', data)
        callback()
    })

    socket.on('createLocationMessage', (data, callback) => {
        data['from'] = users.getUser({id: socket.id}).name
        io.to(users.getUser({id: socket.id}).room).emit('newLocationMessage', data)
        callback()
    })

    socket.on('disconnect', () => {
        const user = users.removeUser({id: socket.id})

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList({room: user.room}))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`))
        }
    })
});

process.on('SIGINT', function() {
    process.exit();
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
