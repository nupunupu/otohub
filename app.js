const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

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

// アップロードされたファイルのリストを返すエンドポイント
app.get('/audiofiles', (req, res) => {
  const directoryPath = path.join(__dirname, 'public/uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    res.json(files);
  });
});

// 音声ファイルリストを取得するエンドポイントを追加
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    // 音声ファイルのみをフィルタリング
    const audioFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.mp3' || ext === '.wav' || ext === '.ogg';
    });
    res.json(audioFiles);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});