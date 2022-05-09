import AuthorModel from "./authorModel"
import PublisherModel from "./publisherModel"

export default class BookModel {
  private id: string
  private name!: string
  private subName!: string | null
  private content!: string | null
  private isbn!: string | null
  private ndc!: number | null
  private year!: number | null
  private author!: AuthorModel
  private publisher!: PublisherModel

  public constructor (
    id: string,
    name: string,
    subName: string | null,
    content: string | null,
    isbn: string | null,
    ndc: number | null,
    year: number | null,
    author: AuthorModel,
    publisher: PublisherModel
  ) {
    if (id === null) throw new Error('idがnullです')

    this.id = id
    this.Name = name
    this.SubName = subName
    this.Content = content
    this.Isbn = isbn
    this.Ndc = ndc
    this.Year = year

    this.author = author
    this.publisher = publisher
  }

  get Id (): string { return this.id }

  get Name (): string { return this.name }
  set Name (name: string) {
    if (name === '') throw new Error('The name property of books is empty.')
    this.name = name
  }

  get SubName (): string | null { return this.subName }
  set SubName (subName: string | null) { this.subName = subName }

  get Content (): string | null { return this.content }
  set Content (content: string | null) { this.content = content }

  get Isbn (): string | null { return this.isbn }
  set Isbn (isbn: string | null) {
    if (isbn === '') isbn = null
    if (isbn !== null && isbn.length < 10) throw new Error('ISBNの桁数が足りません' + isbn + ' ' + typeof isbn)
    // もしもisbnが13桁でハイフンがない場合はハイフンを追加する
    if (isbn !== null && isbn.length === 13 && isbn.indexOf('-') === -1) {
      const firstNum = isbn.substring(0, 3)
      const contryCode = isbn.substring(3, 4)
      const publisherNum = isbn.substring(4, 8)
      const bookNum = isbn.substring(8, 12)
      const checkDigit = isbn.substring(12, 13)
      this.isbn = `${firstNum}-${contryCode}-${publisherNum}-${bookNum}-${checkDigit}`
    } else {
      this.isbn = isbn
    }
  }

  get Ndc (): number | null { return this.ndc }
  set Ndc (ndc: number | null) {
    if (ndc !== null && ndc.toString().length < 1) throw new Error('NDCの桁数が足りません')
    this.ndc = ndc
  }

  get Year (): number | null { return this.year }
  set Year (year: number | null) {
    if (year !== null && year.toString().length < 4) throw new Error('年の桁数が足りません')
    this.year = year
  }

  get Author (): AuthorModel { return this.author }

  get Publisher (): PublisherModel { return this.publisher }
}
