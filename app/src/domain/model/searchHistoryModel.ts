export default class SearchHistoryModel {
  private words: string;
  private id: string;

  public constructor(id:string, words: string) {
    if (words === undefined) throw new Error('wordsが不明です.');
    if (id === undefined) throw new Error('idが不明です.');

    this.words = words;
    this.id = id;
  }

  get Words(): string {
    return this.words;
  }

  get Id(): string {
    return this.id;
  }
}
