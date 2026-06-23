import Ajax from '@/api/customajax'
import {API_BASE_URL } from '@/config'


export default {
  /**
   * 删除用户角色关系
   *
   * @param {any} params
   * @returns
   */
  delRoleAndUserRelationship(params) {
    const url = API_BASE_URL +'/userAndRole/' + params.id
    return Ajax.post(url, params, false)
  },
  /**
   * 分配用户给role
   *
   * @param {any} params
   * @returns
   */
  signUserToRole(params) {
    const url = API_BASE_URL + '/userAndRole/save'
    // userId ,roleId
    return Ajax.post(url, params)
  },
  /**
   * 删除据说数据
   *
   * @param {any} [params={}]
   * @returns
   */
  delRoleData(params = {}) {
    const url = API_BASE_URL + '/role/' + params.id
    return Ajax.post(url, params, false)
  },
  /**
   * 赋予菜单的权限
   *
   * @param {any} params
   * @returns
   */
  signMenuToRole(params) {
    const url =API_BASE_URL + '/roleAndMenu/save'
    return Ajax.post(url, params, false)
  },
  /**
   * 取消该权限的分配
   *
   * @param {any} params
   * @returns
   */
  delRoleMenu(params) {
    const url = API_BASE_URL + '/roleAndMenu/' + params.id
    return Ajax.post(url, params, false)
  },
  /**
   * 保存角色数据
   *
   * @param {any} [params={}]
   * @returns
   */
  saveRoleData(params = {}) {
    const url =API_BASE_URL + '/role/save/'
    return Ajax.post(url, params, false)
  },
  /**
   * 查询出所有的角色
   */
  queryRoleDatas() {
    const url = API_BASE_URL + '/role/all'
    return Ajax.query(url)
  },
  /**
   *  该角色所可分配的用户
   * @param {*} params
   */
  queryAvailableUserDatasByRole(params = {}) {
    const url = API_BASE_URL + '/user/available/' + params.id
    return Ajax.query(url, params)
  },


  /**
   * 查询用户在应用中的多个角色
   * @param {*} params 
   */
  findAppRolesOfUser(params = {}) {
    const url = API_BASE_URL + '/role/findRoleByUserAndApp/' + params.userZid +'/'+ params.appZid
    return Ajax.query(url, params)
  },
}
