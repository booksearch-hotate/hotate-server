# HOTATE

## 使い方

[使い方](./DOC/how-to-use.md)

## 動かないな？って思ったら

[主要な問題とその解決方法](./DOC/resolve-problem.md)

## 使用している技術

### 共通

- [Docker](https://www.docker.com/) -> 仮想環境構築ツール

### サーバ(ディレクトリ名 : app)

- [npm](https://www.npmjs.com/) -> パッケージ管理ツール
- [node.js](https://nodejs.org/ja/) -> サーバサイドのjavascript実行環境
  - [typescript](https://www.typescriptlang.org/) -> javascriptの強化版
  - [express](https://expressjs.com/ja/) -> ルーティング関係のフレームワーク
  - [ejs](https://ejs.co/) -> テンプレートエンジン
  - [Sequelize](https://sequelize.org/) -> ORM

### DB(ディレクトリ名 : db)

- [mysql](https://www.mysql.com/jp/) -> DBMS
