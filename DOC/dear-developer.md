# 将来の開発者さんへ

もしも保守をしてくださる開発者さんがいらっしゃいましたら、是非このドキュメントを一読ください。

## このドキュメントの最終更新日

2022/12/03(`v1.1.0`)

## 開発を行う上で必要なツール

### Git

このリポジトリをクローンする際に必要となります。

[公式サイト](https://git-scm.com/)

### Docker

本番環境、開発環境の両方において必須となります。
TREEの起動(検索エンジン、データベース、webサーバの起動)に必要となります。

[公式サイト](https://www.docker.com/)

### npm

webサーバをdockerを用いずに起動する際にはnpmを使用してください。
npmを使用するにはNode.jsのダウンロードが必要です。

- [公式サイト（npm）](https://www.npmjs.com/)
- [公式サイト（Node.js）](https://nodejs.org/ja/)

### テキストエディタ

環境変数の設定などに必要です。

[VSCode](https://code.visualstudio.com/)
[Vim](https://forest.watch.impress.co.jp/library/software/vim/)

## 各サーバの説明

### 検索エンジン

TREEでは検索エンジンとして[Elasticsearch](https://www.elastic.co/jp/elasticsearch/)を使用しています。

#### プラグイン

デフォルトのままだとアナライザーが日本語に対応していないので、以下のプラグインをダウンロードしています。

- [Japanese (kuromoji) Analysis Pluginedit](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-kuromoji.html)
- [ICU Analysis Pluginedit](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html)

#### 各indexの設定について

各indexの設定については、[このフォルダ](https://github.com/booksearch-hotate/hotate-server/tree/main/app/settings/elasticsearch/templates)にJSON形式で設定しています。
webサーバの起動時にその階層に存在するJSONファイルを全て読み込み、elasticsearchにリクエストします。
`common.json`は全indexに共通の設定、各index名のjsonファイルはそのindexの設定を行っています。

#### データの場所

TREEでは、dockerのvolumeを用いてelasticsearchのデータを管理しています。
ボリューム名は`hotate-server_esdata`です。
`docker volume ps`で確認できます。
検索データを削除する際は`docker volume rm hotate-server_esdata`を実行してください。

### データベース

TREEではデータベースとして[MySQL](https://www.mysql.com/jp/)を使用しています。

#### 初回起動時

初回起動時、[このフォルダ](https://github.com/booksearch-hotate/hotate-server/tree/main/document-1/db/init)のsqlファイルが実行されます。
実行する順番は番号の昇順です。

#### E-R図

E-R図に関しては[DBのE-R図](./about-db.md)を参照してください。

#### データの場所

データの場所は`db/data`となります。
データを削除する際はこのフォルダを削除してください。

### webサーバ

TREEではwebサーバとして[Node.js](https://nodejs.org/ja/)を用いています。また、JavaScriptへトランスコンパイルを行うプログラム言語である[TypeScript](https://www.typescriptlang.org/)を使用してます。

#### ビルド

##### 開発環境

ビルドするときは、`tsc --noEmit`で型チェックを行い、`build.js`を実行することでJavaScriptへトランスコンパイルします。
この流れをまとめたコマンドが以下のものになります。

```bash
npm run dev-build
```

##### 本番環境

`tsc --noEmit`は実行せず、`build.js`のみを実行しJavaScriptへトランスコンパイルします。
これによって本番環境時には`@types`をダウンロードする必要がなくなり、より軽量にアプリを構築することができます。

```bash
npm run pro-build
```

##### ビルド時の違い

|  | development | production |
| :--: | :--: | :--: |
| typescriptの型チェック | あり | なし |
| eslintのインストール | あり | なし |
| minifyの適用 | なし | あり |
| sourcemapの適用 | あり | なし |

#### 実行

##### 開発環境

`dist/server.js`を実行することでwebサーバを起動することができます。
このとき、引数として`local`を設定することで、動作環境をローカル環境に設定できます。

```bash
npm run dev-run
```

##### 本番環境

`local`を設定せずに`dist/server.js`を実行します。

##### ログファイルについて

実行時に`output-log`を指定することでログファイルを自動的に書き込みます。
デフォルトでは開発環境、本番環境共にログファイルを生成します。
これを無効にしたい場合は`output-log`の箇所を削除してください。

#### 環境変数の設定

webサーバを実行するには環境変数の設定が必須となります。
`app`フォルダ直下に`.env`を作成し、以下の内容を入力してください。

```env
DB_PW_KEY=<DB専用のパスワード>
SESSION_SECRET=<セッションに用いるパスワード>
JWT_SECRET=<JWT用パスワード>
APP_PORT=8080
WS_PORT=5051
ES_PORT=9200
ES_DOCKER_NAME=es
MYSQL_DOCKER_NAME=mysql
```

| 値 | 内容 |
| :--: | :--: |
| DB_PW_KEY | DBの暗号化に用いる暗号鍵 |
| SESSION_SECRET | セッション通信に用いる暗号鍵 |
| JWT_SECRET | JWTに用いる暗号鍵 |
| APP_PORT | webアプリのポート番号 |
| WS_PORT | WebSocketのポート番号 |
| ES_PORT | Elasticsearchのポート番号 |
| ES_DOCKER_NAME | Elasticsearchのサービス名 |
| MYSQL_DOCKER_NAME | MySQLのサービス名 |

## テスト用csvファイルに関して

**v0.0.9b**より、テスト用のcsvファイルを公開しました。このcsvファイルは実際の本が登録されており、意図的にデータを欠落させているなどしています。デバッグ作業に役立ててください。

どの部分を改変しているかは「type」に書かれていますので、参考にしてください。

なお、テスト用のcsvファイルに関してですが、**testData.csv**と**testData_utf8.csv**が存在しています。testData.csvは文字コードが**ANCI(Shift_JIS)**、testData_utf8.csvは文字コードが**UTF-8**になっています。Shift-JISはWindows標準の文字コード、UTF-8はMac標準の文字コードとなっています。現在HOTATEは**UTF-8のみに対応**しています。

## コントリビュートに関して

コントリビュートに関する記載は[こちら](../CONTRIBUTING.md)をご覧ください。
