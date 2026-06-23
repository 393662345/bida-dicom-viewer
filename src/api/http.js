/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
// import store from '@/store/index'
import router from '@/router/index'
// import ZyineLogout from "@/common/ZyineLogout.js";
import { getToken } from '@/utils/authService'
// import * as types from '../store/modules/login'
// import NProgress from 'nprogress'

const CancelToken = axios.CancelToken;
const cancelSource = CancelToken.source();
const cancelMessage = 'Axios Request Canceled By VUE. @ZYINE.COM.';
cancelSource.cancel(cancelMessage);
let _cancelCount = 0

let reloginFunc = () => {
  // ZyineLogout.clearStore()
  // if(router.currentRoute.path != '/login'){
  //   router.replace({
  //     path: '/login',
  //     query: {
  //       redirect: router.currentRoute.fullPath
  //     }
  //   })
  // }
}
//无需携带
const freeAuthorityURLs = [
  '/pacs-auth/jwt/tokenVC', //登录请求
  '/pacs-auth/jwt/refresh',
]

// axios 配置
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;
// axios.defaults.headers.common['Authorization'] = 'token';
// axios.defaults.headers.post['Content-Type']  = "application/json";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// var csrftoken = window.document.cookie.get('csrftoken');
// axios.defaults.headers.common['HTTP_X_CSRFTOKEN'] = csrftoken;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.login.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    //   config.headers.token = `${store.state.login.token}`
    // }
    // let token = getToken()
    // if(token && token.length > 0){
    //   config.headers.common['Authorization'] = token
    // } else {
    //   if(freeAuthorityURLs.indexOf(config.url) < 0){
    //     config.cancelToken = cancelSource.token
    //     console.log('### ' + cancelMessage, router.currentRoute)
    //     if(_cancelCount == 0){
    //       _cancelCount++
    //       alert('登录超时，请重新登录！')
    //       //重新登录
    //       setTimeout(function(){
    //         if(router.currentRoute.path != '/login'){
    //           reloginFunc()
    //         }
    //       }, 10)
    //     }
    //   }
    // }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    _cancelCount = 0
    // NProgress.done();
    // console.log("response.use : ", response);
    if(response && response.headers && response.headers['content-type'] == 'image/jpeg'){
      //验证码图片
      return response
    }
    if(response && response.data && response.data.status != '500'){
      return response.data
    } else {
      // router.push({path: '/500'})
      // return {status : 500}
      // alert("500:服务器错误")
      return response ? response.data : {status : 500}
    }
  },
  error => {
    if (error.response && false) {
      // if (error.response.data && error.response.data.errorCode && error.response.data.errorCode == "00002") {
      //   window.location = "/" ;
      // }
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          reloginFunc()
          break
        case 403:
          router.push({path: '/403'})
        case 500:
          router.push({path: '/500'})
      }
    }
    // 返回接口返回的错误信息
    return Promise.reject(error.response) // 返回接口返回的错误信息
  }
);

export default axios;
