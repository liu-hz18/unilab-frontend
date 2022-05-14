export const HTTP_STATUS_NORMAL_CODE = {
  SUCCESS: 200, // 操作成功
  CREATED: 201, // 对象创建成功
  ACCEPTED: 202, // 请求已经被接受
  NO_CONTENT: 204, // 操作已经执行成功，但是没有返回数据
};

export const HTTP_STATUS_ERROR_CODE = {
  MOVED_PERM: 301, // 资源已被移除
  SEE_OTHER: 303, // 重定向
  NOT_MODIFIED: 304, // 资源没有被修改
  BAD_REQUEST: 400, // 参数列表错误（缺少，格式不匹配）
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403, // 访问受限，授权过期
  NOT_FOUND: 404, // 资源，服务未找到
  BAD_METHOD: 405, // 不允许的http方法
  Not_Acceptable: 406, // 服务器无法根据客户端请求的内容特性完成请求
  Proxy_Authentication_Required: 407, // 请求要求代理的身份认证，与401类似，但请求者应当使用代理进行授权
  Request_TimeOut: 408, // 服务器等待客户端发送的请求时间过长，超时
  CONFLICT: 409, // 服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突
  Gone: 410, // 客户端请求的资源已经不存在。410不同于404，如果资源以前有现在被永久删除了可使用410代码，网站设计人员可通过301代码指定资源的新位置
  Length_Required: 411, // 服务器无法处理客户端发送的不带Content-Length的请求信息
  Precondition_Failed: 412, // 客户端请求信息的先决条件错误
  Request_Entity_Too_Large: 413, // 由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个Retry-After的响应信息
  Request_URI_Too_Large: 414, // 请求的URI过长（URI通常为网址），服务器无法处理
  UNSUPPORTED_TYPE: 415, // 服务器无法处理请求附带的媒体格式
  Requested_range_not_satisfiable: 416, // 客户端请求的范围无效
  Expectation_Failed: 417, // 服务器无法满足Expect的请求头信息
  ERROR: 500, // 系统内部错误
  NOT_IMPLEMENTED: 501, // 接口未实现
  Bad_Gateway: 502, // 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应
  Service_Unavailable: 503, // 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中
  Gateway_Time_out: 504, // 充当网关或代理的服务器，未及时从远端服务器获取请求
  HTTP_Version_not_supported: 505, // 服务器不支持请求的HTTP协议的版本，无法完成处理
};

export const AXIOS_RESPONSE_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  INVALID_PARAMS: 400,

  ERROR_EXIST_TAG: 10001,
  ERROR_EXIST_TAG_FAIL: 10002,
  ERROR_NOT_EXIST_TAG: 10003,
  ERROR_GET_TAGS_FAIL: 10004,
  ERROR_COUNT_TAG_FAIL: 10005,
  ERROR_ADD_TAG_FAIL: 10006,
  ERROR_EDIT_TAG_FAIL: 10007,
  ERROR_DELETE_TAG_FAIL: 10008,
  ERROR_EXPORT_TAG_FAIL: 10009,
  ERROR_IMPORT_TAG_FAIL: 10010,

  ERROR_NOT_EXIST_ARTICLE: 10011,
  ERROR_CHECK_EXIST_ARTICLE_FAIL: 10012,
  ERROR_ADD_ARTICLE_FAIL: 10013,
  ERROR_DELETE_ARTICLE_FAIL: 10014,
  ERROR_EDIT_ARTICLE_FAIL: 10015,
  ERROR_COUNT_ARTICLE_FAIL: 10016,
  ERROR_GET_ARTICLES_FAIL: 10017,
  ERROR_GET_ARTICLE_FAIL: 10018,
  ERROR_GEN_ARTICLE_POSTER_FAIL: 10019,

  ERROR_AUTH_CHECK_TOKEN_FAIL: 20001,
  ERROR_AUTH_CHECK_TOKEN_TIMEOUT: 20002,
  ERROR_AUTH_TOKEN: 20003,
  ERROR_AUTH: 20004,
  ERROR_AUTH_USER_PERMISSIONS: 20005,

  ERROR_UPLOAD_SAVE_IMAGE_FAIL: 30001,
  ERROR_UPLOAD_CHECK_IMAGE_FAIL: 30002,
  ERROR_UPLOAD_CHECK_IMAGE_FORMAT: 30003,
};
