const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 特定のディレクトリ内のファイルリストを返すエンドポイント
router.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, '../public/uploads', req.query.directory || '');
  const getFilesRecursively = (dir) => {
    const files = fs.readdirSync(dir);
    let fileList = [];
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fileList = fileList.concat(getFilesRecursively(filePath));
      } else {
        fileList.push(filePath.replace(directoryPath, ''));
      }
    });
    return fileList;
  };
  res.json(getFilesRecursively(directoryPath));
});

module.exports = router;