/**
 * Formの値が正しく入力されていない場合にthrowされるべきエラークラス
 *
 * @export
 * @class FormInvalidError
 * @extends {Error}
 */
export class FormInvalidError extends Error {};

/**
 * ドメインモデル内でルールに反する処理が行われたときにthrowされるべきエラークラス
 *
 * @export
 * @class DomainInvalidError
 * @extends {Error}
 */
export class DomainInvalidError extends Error {};

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

/**
 * インフラに関するエラーの際にthrowされるべきエラークラス
 *
 * @export
 * @class InfrastructureError
 * @extends {Error}
 */
export class InfrastructureError extends Error {};
