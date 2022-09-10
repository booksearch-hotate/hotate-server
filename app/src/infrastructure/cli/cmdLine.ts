const cmdList = process.argv.slice(2);

/**
 * コマンドラインに`local`が含まれているかを取得します。
 *
 * @returns localが含まれているか
 */
export function isLocal() {
  for (const cmd of process.argv) if (cmd.slice(-4) === 'jest') return true;
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
