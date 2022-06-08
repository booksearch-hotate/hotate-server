```mermaid
erDiagram

publishers ||--|{books: "1:n"
authors ||--|{books: "1:n"

books {
  varchar id
  varchar isbn
  varchar book_name
  varchar book_sub_name
  int ndc
  int year
  text book_content
  varchar author_id
  varchar publisher_id
}

publishers {
  varchar id
  varchar name
}

authors {
  varchar id
  varchar name
}
```
