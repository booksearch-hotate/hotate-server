export default class PublisherModel {
  private id: string
  private name!: string

  public constructor (id: string, name: string) {
    if (id === null) throw new Error('idがnullです')

    this.id = id
    this.Name = name
  }

  get Id (): string { return this.id }

  get Name (): string { return this.name }
  set Name (name: string) {
    if (name === '') throw new Error('The name property of the publishers is an empty string.')
    this.name = name
  }
}
