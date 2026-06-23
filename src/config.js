export const TECHNICIAN_SYSTEM_CODE = 1;
export const DOCTOR_SYSTEM_CODE = 2;
export const API_TIMEOUT = 60000;
export const COOKIE_DOMAIN = (process.env.NODE_ENV === 'production') ? 'com.zyine.pacs' : 'com.zyine.pacs'
export const API_BASE_URL = (process.env.NODE_ENV === 'production') ? "/pacs-auth" : "/pacs-auth";
export const API_PACSMAIN_URL =(process.env.NODE_ENV === 'production') ? "/pacs-main" : "/pacs-main";
export const API_PICTURE_URL = (process.env.NODE_ENV === 'production') ? "/picture" : "/picture";
export const STATIC_PATH = (process.env.NODE_ENV === 'production') ? "./static/" : "/static/";
export const WEBSOCKET_BASE_URL = (process.env.NODE_ENV === 'production') ? "wss://ics.zyine.com/pacs-main/websocket/" : "wss://ics.zyine.com/pacs-main/websocket/";
//系统默认应用
export const DEFAULT_HOME_PAGE = '/home/user' //系统首页
export const DEFAULT_APPS = {
  PERSONAL_CENTER: 'app_per',//个人中心
  MESSAGE_CENTER: 'app_msg',//我的消息
}