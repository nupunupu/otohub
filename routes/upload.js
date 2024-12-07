const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// multerの設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ファイルアップロードのエンドポイント
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'ファイルがアップロードされていません。' });
    }

    const userDirectory = req.body.directory;
    const uploadPath = path.join(__dirname, '../public/uploads', userDirectory);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const oldPath = req.file.path;
    const newPath = path.join(uploadPath, req.file.filename);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'ファイルの保存に失敗しました。' });
        }

        res.json({ success: true, message: 'ファイルがアップロードされました。', filePath: newPath });
    });
});

module.exports = router;