const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const sideBar = document.querySelector('.chat-sidebar')

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('userRoom', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
    sideBar.scrollTop = sideBar.scrollHeight;
})

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

const outputMessage = message => {
    // console.log(message.username, username);
    const div = document.createElement('div');
    if(message.username === 'ChatBot')
        div.classList.add('messageCB');
    else if(message.username === username)
        div.classList.add('messageR');
    else
        div.classList.add('messageL');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}