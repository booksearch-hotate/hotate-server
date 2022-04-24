export default class CssPathMake {
  private cssPathList: string[] // cssのpathを格納する配列
  private origin: string

  constructor (cssPath: string[] | string, origin: string) {
    this.cssPathList = []
    if (typeof cssPath === 'string') this.cssPathList.push(cssPath)
    else this.cssPathList = cssPath
    this.origin = origin
  }

  public make (): string[] {
    const res: string[] = []
    for (const cssPath of this.cssPathList) {
      const path = `${this.origin}/css/${cssPath}.css`
      res.push(path)
    }
    return res
  }
}
