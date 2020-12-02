const express = require('express');
const app = express();

// Socket.io has to use http server
const server = require('http').Server(app);

// Express View Engine for Handlebars
const exphpbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, recs) => {
    resizeBy.render('index.handlebars');
})

server.listen('3000', () => {
    console.log('Server listening on port 3000! http://localhost:3000')
})