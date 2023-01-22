
/**
  * elasticsearchに関するエラーの際にthrowされるべきエラークラス
  */
export class ElasticsearchError extends Error {};

/**
 * esに関するbulk apiのエラーの際にthrowされるべきクラス
 */
export class EsBulkApiError extends ElasticsearchError {};
