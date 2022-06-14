# Change Log

hotateのnode上での変更等があった場合にこちらのファイルに記録します。

## Format

- Added : 新機能
- Changed : 既存機能の変更
- Deprecated : 今後のリリースで削除されるもの
- Removed : 今回のリリースで削除されたDeprecatedな機能
- Fixed : バグの修正
- Security : 脆弱性の関するもの
- Resolved : issueの解決など

## [Unreleased]

### Added

- 検索時に予測する機能

## Updated

- 管理機能の改良

## [0.0.1] - 2022-05-09

### Added

- このログファイル

### Changed

- typescriptからjavascript(commonjs)へのトランスコンパイルに用いるパッケージを`tsc`から`esbuild`へ変更
- 本番環境のビルドではminifyさせるように変更
- 開発環境のビルドではsourcemapを追加してデバッグを効率的にするように変更

## [0.0.1b] - 2022-05-09

### Changed

- 検索結果に表示する本のカードに画像を追加

## [0.0.2](https://github.com/booksearch-hotate/hotate-server/pull/10) - 2022-05-14

### Changed

- css、jsのパスの記述をejsに移行

### Added

- csvファイルのローディング画面の追加

## [0.0.2b](https://github.com/booksearch-hotate/hotate-server/pull/11) - 2022-05-14

### Changed

- csvデータの最大行数を5000行に設定

## [0.0.3](https://github.com/booksearch-hotate/hotate-server/pull/19) - 2022-05-20

### Changed

- bulk apiを用いたcsvファイルからのインプット時間を短縮(50%程度)
- ダウンロード画面を詳細に変更

## [0.0.4](https://github.com/booksearch-hotate/hotate-server/pull/21) - 2022-05-26

### Changed

- ロゴを背景透過仕様に変更
- パッケージのバージョンを更新
- デザインの微調整

### Added

- CodeQLの追加(github actions)

## [0.0.4b](https://github.com/booksearch-hotate/hotate-server/pull/23) - 2022-05-27

## Added

- CSRF対策の追加
- リクエスト回数の制限を追加

### Resolved

- [コード解析によるアラートの修正](https://github.com/booksearch-hotate/hotate-server/issues/22)の解決

## [0.0.6](https://github.com/booksearch-hotate/hotate-server/pull/36) - 2022-06-02

# v0.0.6

## Resolved

- 複数のissueを解決

## Changed

- デザインの修正

## Added

- タグ機能の追加
- タグ管理機能の作成
