import StateItem from './item';

export default class State {
  private items: StateItem[] = [];

  /**
   * 状態を追加
   * @param key キー値
   * @param value 内容
   */
  public add(key: string, value: any): void {
    if (this.get(key) !== null) return;

    this.items.push(new StateItem(key, value));
  }

  /**
   * 状態を取得
   * @param key キー値
   * @returns 内容
   */
  public get(key: string): any {
    const item = this.items.find((item) => item.Key === key);

    if (item === undefined) return null;
    return item.Value;
  }

  /**
   * キー値に対応する状態の内容を更新
   * @param key キー値
   * @param value 変更する内容
   * @returns 成功したか
   */
  public update(key: string, value: any): boolean {
    const item = this.items.find((item) => item.Key === key);

    if (item === undefined) return false;
    item.Value = value;
    return true;
  }

  /**
   * キー値に対応する状態を削除
   * @param key キー値
   * @returns 成功したか
   */
  public delete(key: string): boolean {
    const index = this.items.findIndex((item) => item.Key === key);

    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
