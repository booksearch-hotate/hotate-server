# コントリビュータへのガイドライン

このリポジトリへのコントリビュート方法についてのガイドラインとなります。

## そもそも「コントリビュート」とは

直訳すると「**貢献する**」になります。要はこのリポジトリのエラーや脆弱性となるような部分を直す、という感覚で合ってると思います。

## Issue
issueは基本的にいつでも受け付けています。例えばこんなissueをしてくれると助かります。
- エラーの報告 → [こちらから](https://github.com/booksearch-hotate/hotate-server/issues/new?assignees=&labels=bug&template=------.md&title=%5BBug%5D)
- 新しい提案 → [こちらから](https://github.com/booksearch-hotate/hotate-server/issues/new?assignees=&labels=suggest&template=--------.md&title=%5BSuggest%5D)

その他のissueも是非投げてみてください！

ただし、すぐには修正できない場合がありますのでご了承ください。

## プルリクエスト
プルリクエストも同様にいつでも受け付けています。ただし、[CODE OF CONDUCT](./CODE_OF_CONDUCT.md)に沿った内容にしてください。

## 修正の確認方法

このリポジトリはDockerを基にさまざまなツールを用いています。

### Docker
基本的には`docker-compose up`で起動してください。詳しいサービス名は[docker-compose.yml](./docker-compose.yml)をご覧ください。

### app
アプリサーバーはNode.jsを用いています。以下のコマンドを入力後、[localhost:8080](http://localhost:8080)へアクセスすることでローカル上でのアクセスが可能になります。
```bash
$ npm run dev-build && npm run dev-run
```

### 環境変数について
このリポジトリでは安全性のため環境変数ファイルはリポジトリに公開していません。環境変数は以下の通りです。(`v0.5.0`現在)

```
DB_PW_KEY=<DBのパスワード>
SESSION_SECRET=<sessionのシークレットキー>
JWTSECRET=<JWTのシークレットキー>
```

この環境変数をappフォルダ内の`.env`というファイル名で保存してください。

## 開発者向けドキュメントについて
開発者向けのドキュメントを[こちら](https://github.com/booksearch-hotate/hotate-server/blob/main/DOC/dear-developer.md)に掲載しています。ぜひ一読してください！
