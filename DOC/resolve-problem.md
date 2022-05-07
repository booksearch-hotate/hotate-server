# 問題の解決方法

## 1. docker-compose upしたら「exited with code 137」で終了した

特にelasticsearchで起こる問題です。

このコードはメモリ不足が原因ですので、docker Desktopからメモリの上限値を上げるようにしてください。私の開発では8GBにしてあります。

### 参考文献

[Memory不足でElasticSearchのDockerコンテナ立ち上げが「exited with code 137」で終了したときの対応方法](https://qiita.com/virtual_techX/items/50383184ff2e2e366e33)

## 2. 管理者ログインしようとしたらログ上に「Error: Could not obtain the administrator's id or pw.」と出た

サーバ側で出るエラーです。

このエラーはDB側に管理者用のIDとパスワードがないことが原因です。[この内容](./how-to-use.md)にある**3. 左側にある「hotate」 > 「admin」 をクリック**の部分まで進めてもらい(envファイルの下りはいらないです)、上側にある「表示」からidとpwが登録されているか確認してください。もしもidとpwがない状態でしたら、先ほどのドキュメントを参考に新しいIDとパスワードを登録してください。

## 3. csvファイルの「ヘッダーを選択」のところでエッグい文字化けが出てくる

これはcsvファイル側の問題です。文字コードがutf8とかそれっぽいの以外の時に発生します。

解決策はcsvファイルをutf8にすることです。[Excel CSV形式ファイルにおける今どきUTF-8文字コード問題の傾向と対策](https://atmarkit.itmedia.co.jp/ait/articles/2112/20/news026.html)の「文字コードをUTF-8にして保存する」>「Excel 2016以降の場合」を参考にするなどしてutf8に変換してください。

## 4. csvファイルを追加しようとしたらログ上に「Error: The name property of books(authors又はpublishers) is empty.」と出た

これはcsvファイルのデータの欠損が問題です。`The name property of books is empty.`と出てる場合は本の題名が、`The name property of authors is empty.`とでてる場合は著者名が、`The name property of publishers is empty.`と出てる場合は出版社名が欠落しています。

欠落したデータを修復するか、そのデータを削除するかして対処してください。