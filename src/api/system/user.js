import Ajax from '@/api/customajax'
import {API_BASE_URL} from '@/config'

export default {
  /**
   * 登陆
   * @param {Object} params
   */
  userLogin(params) {
    const url = API_BASE_URL + '/jwt/tokenVC'
    return Ajax.post(url, params)
  },

  userLoginByToken(params) {
    const url = API_BASE_URL + '/jwt/verify/token'
    return Ajax.post(url, params)
  },

  getVerifyCode(){
    const url = API_BASE_URL + '/jwt/getVerifyCode?_='+Math.random()
    // return Ajax.query(url, {}
    return url
  },

  refreshVerifyCode(){
    const url = API_BASE_URL + '/jwt/refreshVerifyCode?_='+Math.random()
    // return Ajax.query(url, {})
    return url
  },

  /**
   * 注销登陆
   */
  userLogout() {
    const url =API_BASE_URL + '/jwt/refresh'
    return Ajax.post(url)
  },
  /**
   * 该角色所拥有的用户
   *
   * @param {any} [params={}]
   * @param {number} [pageIndex=1]
   * @param {number} [pageSize=10]
   * @returns
   */
  queryExistUserDatasByRole(params = {}, pageIndex = 1, pageSize = 10) {
    const url =API_BASE_URL + '/user/exist/' + params.id
    return Ajax.query(url, params)
  },
  /**
   *  该角色所可分配的用户
   * @param {*} params
   */
  queryAvailableUserDatasByRole(params = {}) {
    const url =API_BASE_URL + '/user/available/' + params.id
    return Ajax.query(url, params)
  },
  /**
   * 获取当前登陆用户信息
   *
   * @returns
   */
  queryCurrentUser() {
    const url = API_BASE_URL + '/author/get/current/user'
    return Ajax.query(url)
  },

  /**
   * 分页查询所有用户
   * @param {Object} params
   * @param {Number} pageIndex
   * @param {Number} pageSize
   */
  pageQueryUserData(params = {}, pageIndex = 1, pageSize = 10) {
    const url = API_BASE_URL + '/user/page/query/' + pageIndex + '/' + pageSize
    return Ajax.query(url, params)
  },

  /**
   * 重置密码
   * @param {Object} params
   */
  resetUserPwd(params) {
    const url = API_BASE_URL + '/user/resetpw'
    return Ajax.post(url, params)
  },

  /**
   * 根据用户id 删除 用户
   * @param {Object} params
   */
  delUserData(params) {
    const url =API_BASE_URL + '/user/' + params.id
    return Ajax.post(url, params, false)
  },

  /**
   * 查询所有用户
   */
  listAll() {
    const url = API_BASE_URL + '/user/all'
    return Ajax.query(url)
  }
 


}
