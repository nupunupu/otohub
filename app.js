const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

// publicディレクトリを静的ファイルとして提供
app.use(express.static(path.join(__dirname, 'public')));

// ルートハンドラをインポート
const uploadRouter = require('./routes/upload');
const audiofilesRouter = require('./routes/audiofiles');
const directoriesRouter = require('./routes/directories');

// ルートハンドラを使用
app.use('/upload', uploadRouter);
app.use('/audiofiles', audiofilesRouter);
app.use('/directories', directoriesRouter);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('playAudio', (filePath) => {
        console.log('playAudio event received with filePath:', filePath);
        io.emit('playAudio', filePath);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});