/**
 * Date型を`YYYY年MM月DD日 hh時mm分ss秒`の文字列型に変換します。なお自動的に0埋めも行います。
 *
 * @export
 * @param {Date} date 変換前の日付
 * @return {*}  {string} 変換後の文字列
 */
export default function conversionDate(date: Date): string {
  const year = date.getFullYear();
  // 月だけ+1すること
  const month = 1 + date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const yearStr = String(year);
  const monthStr = (`0${month}`).slice(-2);
  const dayStr = (`0${day}`).slice(-2);
  const hourStr = (`0${hour}`).slice(-2);
  const minuteStr = (`0${minute}`).slice(-2);
  const secondStr = (`0${second}`).slice(-2);

  const res = `${yearStr}年${monthStr}月${dayStr}日 ${hourStr}時${minuteStr}分${secondStr}秒`;

  return res;
}
