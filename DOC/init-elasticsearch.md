# elasticsearchの初期化

## 環境

この手続きには`curl`が必要になります。このコマンドはwindows10で標準になっていますので、**windows10以上のPC**で行ってください。

## 初期化の方法

1. elasticsearchを起動する

```bash
docker-compose up es01 es02
```

コマンド上に色々ログが表示されますが、"server started"とかそれっぽい文字が見えたら多分OKです

2. 起動状態を確認する

```bash
curl http://localhost:9200/_cat/health?v
```

statusがgreenになっていればOK

3. indexをセット

```bash
curl http://localhost:9200/books -XPUT
curl http://localhost:9200/publishers -XPUT
curl http://localhost:9200/authors -XPUT
```