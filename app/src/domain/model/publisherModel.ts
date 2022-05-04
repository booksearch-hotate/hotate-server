export default class PublisherModel {
  private id: number
  private name!: string

  public constructor (id: number, name: string) {
    if (id === null) throw new Error('idがnullです')

    this.id = id
    this.Name = name
  }

  get Id (): number { return this.id }

  get Name (): string { return this.name }
  set Name (name: string) {
    if (name === null) throw new Error('nameがnullです')
    this.name = name
  }
}
