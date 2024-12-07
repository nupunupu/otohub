const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

// publicディレクトリを静的ファイルとして提供
app.use(express.static('public'));

// ファイルアップロードの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

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

// ファイルアップロードのエンドポイント
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ success: true, filePath: `/uploads/${req.file.filename}` });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});