import axios from "axios";

const url = "https://ndlsearch.ndl.go.jp/thumbnail/";

/**
 * ISBNに対応する本の画像データを[openBD](https://openbd.jp/)から取得します。
 *
 * ISBNによっては画像が見つからない場合もあります。
 * @param isbn ISBN
 * @returns 画像データ
 */
export async function getImgLink(isbn: string | null): Promise<string | null> {
  if (isbn === null) return null;
  try {
    const formatIsbn = isbn.replace(/-/g, "");

    if (formatIsbn.length !== 13 || isNaN(Number(formatIsbn))) return null;

    // 画像が見つからない（xml形式のデータが返ってくる）場合はエラーになるのでそれを利用する
    await axios.get(`${url}${formatIsbn}.jpg`);

    return `${url}${formatIsbn}.jpg`;
  } catch (e) {
    return null;
  }
}
