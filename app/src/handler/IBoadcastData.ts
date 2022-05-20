/**
 * 進捗情報を送信するインターフェース
 */
export interface IProgressObj {
  current: number,
  total: number,
}

export interface IBroadcastData {
  progress: string,
  data: IProgressObj
}
