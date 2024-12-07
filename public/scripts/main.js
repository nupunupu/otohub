document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const audio = document.getElementById('audio');
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const directorySelect = document.getElementById('directorySelect');
  const errorMessage = document.getElementById('errorMessage');
  const fileList = document.getElementById('fileList');

  // ページロード時にディレクトリリストを取得して選択肢を生成
  fetch('/directories')
    .then(response => response.json())
    .then(directories => {
      directories.forEach(directory => {
        const option = document.createElement('option');
        option.value = directory;
        option.textContent = directory;
        directorySelect.appendChild(option);
      });
        directorySelect.dispatchEvent(new Event('change'));
    })
    .catch(error => console.error('Error:', error));

  // ディレクトリ選択時に音声ファイルリストを取得してボタンを生成
  directorySelect.addEventListener('change', () => {
    const directory = directorySelect.value;
    fetch(`/audiofiles?directory=${encodeURIComponent(directory)}`)
      .then(response => response.json())
      .then(files => {
        fileList.innerHTML = ''; // 既存のボタンをクリア
        files.forEach(file => {
          const newButton = document.createElement('button');
          newButton.textContent = file;
          newButton.classList.add('btn', 'btn-info', 'mb-2', 'me-2');
          newButton.addEventListener('click', () => {
            socket.emit('playAudio', `/uploads${directory}/${file}`);
          });
          fileList.appendChild(newButton);
        });
      })
      .catch(error => console.error('Error:', error));
  });

  socket.on('playAudio', (filePath) => {
    console.log('playAudio event received on client with filePath:', filePath);
    const audio = new Audio(filePath);
    audio.play();
  });

  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const directory = directorySelect.value.trim();
    if (!file) {
      errorMessage.textContent = 'ファイルを選択してください。';
      errorMessage.classList.remove('d-none');
      return;
    }
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      errorMessage.textContent = '無効なファイルタイプです。音声ファイルのみアップロードできます。';
      errorMessage.classList.remove('d-none');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // アップロード成功後にページをリロード
        window.location.reload();
      } else {
        // エラーメッセージを表示
        errorMessage.textContent = data.message;
        errorMessage.classList.remove('d-none');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // エラーメッセージを表示
      errorMessage.textContent = 'アップロードに失敗しました。';
      errorMessage.classList.remove('d-none');
    });
  });
});