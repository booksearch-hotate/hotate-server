const cmdList = process.argv.slice(2);

/**
 * コマンドラインに`local`が含まれているかを取得します。
 *
 * @returns localが含まれているか
 */
export function isLocal() {
  return cmdList.includes('local');
}

/**
 * コマンドラインに`output-log`が含まれているかを取得します。
 *
 * @returns output-logが含まれているか
 */
export function isLogOutput() {
  return cmdList.includes('output-log');
}
