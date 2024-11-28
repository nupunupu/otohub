# otohub
リアルタイムで音声ファイルを再生・管理できるアプリケーションです。複数のクライアントが同時に音声ファイルを再生したり、設定を変更したりすることができます。

## 機能
- ボタンを押すと，クライアントすべてで同時に音声ファイルを再生できる
- クライアントすべてで音声ファイルを設定できる
- 複数ボタンのまとまりをプリセットとして定義できて，すぐに呼び出せる

## 技術スタック
- Docker: アプリケーションのコンテナ化
- SQLite: 軽量データベース
- Socket.IO: リアルタイム通信
- HTML/CSS/JS: フロントエンド開発
- Node.js: サーバーサイド開発

## セットアップ

1. リポジトリをクローンします。

    ```sh
    git clone git@github.com:nupunupu/otohub.git
    cd otohub
    ```

2. Dockerイメージをビルドします。

    ```sh
    docker build -t otohub .
    ```

3. Dockerコンテナを起動します。

    ```sh
    docker run -p 8080:8080 -v $(pwd):/app otohub
    ```

4. ブラウザで `http://localhost:8080` にアクセスします。