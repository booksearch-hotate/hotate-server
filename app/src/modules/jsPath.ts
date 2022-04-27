export default class JsPathMake {
  private jsPathList: string[] // cssのpathを格納する配列
  private origin: string

  constructor (jsPath: string[] | string, origin: string) {
    this.jsPathList = []
    if (typeof jsPath === 'string') this.jsPathList.push(jsPath)
    else this.jsPathList = jsPath
    this.origin = origin
  }

  public make (): string[] {
    const res: string[] = []
    for (const jsPath of this.jsPathList) {
      const path = `${this.origin}/js/${jsPath}.js`
      res.push(path)
    }
    return res
  }
}
