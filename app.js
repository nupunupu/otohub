const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

// publicディレクトリを静的ファイルとして提供
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('playAudio', () => {
        io.emit('playAudio');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});