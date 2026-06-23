import * as ZyineConstants from '@/common/ZyineConstants.js'
import Utils from './utils.js'
import DatetimeUtils from './datetimeUtils.js'

/**
 * 字典转义
 */
export default {
  //性别
  formatGender(value) {
    let list = ZyineConstants.get('GENDERS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    // console.log('gender:', value, targets, t);
    return t ? t.text : value;
  },

  //年龄单位
  formatAgeUnit(value){
    let list = ZyineConstants.get('AGE_UNITS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },
  formatAgeWithUnit(age, ageUnit){
    let unit = ''
    if(ageUnit){
      let list = ZyineConstants.get('AGE_UNITS');
      let t = Utils.getFirstElementByFilter(list, 'value', ageUnit);
      unit = t ? t.text : ageUnit
    }
    return (age ? age : '') + unit
  },

  //是否紧急
  formatUrgent(value){
    let list = ZyineConstants.get('URGENT_TYPES');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //患者来源类型
  formatPatientSource(value){
    let list = ZyineConstants.get('PATIENT_FROM_SOURCES');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  /**
   * 优先级
   * @param {*} value 
   */
  formatPriority(value){
    let list = ZyineConstants.get('STUDY_PRIORITIES');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //检查状态
  formatStudyStatus(value){
    let list = ZyineConstants.get('STUDY_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //检查报告状态
  formatStudyReportStatus(value){
    let list = ZyineConstants.get('STUDY_REPORT_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },
  
  //检查申请单上传状态
  formatApplyUploadStatus(value){
    if (!value){
      value = 'N'
    }
    let list = ZyineConstants.get('APPLY_UPLOAD_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //检查胶片领取状态
  formatFilmStatus(value){
    if (!value){
      value = 'N'
    }
    let list = ZyineConstants.get('FILM_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //检查云报告通知状态
  formatCloudReportStatus(value){
    if (!value){
      value = 'N'
    }
    let list = ZyineConstants.get('CLOUD_REPORT_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //日期时间字符串2018-06-08 15:30:28.0 格式化 至 2018-06-08 15:30
  formatDatetimeStr(dtStr){
    // console.log("formatDatetimeStr", dtStr, new Date(dtStr));
    if(Utils.isObjectBlank(dtStr)){
      return ''
    }
    return DatetimeUtils.formatDate(new Date(dtStr))
  },

  formatDateStr(dtStr){
    // console.log("formatDatetimeStr", dtStr, new Date(dtStr));
    if(Utils.isObjectBlank(dtStr)){
      return ''
    }
    return DatetimeUtils.formatDate(new Date(dtStr), 'yyyy-MM-dd')
  },

  //医院医生的在职状态
  formatDutyStatus(value){
    let list = ZyineConstants.get('DUTY_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },
  
  //系统用户状态
  formatUserStatus(value){
    let list = ZyineConstants.get('USER_ACCOUNT_STATUS');
    // console.log('USER_ACCOUNT_STATUS', list)
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //用户消息状态
  formatUserMessageStatus(value){
    let list = ZyineConstants.get('USER_MESSAGE_STATUS');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  //用户消息类型
  formatUserMessageType(value){
    let list = ZyineConstants.get('USER_MESSAGE_TYPES');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  /**
   * 角色类型
   * 医生/技师
   */
  formatMemberRoleTypes(value){
    let list = ZyineConstants.get('DOCTOR_ROLE_TYPE');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  formatHospitalType(value){
    let list = ZyineConstants.get('HOSPITAL_TYPE');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  formatHospitalLevel(value){
    let list = ZyineConstants.get('HOSPITAL_LEVEL');
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  /**
   * 设备使用状态
   */
  formatDeviceActiveStatus(value){
    let list = ZyineConstants.get('DEVICE_ACTIVE_STATUS')
    let t = Utils.getFirstElementByFilter(list, 'value', value);
    return t ? t.text : value
  },

  /**
   * 两位数货币
   */
  formatMoney(value){
    value = Number(value)
    if(isNaN(value)){
      value = 0
    }
    let num = parseFloat(value || 0)
    let t = num.toFixed(2)
    return t
  },
  
}