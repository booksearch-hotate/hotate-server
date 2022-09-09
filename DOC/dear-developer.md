# 将来の開発者さんへ

もしも保守をしてくださる開発者さんがいらっしゃいましたら、是非このドキュメントを一読ください。

## 開発時の環境について

2022/05/09より、本番環境時と開発環境時とでビルドに大きな違いが出るようになりました。

|  | development | production |
| :--: | :--: | :--: |
| typescriptの型チェック | あり | なし |
| eslintのインストール | あり | なし |
| minifyの適用 | なし | あり |
| sourcemapの適用 | あり | なし |

ソースマップや型チェックなど、開発時に必要となる機能を削減していますので、開発時にはご自身のPCにnodeをインストールしてください。なお開発者の2022/05/09現在のnodeのバージョンは`v16.13.0`です。

## ビルドと実行

### ビルド

typescriptからjavascriptへのビルドを行います。このビルドをせずに実行をしても**変更内容が反映されない**ので注意してください。

```bash
npm run dev-build
```

### 実行

javascriptを実行します。

```bash
npm run dev-run
```

#### オプション

`dev-run`は以下のコマンドを実行します。

```bash
node --enable-source-maps dist/server.js local
```

`dist/server.js`以降は**オプション**となっています。内容は以下のとおりです。

| コマンド | 内容 |
| :--: | :--: |
| local | 動作環境をローカル環境(Dockerを用いない環境)で実行します。 |
| output-log | ログファイルを出力します。コンソール上にはログが一切表示されません。 |

`output-log`を用いる場合は`npm run dev-run -- output-log`と入力してください。

## Elasticsearch、DBの起動方法

elasticsearch、mysql、phpmyadminに関しては通常と同じようにdockerで起動してください。

```bash
docker-compose up es // Elasticsearch
docker-compose up mysql // MySql
docker-compose up phpmyadmin // phpmyadmin
```

## 環境変数について

このサービスでは環境変数を設定する必要があります。項目は以下の通りです。

| 値 | 内容 |
| :--: | :--: |
| DB_PW_KEY | DBの暗号化に用いる暗号鍵 |
| SESSION_SECRET | セッション通信に用いる暗号鍵 |
| JWT_SECRET | JWTに用いる暗号鍵 |

この内容を`app`フォルダ直下に`.env`の名称で作成してください。

### 環境変数の追加

以下の項目をenvファイルに追加してください。

```env
APP_PORT=8080
WS_PORT=5051
ES_PORT=9200
ES_DOCKER_NAME=es
MYSQL_DOCKER_NAME=mysql
```

issue186に対応するために環境変数を追加しました。

## DBの構造について

[DBの構成について](./AboutDB.md)をご覧ください。

## 使用している技術

使用している技術などについては[こちら](./use-tech.md)をご覧ください。

## TODO

- envファイルの作成
- 一度elasticsearchを起動した後、以下のコマンドを入力する

```bash
curl -H "Content-Type: application/json" -XPUT localhost:9200/*/_settings -d '{"number_of_replicas":0}'
{"acknowledged":true}
```

## テスト用csvファイルに関して

**v0.0.9b**より、テスト用のcsvファイルを公開しました。このcsvファイルは実際の本が登録されており、意図的にデータを欠落させているなどしています。デバッグ作業に役立ててください。

どの部分を改変しているかは「type」に書かれていますので、参考にしてください。

なお、テスト用のcsvファイルに関してですが、**testData.csv**と**testData_utf8.csv**が存在しています。testData.csvは文字コードが**ANCI(Shift_JIS)**、testData_utf8.csvは文字コードが**UTF-8**になっています。Shift-JISはWindows標準の文字コード、UTF-8はMac標準の文字コードとなっています。現在HOTATEは**UTF-8のみに対応**しています。

## コントリビュートに関して

コントリビュートに関する記載は[こちら](../CONTRIBUTING.md)をご覧ください。
