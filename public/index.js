document.addEventListener("DOMContentLoaded", onReady);

function onReady() {
    const socket = io.connect();

    document.getElementById('create-user-btn').addEventListener('click', (e) => {
        e.preventDefault();
        let username = document.getElementById('username-input').value;
        if (username.length > 0) {
            // Emit to server the new user
            socket.emit('new user', username);
            document.querySelector('.username-form').remove();
        }
    });

    // socket listeners
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat! ✋`);
    })
}
