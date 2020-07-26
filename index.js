const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, removeUser, getUserRoom}  = require('./utils/user');
const user = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage('ChatBot', `Welcome ${user.username.bold().toUpperCase()} to the Chat Room`))

        socket.broadcast.to(user.room).emit('message', formatMessage('ChatBot', `${user.username.bold().toUpperCase()} has joined the Chat Room`));

        io.to(user.room).emit('userRoom', {
            room: user.room,
            users: getUserRoom(user.room)
        })
    })

    socket.on('chatMessage', msg => {
        const currentUser = getCurrentUser(socket.id);
        io.to(currentUser.room).emit('message', formatMessage(currentUser.username, msg));
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){

            io.to(user.room).emit('message', formatMessage('ChatBot', `${user.username.bold().toUpperCase()} has left the Chat Room`));

            io.to(user.room).emit('userRoom', {
                room: user.room,
                users: getUserRoom(user.room)
            })
        }
    })
})



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))