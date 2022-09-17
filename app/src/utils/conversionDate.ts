import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

/**
 * Date型を`YYYY年MM月DD日 hh時mm分ss秒`の文字列型に変換します。なお自動的に0埋めも行います。
 *
 * @export
 * @param {Date} date 変換前の日付
 * @return {*}  {string} 変換後の文字列
 */
export default function conversionDate(date: Date): string {
  const res = dayjs(date).tz('Asia/Tokyo').format('YYYY年MM月DD日 HH時mm分ss秒');
  return res;
}
