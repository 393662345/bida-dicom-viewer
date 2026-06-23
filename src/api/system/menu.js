import Ajax from '@/api/customajax'
import {API_BASE_URL, DEFAULT_APPS} from '@/config'

export default {

  getApplicationsByUserZid(userZid){
    const url = API_BASE_URL + '/application/findApplicationByUser/'+userZid
    return Ajax.post(url, {zid: userZid})
  },

  /**
   * 获取当前用户的菜单列表
   */
  getMenuTreeByCurrentUser(params) {
    const url = API_BASE_URL + '/menu/tree/by/user'
    return Ajax.query(url, params)
  },

  getMenuTreeByUserRoleApp(data){
    data = data || {}
    //系统默认应用
    if(data.appZid == DEFAULT_APPS.PERSONAL_CENTER){
      return new Promise((resolve, reject) => {
        let menus = [
          {zid: "my-basicInfo", name: "基本资料", router: "/my/center/info", displayIcon: "icon-jibenziliao"},
          {zid: "my-headicon", name: "头像设置", router: "/my/center/headicon", displayIcon: "icon-touxiangshezhi"},
          {zid: "my-signimage", name: "签名设置", router: "/my/center/signimage", displayIcon: "icon-qianmingshezhi"},
          {zid: "my-modifyPwd", name: "修改密码", router: "/my/center/pwd", displayIcon: "icon-mimaxiugai"},
        ];
        resolve({status: 200, data: {rows: menus}})
      })
    } else if(data.appZid == DEFAULT_APPS.MESSAGE_CENTER){
      return new Promise((resolve, reject) => {
        let menus = [
         {zid: "my-notice", name: "我的消息", router: "/my/notice", displayIcon: "icon-wodexiaoxi"},
        ];
        resolve({status: 200, data: {rows: menus}})
      })
    }
    const url = API_BASE_URL + '/menu/findMenuByUserRoleApp/' + data.userZid +'/' + data.roleZid +'/'+ data.appZid
    return Ajax.query(url, data)
  },

  /**
   * 根据ID获取菜单数据
   * @param {Object} params
   */
  queryMenuDatasByTopMenuId(params) {
    const url = API_BASE_URL + '/menu/tree/by/top/' + params.id
    return Ajax.query(url, {})
  },
  /**
   * 根据当前用户获取顶级菜单
  */
  getTopMenuByCurrentUser() {
    const url = API_BASE_URL + '/menu/top'
    return Ajax.query(url)
  },
  /**
   * 保存菜单数据
   *
   * @param {Object} [params={}]
   * @returns
   */
  saveMenuData(params = {}) {
    const url = API_BASE_URL +  '/menu/save/'
    return Ajax.post(url, params, false)
  },
  /**
   * 删除菜单
   *
   * @param {Object} [params={}]
   * @returns
   */
  delMenuData(params = {}) {
    const url = API_BASE_URL + '/menu/' + params.id
    return Ajax.post(url, params, false)
  },
  /**
   * 根据角色ＩＤ获取菜单列表
   *
   * @param {any} [params={}]
   * @returns
   */
  getMenusByRoleId(params = {}) {
    const url = API_BASE_URL + '/menu/by/role/' + params.id
    return Ajax.query(url, params)
  },
  /**
   * 获取所有菜单权限
   *
   * @returns
   */
  queryAllMenuTreeNodes() {
    const url = API_BASE_URL + '/menu/tree/all'
    return Ajax.query(url)
  }
}
