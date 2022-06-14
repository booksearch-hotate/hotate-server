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
$ npm run dev-build
```

### 実行

javascriptを実行します。

```bash
$ npm run dev-run
```

#### オプション

`dev-run`ではデフォルトで`local`というオプションが付いており、ローカル環境での動作となっています。

その他、以下のコマンドが存在します。

| コマンド | 内容 |
| :--: | :--: |
| output-log | ログファイルを出力します。コンソール上にはログが一切表示されません。 |

## Elasticsearch、DBの起動方法

elasticsearch、mysql、phpmyadminに関しては通常と同じようにdockerで起動してください。

```bash
$ docker-compose up es
$ docker-compose up mysql
$ docker-compose up phpmyadmin
```

## 環境変数について

このサービスでは環境変数を設定する必要があります。項目は以下の通りです。

| 値 | 内容 |
| :--: | :--: |
| DB_PW_KEY | DBの暗号化に用いる暗号鍵 |
| SESSION_SECRET | セッション通信に用いる暗号鍵 |
| JWTSECRET | JWTに用いる暗号鍵 |

この内容を`app`フォルダ直下に`.env`の名称で作成してください。

## DBの構造について

[DBの構成について](./AboutDB.md)をご覧ください。
