import * as ZyineConstants from '@/common/ZyineConstants.js'
// import Utils from './utils.js'
// import DatetimeUtils from './datetimeUtils.js'

/**
 * validations.js
 * 字段有限性验证规则
 */
export default {
  //居民身份证-证件号码验证
  validateIdentityCardNo(value) {
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/; 
    return value && reg.test(value);
  },

  //手机号码验证
  validateMobilePhone(value) {
    var reg = /^((\(\d{3}\))|(\d{3}\-)|(\+?86)|(\(\+86\)))?1[0-9][0-9]\d{8}$/;
    return value && reg.test(value);
  },

  //固定电话
  //3-4位区号，7-8位直拨号码，1－4位分机号
  validatePhone(value) {
    var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/; 
    return value && reg.test(value);
  },
  
  //密码校验
  validatePassword(pwd){
    // var reg1 = /[!@#$%^&*()_?<>{}]{1}/;
    // var reg2 = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){8,18}/;
    if(pwd == undefined || pwd == null){
      return false
    }
    var reg1 = /([a-zA-Z0-9_]){8,16}/;//长度在8-16位
    var reg2 = /[_]+/;//需包含_字符
    var reg3 = /[a-zA-Z]+/;//需含有字母
    var reg4 = /[0-9]+/;//需含有数字
    return reg1.test(pwd) && reg2.test(pwd) && reg3.test(pwd) && reg4.test(pwd)
  },

  //日期的正则表达式
  validateDate(value) {
    var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return value && reg.test(value);
  },

}