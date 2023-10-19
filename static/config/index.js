/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8090/pcm';
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.230:8090/pcm';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.10.190:8090/optical-cable';
  // websocket地址
  window.SITE_CONFIG['websocketUrl'] = '127.0.0.1:8010';
  // window.SITE_CONFIG["websocketUrl"] = "192.168.10.230:8010";

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = '.'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();


