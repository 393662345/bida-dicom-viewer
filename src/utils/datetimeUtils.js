/**
 * datetimeUtils.js
 * 日期时间工具类
 */
import Validations from './validations.js'

export const DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd hh:mm:ss";
export const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

export default {
  format(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S":  date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },

  /**
   * 日期格式化
   * yyyy-MM-dd hh:mm:ss
   * @param {*} date 
   */
  formatDate(date, format = DEFAULT_DATETIME_FORMAT) {
    // console.log('formatDate 1 formatDate', date)
    if(date){
      if(date instanceof Date){
        return this.format(date, format);
      } else if(date instanceof String || 'string' == typeof date){
        try {
          return this.format(new Date(date), format);
        } catch (error) {
          console.error('###formatDate error:', error)
          return null
        }
      }
    }
    return null
  },

  /**
   * 取得时间区间的最小时间
   * @param {*} dateRange 
   */
  getBeginDatetimeOfRange(dateRange){
    if(dateRange){
      if(dateRange instanceof Array){
        let beginDatetime = null
        dateRange.forEach(function(item) {
          beginDatetime = beginDatetime == null || item < beginDatetime ? item : beginDatetime
        });
        return this.getFirstSecondOfDate(beginDatetime)
      } else {
        return this.getFirstSecondOfDate(dateRange)
      }
    }
    return null
  },
  /**
   * 取得时间区间的最大时间
   * @param {*} dateRange 
   */
  getEndDatetimeOfRange(dateRange){
    if(dateRange){
      if(dateRange instanceof Array){
        let endDatetime = null
        dateRange.forEach(function(item) {
          endDatetime = endDatetime == null || item > endDatetime ? item : endDatetime
        });
        return this.getLastSecondOfDate(endDatetime)
      } else {
        return this.getLastSecondOfDate(dateRange)
      }
    }
    return null
  },

  /**
   * 取得某天的最早一秒
   * @param {*} date 
   */
  getFirstSecondOfDate(date){
    let fmt = this.format(date, DEFAULT_DATE_FORMAT);
    return fmt ? fmt + " 00:00:00" : null
  },
  /**
   * 取得某天的最后一秒
   * @param {*} date 
   */
  getLastSecondOfDate(date){
    let fmt = this.format(date, DEFAULT_DATE_FORMAT);
    return fmt ? fmt + " 23:59:59" : null
  },

  //liz
  getFirstDayOfTriduum(date){
    var day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3);
  },

  getFirstDayOfWeek (date) {
    var day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
  },

  getFirstDayOfMonth (date) {
    var day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  getFirstDayOfYear (date) {
    var day = date.getDay() || 7;
    return new Date(date.getFullYear(), 0, 1);
  },

  getFirstDayOfAll(date){
    var day = date.getDay() ||7;
    return new Date(date.getFullYear() - 10, 0, 1);
  },

  getFirstDayOfDefault(date){
    var day = date.getDay() ||7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
  },
  // getLocaleDateFromUTCDate(UTCDate){
  //   if(UTCDate && UTCDate instanceof Date){
  //     var offset = new Date().getTimezoneOffset()
  //     console.log("UTCDate", UTCDate.toString())
  //     var locale = new Date(UTCDate.getTime() + offset * 1000)
  //     console.log("locale", locale.toString())
  //     return locale
  //   }
  //   return date
  // }

  /**
   * 根据生日计算年龄
   * @param {*} date 
   */
  calculateAgeByBirth(date){
    let d = null
    if(date && typeof date == 'string'){
      if(date.indexOf('-') >= 0 && !Validations.validateDate(date)){
        date = null //格式不对
      }
    }
    if(date && typeof date == 'string'){
      d = new Date(Date.parse(date.replace(/-/g,"/")))
    }
    if(!d){
      return null
    }
    var dateYear = d.getFullYear()
    var dateMonth = d.getMonth() + 1
    var dateDay = d.getDate()

    let today = new Date()
    var todayYear = today.getFullYear()
    var todayMonth = today.getMonth() + 1
    var todayDay = today.getDate()
    
    
    let betweenyear = todayYear - dateYear
    let betweenmonth = betweenyear * 12 + todayMonth - dateMonth
    //多少天
    let milliseconds = today.getTime() - d.getTime();
    let betweendays = Math.floor(milliseconds / 1000 / 60 / 60 / 24)
    let betweenweek = Math.floor(betweendays / 7)

    if(betweenmonth >= 1){
      if(todayDay < dateDay){
        betweenmonth--
      }
    }
    betweenyear = Math.floor(betweenmonth / 12)

    // console.log('calculateAgeByBirth', betweenyear, betweenmonth, betweenweek, betweendays)
    if(betweenyear >= 1){
      return betweenyear + 'Y'
    } else if(betweenmonth >= 1){
      return betweenmonth + 'M'
    } else if(betweenweek >= 1){
      return betweenweek + 'W'
    } else {
      return betweendays + 'D'
    }
  },

  validateAgeByBirthDate(date, age, ageUnit){
    let d = null
    if(date && typeof date == 'string'){
      if(date.indexOf('-') >= 0 && !Validations.validateDate(date)){
        date = null //格式不对
      }
    }
    if(date && typeof date == 'string'){
      d = new Date(Date.parse(date.replace(/-/g,"/")))
    }
    if(!d){
      return true
    }
    if(age == undefined || age == null || ageUnit == undefined || ageUnit == null){
      return false
    }
    var dateYear = d.getFullYear()
    var dateMonth = d.getMonth() + 1
    var dateDay = d.getDate()

    let today = new Date()
    var todayYear = today.getFullYear()
    var todayMonth = today.getMonth() + 1
    var todayDay = today.getDate()
    
    let betweenyear = todayYear - dateYear
    let betweenmonth = betweenyear * 12 + todayMonth - dateMonth
    //多少天
    let milliseconds = today.getTime() - d.getTime();
    let betweendays = Math.floor(milliseconds / 1000 / 60 / 60 / 24)
    let betweenweek = Math.floor(betweendays / 7)
    
    if(betweenmonth >= 1){
      if(todayDay < dateDay){
        betweenmonth--
      }
    }
    betweenyear = Math.floor(betweenmonth / 12)
    // console.log('validateAgeByBirthDate', betweenyear, betweenmonth, betweenweek, betweendays)
    // console.log('validateAgeByBirthDate', ageUnit, age)
    if(ageUnit == 'Y'){
      return age == betweenyear
    } else if(ageUnit == 'M'){
      return age == betweenmonth
    } else if(ageUnit == 'W'){
      return age == betweenweek
    } else if(ageUnit == 'D'){
      return age == betweendays
    }
    return false
  },

  /**
   * 通过18位身份证号获取生日
   * @param {*} cardNo 
   */
  getBirthDateFromIdCardNo(cardNo){
    if(cardNo && cardNo.length == 18){
      try {
        let dateStr = cardNo.substring(6, 14).replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
        let date = new Date(dateStr)
        if(date){
          dateStr = this.formatDate(date, 'yyyy-MM-dd')
          return Validations.validateDate(dateStr) ? dateStr : null
        }
      } catch (error) {
        
      }
    }
    return null
  }
}