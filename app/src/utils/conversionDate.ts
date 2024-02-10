import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

type dateItem = "year" | "month" | "date" | "hour" | "minute" | "second";

/**
 * Date型を`YYYY年MM月DD日 hh時mm分ss秒`の文字列型に変換します。なお自動的に0埋めも行います。
 *
 * @export
 * @param {Date} date 変換前の日付
 * @return {*}  {string} 変換後の文字列
 */
export function conversionDateToString(date: Date, ignores: dateItem[] = []): string {
  let formatStr = "";

  if (ignores.indexOf("year") === -1) formatStr += "YYYY年";
  if (ignores.indexOf("month") === -1) formatStr += "MM月";
  if (ignores.indexOf("date") === -1) formatStr += "DD日";
  if (ignores.indexOf("hour") === -1) formatStr += "HH時";
  if (ignores.indexOf("minute") === -1) formatStr += "mm分";
  if (ignores.indexOf("second") === -1) formatStr += "ss秒";

  const res = dayjs(date).tz("Asia/Tokyo").format(formatStr);
  return res;
}

export function conversionStringToDate(dateString: string): Date {
  const formatString = "YYYY年MM月DD日 HH時mm分ss秒";
  const yearRange = [formatString.indexOf("Y"), formatString.lastIndexOf("Y") + 1];
  const monthRange = [formatString.indexOf("M"), formatString.lastIndexOf("M") + 1];
  const dateRange = [formatString.indexOf("D"), formatString.lastIndexOf("D") + 1];
  const hourRange = [formatString.indexOf("H"), formatString.lastIndexOf("H") + 1];
  const minuteRange = [formatString.indexOf("m"), formatString.lastIndexOf("m") + 1];
  const secondRange = [formatString.indexOf("s"), formatString.lastIndexOf("s") + 1];

  const year = dateString.substring(yearRange[0], yearRange[1]);
  const month = dateString.substring(monthRange[0], monthRange[1]);
  const date = dateString.substring(dateRange[0], dateRange[1]);
  const hour = dateString.substring(hourRange[0], hourRange[1]);
  const minute = dateString.substring(minuteRange[0], minuteRange[1]);
  const second = dateString.substring(secondRange[0], secondRange[1]);

  const res = new Date(Number(year), Number(month), Number(date), Number(hour), Number(minute), Number(second));

  return res;
}
