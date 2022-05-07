# 問題の解決方法

## 1. docker-compose upしたら「exited with code 137」で終了した

特にelasticsearchで起こる問題です。

このコードはメモリ不足が原因ですので、docker Desktopからメモリの上限値を上げるようにしてください。私の開発では8GBにしてあります。

### 参考文献

[Memory不足でElasticSearchのDockerコンテナ立ち上げが「exited with code 137」で終了したときの対応方法](https://qiita.com/virtual_techX/items/50383184ff2e2e366e33)

## 2. 管理者ログインしようとしたらログ上に「Error: Could not obtain the administrator's id or pw.」と出た

サーバ側で出るエラーです。

このエラーはDB側に管理者用のIDとパスワードがないことが原因です。[この内容](./how-to-use.md)にある**3. 左側にある「hotate」 > 「admin」 をクリック**の部分まで進めてもらい(envファイルの下りはいらないです)、上側にある「表示」からidとpwが登録されているか確認してください。もしもidとpwがない状態でしたら、先ほどのドキュメントを参考に新しいIDとパスワードを登録してください。