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
 * アプリケーションのサービスに異常が発生した時にthrowされるべきエラークラス
 *
 * @export
 * @class ApplicationServiceError
 * @extends {Error}
 */
export class ApplicationServiceError extends Error {};

/**
 * インフラに関するエラーの際にthrowされるべきエラークラス
 *
 * @export
 * @class InfrastructureError
 * @extends {Error}
 */
export class InfrastructureError extends Error {};

/**
 * データ形式が正しくない場合にthrowされるべきエラークラス
 *
 * @export
 * @class InvalidDataTypeError
 * @extends {Error}
 */
export class InvalidDataTypeError extends Error {};


/**
 * データが既定の数をオーバーしている場合にthrowされるべきエラークラス
 *
 * @export
 * @class OverflowDataError
 * @extends {Error}
 */
export class OverflowDataError extends Error {};


/**
 * データがNULLもしくはemptyである場合にthrowされるべきエラークラス
 *
 * @export
 * @class NullDataError
 * @extends {Error}
 */
export class NullDataError extends Error {};

/**
 * アクセスが不正である場合にthrowされるべきエラークラス
 *
 * @export
 * @class InvalidAccessError
 * @extends {Error}
 */
export class InvalidAccessError extends Error {};
