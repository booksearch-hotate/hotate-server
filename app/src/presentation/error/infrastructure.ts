/**
 * インメモリで動作しているDBに関するエラーの際にthrowされるべきエラークラス
 *
 * @export
 * @class InMemoryDBError
 * @extends {Error}
 */
export class InMemoryDBError extends Error {};

/**
  * MySQLに関するエラーの際にthrowされるべきエラークラス
  */
export class MySQLDBError extends Error {};
