const express = require('express');
const app = express();

// socket.io has to use http server
const server = require('http').Server(app);

// socket.io
const io = require('socket.io')(server);

let onlineUsers = {};

io.on('connection', (socket) => {
    require('./sockets/chat.js')(io, socket, onlineUsers);
    console.log('🔌 New user connected! 🔌');
});

// Express View Engine for Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Public Folder
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('main', {layout: 'index'});
});

server.listen('3000', () => {
    console.log('Server listening on port 3000! http://localhost:3000')
});
