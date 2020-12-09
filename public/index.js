document.addEventListener("DOMContentLoaded", onReady);

function onReady() {
    const socket = io.connect();

    let currentUser;
    // Get the online users from the server
    socket.emit('get online users');

    // Default channel
    socket.emit('user changed channel', "General");

    document.addEventListener('click', (e) => {
        if ((!e.target.classList.contains('channel-current')) && (e.target.classList.contains('channel'))) {
            let channel = e.target.innerText;
            console.log(channel);
            socket.emit('user changed channel', channel);
        }
    });

    document.getElementById('create-user-btn').addEventListener('click', (e) => {
        e.preventDefault();

        let username = document.getElementById('username-input').value;
        if (username.length > 0) {
            currentUser = username;
            // Emit to server the new user
            socket.emit('new user', username);
            document.querySelector('.username-form').remove();

            const mainContainer = document.querySelector('.main-container');
            mainContainer.style.display = 'flex';
        }
    });

    document.getElementById('send-chat-btn').addEventListener('click', (e) => {
        e.preventDefault();

        let channel = document.querySelector('.channel-current').innerText;
        let message = document.getElementById('chat-input').value;
        if (message.length > 0) {
            socket.emit('new message', {
                sender: currentUser,
                message: message,
                channel: channel,
            });
            document.getElementById('chat-input').value = "";
        }
    });

    document.getElementById('new-channel-btn').addEventListener('click', (e) => {
        e.preventDefault();
        let newChannel = document.getElementById('new-channel-input').value;
        if (newChannel.length > 0) {
            // Emit the new channel to the server
            socket.emit('new channel', newChannel);
            document.getElementById('chat-input').value = "";
        };
    });

    // socket listeners
    socket.on('new user', (username) => {
        console.log(`${username} has joined the chat! ✋`);
        let user = document.createElement("div")
        user.classList.add('user-online');
        user.textContent = `${username}`;

        const onlineUsers = document.querySelector('.users-online')
        onlineUsers.appendChild(user);
    });

    // Helper function new message
    function createMessage(data) {
        const message = document.createElement("div")
        message.classList.add('message')

        const msgUser = document.createElement("p");
        msgUser.classList.add('message-user');
        msgUser.textContent = `${data.sender}: `;

        const msgText = document.createElement("p");
        msgText.classList.add('message-text');
        msgText.textContent = `${data.message}`;

        message.appendChild(msgUser);
        message.appendChild(msgText);

        let box = document.querySelector('.message-container')
        box.appendChild(message);
    }

    socket.on('new message', (data) => {
        let currentChannel = document.querySelector('.channel-current').innerText;

        if (currentChannel == data.channel) {
            createMessage(data)
        };
    });

    // Helper function because D R Y
    function getOnlineUsers(onlineUsers) {
        for (username in onlineUsers) {
            let user = document.createElement("div")
            user.classList.add('user-online');
            user.textContent = `${username}`;

            const onlineUsers = document.querySelector('.users-online')
            onlineUsers.appendChild(user);
        }
    };

    socket.on('get online users', (onlineUsers) => {
        getOnlineUsers(onlineUsers);
    });

    socket.on('user has left', (onlineUsers) => {
        let userList = document.querySelector('.users-online');
        while (userList.firstChild) {
            userList.removeChild(userList.firstChild)
        };

        getOnlineUsers(onlineUsers);

    });

    socket.on('new channel', (newChannel) => {
        let channel = document.createElement('div');
        channel.classList.add('channel');
        channel.innerText = newChannel;

        const channels = document.querySelector('.channels');
        channels.appendChild(channel);
    })

    socket.on('user changed channel', (data) => {
        const currChannel = document.querySelector('.channel-current');
        // currChannel.className = "channel"
        // if (currChannel) {
        //     currChannel.classList.add('channel');
        //     currChannel.classList.remove('channel-current');
        // }

        const selectedChannel = document.querySelectorAll(`.channel`)
        if (selectedChannel.innerText == data.channel) {
            selectedChannel.classList.add('channel-current');
            selectedChannel.classList.remove('channel');
            // selectedChannel.className = 'channel-current';

            let message = document.querySelector('.message');
            if (message) {
                while (message.firstChild) {
                    message.removeChild(message.firstChild)
                };
            }
            for (msg in data.messages) {
                createMessage(msg)
            };

        }
    })
}
