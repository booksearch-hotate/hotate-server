# MySqlの構成

## books

| フィールド名 | 内容 |
| :---: | :---: |
| id | 一意な値。主キー |
| isbn | ISBN。ない場合もあるのでNULLを許容 |
| book_name | 本の名称 |
| book_sub_name | 副題？ |
| author_name | 著者名 |
| ndc | 日本十進分類法 |
| publisher_name | 出版社 |
| year | 出版年 |
| book_content | 内容紹介 |
