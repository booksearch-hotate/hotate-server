export interface ICsvFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFileContent (): Promise<any>
  deleteFiles (): void
  getHeaderNames (): Promise<string[]>
}
