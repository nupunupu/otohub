const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// ディレクトリリストを返すエンドポイント
router.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, '../public/uploads');
  const getDirectories = (dir) => {
    const files = fs.readdirSync(dir);
    let dirList = [];
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        dirList.push(filePath.replace(directoryPath, ''));
        dirList = dirList.concat(getDirectories(filePath));
      }
    });
    return dirList;
  };
  res.json(getDirectories(directoryPath));
});

module.exports = router;