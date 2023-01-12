export type bookApplicationErrorStatusCode =
    1001 | // 本の登録作業に失敗したため、ロールバックし、成功したエラー
    1002 | // 本の登録作業と、そのロールバックに失敗したエラー
    1000 // 本の登録作業に、dbやes以外のエラーが発生した場合のエラー
;
