import AuthorModel from "./authorModel"
import PublisherModel from "./publisherModel"

export default class BookModel {
  private id: string
  private name!: string
  private subName!: string | null
  private content!: string | undefined
  private isbn!: string | undefined
  private ndc!: number | undefined
  private year!: number | undefined
  private author!: AuthorModel
  private publisher!: PublisherModel

  public constructor (
    id: string,
    name: string,
    subName: string | null,
    content: string | undefined,
    isbn: string | undefined,
    ndc: number | undefined,
    year: number | undefined,
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
    if (name === null) throw new Error('nameがnullです')
    this.name = name
  }

  get SubName (): string | null { return this.subName }
  set SubName (subName: string | null) { this.subName = subName }

  get Content (): string | undefined { return this.content }
  set Content (content: string | undefined) { this.content = content }

  get Isbn (): string | undefined { return this.isbn }
  set Isbn (isbn: string | undefined) {
    if (isbn === '') isbn = undefined
    if (isbn !== undefined && isbn.length < 10) throw new Error('ISBNの桁数が足りません' + isbn + ' ' + typeof isbn)
    this.isbn = isbn
  }

  get Ndc (): number | undefined { return this.ndc }
  set Ndc (ndc: number | undefined) {
    if (ndc !== undefined && ndc.toString().length < 1) throw new Error('NDCの桁数が足りません')
    this.ndc = ndc
  }

  get Year (): number | undefined { return this.year }
  set Year (year: number | undefined) {
    if (year !== undefined && year.toString().length < 4) throw new Error('年の桁数が足りません')
    this.year = year
  }

  get Author (): AuthorModel { return this.author }

  get Publisher (): PublisherModel { return this.publisher }
}
