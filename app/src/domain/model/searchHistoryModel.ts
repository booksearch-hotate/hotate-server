export default class SearchHistoryModel {
  private words: string;

  public constructor(words: string) {
    if (words === undefined) throw new Error('wordsが不明です.');

    this.words = words;
  }

  get Words(): string {
    return this.words;
  }
}
