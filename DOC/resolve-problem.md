# 問題の解決方法

## 1. docker-compose upしたら「exited with code 137」で終了した

特にelasticsearchで起こる問題です。

このコードはメモリ不足が原因ですので、docker Desktopからメモリの上限値を上げるようにしてください。私の開発では8GBにしてあります。

### 参考文献

[Memory不足でElasticSearchのDockerコンテナ立ち上げが「exited with code 137」で終了したときの対応方法](https://qiita.com/virtual_techX/items/50383184ff2e2e366e33)
