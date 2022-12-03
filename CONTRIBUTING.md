# コントリビュータへのガイドライン

このリポジトリへのコントリビュート方法についてのガイドラインとなります。

## Issue

issueは基本的にいつでも受け付けています。例えばこんなissueをしてくれると助かります。

- エラーの報告 → [こちらから](https://github.com/booksearch-hotate/hotate-server/issues/new?assignees=&labels=bug&template=------.md&title=%5BBug%5D)
- 新しい提案 → [こちらから](https://github.com/booksearch-hotate/hotate-server/issues/new?assignees=&labels=suggest&template=--------.md&title=%5BSuggest%5D)

その他のissueも是非投げてみてください！

ただし、すぐには修正できない場合がありますのでご了承ください。

## プルリクエスト

プルリクエストも同様にいつでも受け付けています。ただし、[CODE OF CONDUCT](./CODE_OF_CONDUCT.md)に沿った内容にしてください。

## 開発者向けドキュメント

開発者向けのドキュメントを[こちら](https://github.com/booksearch-hotate/hotate-server/blob/main/DOC/dear-developer.md)に掲載しています。ぜひ一読してください！

## markdownlintについて

このリポジトリ内のmarkdownは[markdownlint-cli](https://www.npmjs.com/package/markdownlint-cli)で整形しています。
そしてmarkdownの変更をプルリクした場合、github actionsでmarkdownlint-cliによるチェックが入ります。
事前にmarkdownlintによるチェック・修正をおこなってください。

### markdownlintのインストール

```bash
npm i -global markdownlint-cli
```

### markdownlintによる解析

```bash
markdownlint '**/*.md' -c './.markdownlint.jsonc'
```

### markdownlintによる自動修正

**変更後の修正はできないのでご注意ください。**

```bash
markdownlint '**/*.md' -c './.markdownlint.jsonc' -f
```
