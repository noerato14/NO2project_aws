const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http =require('http');

// initialization
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


// routes
app.use(require('./routes/'));

// sockets
require('./sockets')(io);


// stactic files
app.use(express.static(path.join(__dirname,'public')));

// starting the server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server on port ' + (process.env.PORT ||3000) );
})