module.exports = (io, socket) => {
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat! ✋`);
        io.emit('new user', username);
    })
}
