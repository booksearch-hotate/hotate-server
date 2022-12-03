# 使い方

## 事前導入

このアプリを起動するにあたり、必要なソフトをインストール、設定してください。

- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## アプリのソースコード取得方法

※本来は導入時に行うものですので、既にエンジニアによって導入手続きが終わっている場合は省略してください。

1. macの場合はターミナル、windowsの場合はコマンドプロンプトを起動
2. ダウンロード先のディレクトリまで移動
3. `git clone https://github.com/booksearch-hotate/hotate-server.git`を実行
4. `cd hotate-server`でhotate-serverフォルダ内へ移動

## アプリの起動方法

1. docker Desktopを起動し、docker Engineを起動する
2. コマンドプロンプト（macの場合はターミナル）を開く
3. hotate-serverフォルダまで移動
4. `docker-compose up app`と入力[^1]
5. webブラウザで[http://localhost:8080](http://localhost:8080)を開く

## 個別のサービス起動方法

※ 通常ならば`docker-compose up app`で全てのサービス(Elasticsearchなど)が起動するようになっています。

- `docker-compose up <アプリ名>`を入力

`<アプリ名>`の箇所は`docker-compose.yml`を参考にしてください。

### webサーバの起動方法

webサーバのみを起動する場合は以下のコマンドを入力します。

```bash
npm run dev-run
```

## 管理者画面について

管理者専用の画面は[http://localhost:8080/admin/](http://localhost:8080/admin/)となります。
初回アクセス時にIDとパスワードを設定できます。
またIDとパスワードは管理者画面から変更可能です。

[^1]: `docker-compose up app`でエラーが発生する場合は`docker compose up app`を試してください
