import Cookies from 'js-cookie'
import { encryptStr, decryptStr } from './encrypt.js';

const TokenKey = 'Authorization'
const AutoLogin = "afe173fe49667e6c"
const ZyineLogin = "7f9a02a2c6264644"
const ZyinePwd = "c6026982d61c3ce0"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * 登录选项
 */
export function getAutoLogin(){
  const ckdata = Cookies.getJSON(AutoLogin)
  if(ckdata && ckdata[ZyineLogin] && ckdata[ZyinePwd]){
    return {
      userName : decryptStr(ckdata[ZyineLogin]),
      password : decryptStr(ckdata[ZyinePwd])
    }
  } else {
    return null
  }
}
export function setAutoLogin(data) {
  if(data && data.userName && data.password){
    const ckdata = {}
    ckdata[ZyineLogin] = encryptStr(data.userName)
    ckdata[ZyinePwd] = encryptStr(data.password)
    Cookies.set(AutoLogin, ckdata, { expires: 30 })
  } else {
    Cookies.remove(AutoLogin)
  }
}
export function cancelAutoLogin(){
  return Cookies.remove(AutoLogin)
}

// function encryptPwd(data){
//   if(data && data.userName && data.password){
//     const userName = data.userName
//     const password = data.password
//     //分成3段长度
//     var halfLength = userName.length / 2
//     var part1 = Math.floor(Math.random() * halfLength) + 1
//     var part2 = Math.floor(Math.random() * halfLength) + 1
//     var part3 = halfLength - part1 - part2
//     //三个随机位置
//     var pwdLength = password.length
//     var index1 = Math.floor(Math.random() * pwdLength)
//     var index2 = Math.floor(Math.random() * pwdLength)
//     var index3 = Math.floor(Math.random() * pwdLength)
//   }
// }
