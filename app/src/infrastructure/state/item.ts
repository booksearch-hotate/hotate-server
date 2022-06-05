export default class StateItem {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }

  get Key(): string {
    return this.key;
  }

  get Value(): any {
    return this.value;
  }

  set Value(value: any) {
    this.value = value;
  }
}
