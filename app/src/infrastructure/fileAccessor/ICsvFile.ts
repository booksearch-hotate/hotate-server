export default interface ICsvFile {
  getFileContent (): Promise<any>
  deleteFiles (): void
  getHeaderNames (): Promise<string[]>
}
