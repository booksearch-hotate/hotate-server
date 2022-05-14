# HOTATE

## 使い方

[使い方](./DOC/how-to-use.md)

## 動かないな？って思ったら

[主要な問題とその解決方法](./DOC/resolve-problem.md)

## 詳しい更新履歴

[CHANGELOG](./CHANGELOG.md)

## 使用している技術

### 共通

- [Docker](https://www.docker.com/) -> 仮想環境構築ツール

### サーバ(ディレクトリ名 : app)

- [npm](https://www.npmjs.com/) -> パッケージ管理ツール
  - expressやsequelize、jsonwebtoken、log4jsなど
- [node.js](https://nodejs.org/ja/) -> サーバサイドのjavascript実行環境
  - [typescript](https://www.typescriptlang.org/) -> javascriptの強化版
  - [express](https://expressjs.com/ja/) -> ルーティング関係のフレームワーク
  - [ejs](https://ejs.co/) -> テンプレートエンジン
  - [Sequelize](https://sequelize.org/) -> ORM
  - [ドメイン駆動設計](https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88) -> 設計手法

### DB(ディレクトリ名 : db)

- [mysql](https://www.mysql.com/jp/) -> DBMS

### 検索エンジン(ディレクトリ名 : elasticsearch)

- [Elasticsearch](https://www.elastic.co/jp/) -> オープンソースの検索エンジン

## 開発者へ向けてのTODO

- envファイルの作成
- 管理者のIDとパスワードをDBへ登録