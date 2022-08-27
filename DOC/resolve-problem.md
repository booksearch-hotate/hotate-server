# 問題の解決方法

## 1. docker-compose upしたら「exited with code 137」で終了した

特にelasticsearchで起こる問題です。

このコードはメモリ不足が原因ですので、docker Desktopからメモリの上限値を上げるようにしてください。
私の開発では8GBにしてあります。

### 参考文献

[Memory不足でElasticSearchのDockerコンテナ立ち上げが「exited with code 137」で終了したときの対応方法](https://qiita.com/virtual_techX/items/50383184ff2e2e366e33)

## 2. 管理者ログインしようとしたらログ上に「Error: Could not obtain the administrator's id or pw.」と出た

サーバ側で出るエラーです。

このエラーはDB側に管理者用のIDとパスワードがないことが原因です。
[使い方](./how-to-use.md)を参考にしてください。

## 3. csvファイルの「ヘッダーを選択」の時に表示される文字が文字化けを起こしており文字が読めない

これはcsvファイル側の問題です。文字コードがutf8以外の場合に発生します。

解決策はcsvファイルをutf8にすることです。
[Excel CSV形式ファイルにおける今どきUTF-8文字コード問題の傾向と対策](https://atmarkit.itmedia.co.jp/ait/articles/2112/20/news026.html)を参考にするなどしてutf8に変換してください。

## 4. csvファイルを追加した際「Error: The name property of books(authors又はpublishers) is empty.」と出た

これはcsvファイルのデータの欠損が問題です。
`The name property of books is empty.`と出てる場合は本の題名が、
`The name property of authors is empty.`とでてる場合は著者名が、
`The name property of publishers is empty.`と出てる場合は出版社名が欠落しています。

### 追記(2022/05/09)

著者名並びに出版社名が無記入である場合があるとのことなので、名前がなしでも動作するようにしました。
しかし現段階ではまだ正確な動作ができているか未検証です。

欠落したデータを修復するか、そのデータを削除するかして対処してください。

## 5. csvファイルを追加した際「Error: csv file is too large. max lengh is 5000 but now is {データ件数}」と出た

これはcsvファイルのデータ件数が5000件を超えると発生します。

1つあたりのcsvファイルのデータ件数を5000件以内に収めてください。

## 6. 検索履歴を削除しても反映されない

これはElasticsearchの設定上による問題です。
ElasticsearchはNRT(**ほぼ**リアルタイム)となっています。そのため、データの削除・更新はすぐに反映されません。
`v0.2.2`からは削除の際に意図的に1秒程度のクールタイムを設けることでデータを反映させるようにしています。
しかし通信環境、端末の能力によってはデータが反映されない場合もあります。

反映されない場合、再度読み込みを行ってください。

## 7. 特定のURLで「ForbiddenError: invalid csrf token」と出力される

これはCSRF対策によってアクセスが弾かれた例です。

CSRFとは、攻撃用のサイトから攻撃対象のサーバへ不正な値を送信することを指します。

この攻撃を防ぐため、いくつかの箇所にトークンによる対策をおこなっています。このトークンを改竄するとエラーが出力される仕組みです。

基本的にこのエラーは正しく使用していれば出力されないのでプログラムのバグの可能性が高いです。

## 8. アプリ起動時に「Initialization failed.」と表示され、Elasticsearchが起動していない旨が出てくる

これはElasticsearchが起動してないときに発生するエラーです。

Elasticsearchは起動に時間がかかりますので、しばらくしてからもう一度起動してみてください。

## 9. csvから本を追加する際に「Error: The title of the book is null.」と表示される

これはcsvファイルの書名が正しく入力されていない場合に発生します。

書名が全て正しく入力されているかお確かめください。
