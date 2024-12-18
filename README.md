# otohub
リアルタイムで音声ファイルを再生・管理できるアプリケーションです。複数のクライアントが同時に音声ファイルを再生したり、設定を変更したりすることができます。

## 機能
- ボタンを押すと，クライアントすべてで同時に音声ファイルを再生できる
- クライアントすべてで音声ファイルを設定できる
- 複数ボタンのまとまりをプリセットとして定義できて，すぐに呼び出せる

## 技術スタック
- Docker: アプリケーションのコンテナ化
- SQLite: ファイルベースでサーバー不要の軽量データベース
- Socket.IO: リアルタイム通信ライブラリ
- HTML/CSS/JS: フロントエンド開発
- Node.js(Express.js): サーバーサイド開発

## セットアップ

1. リポジトリをクローンします。

    ```sh
    git clone git@github.com:nupunupu/otohub.git
    cd otohub
    ```

<!-- 2. Dockerイメージをビルドします。

    ```sh
    docker build -t otohub .
    ```

3. Dockerコンテナを起動します。

    ```sh
    docker run -p 8080:8080 -v $(pwd):/app otohub
    ``` -->
2. 依存関係をインストールします。

    ```sh
    npm install
    ```

3. アプリケーションを起動します。

    ```sh
    npm start
    ```
4. ブラウザで `http://localhost:8080` にアクセスします。