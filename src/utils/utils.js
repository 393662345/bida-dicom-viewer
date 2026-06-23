/**
 * 工具类
 */
export const SEPARATOR_ARRAY_VALUE = ','

export default {
  isObjectEmpty(obj) {
    return obj === undefined || obj === null
  },
  isObjectBlank(obj) {
    return obj === null || obj === undefined || obj === ''
  },
  isEmptyString(str) {
    if(this.isObjectBlank(str)){
      return true
    }
    if(typeof str !== 'string'){
      return false
    }
    var trimStr = str.replace(/(^\s*)|(\s*$)/g, "")
    return trimStr.length  == 0
  },
  trim(str){
    if(str === undefined || str === null){
      return null
    }
    return str.replace(/(^\s*)|(\s*$)/g, "")
  },
  isArray(obj){
    return obj && obj instanceof Array
  },
  getFirstElement(arr){
    if(arr && arr instanceof Array && arr.length > 0){
      return arr[0]
    }
    return null
  },
  //通过某个字段筛选过滤，并取得匹配的第一个元素
  getFirstElementByFilter(arr, filter, compareValue){
    if(arr.length > 0 && compareValue){
      let results = arr.filter(function(item){
        return item[filter] == compareValue
      });
      return this.getFirstElement(results)
    }
    return null
  },

  /**
   * 判断操作是否成功
   * @param {*} responseData 
   */
  isResponseSucceed(responseData){
    return responseData 
    && (
        (responseData instanceof Object && responseData.success == 'Y')
        || (responseData instanceof String && responseData == 'Y')
      )
  },

  getResponseStatusCode(response){
    if(response && response.data && response.data.status){
      return response.data.status
    }
    return null
  },

  /**
   * 判断数组是否包含
   */
  arrayContains(array, value, key){
    let flag = false
    if(array && array instanceof Array && array.length > 0){
      for(let i = 0; i < array.length; i++){
        if((key && array[i][key] == value) || array[i] == value){
          flag = true
          break
        }
      }
    }
    return flag
  },

  /**
   * 以,为分隔符 拼接字符串
   * @param {*} arr 
   */
  convertArrayValueToString(arr, key){
    if(arr){
      if(arr instanceof Array){
        let str = ""
        arr.forEach(function(item){
          if(str.length > 0){
            str = str + SEPARATOR_ARRAY_VALUE
          }
          str = str + (key ? item[key] : item)
        })
        return str
      } else if(arr instanceof Object){
        return key ? arr[key] : arr
      } 
    }
    return arr
  },

  convertStringValueToArray(str, key){
    if(str){
      if(str instanceof Array){
        return str
      } else if(str instanceof Object){
        return key ? [str[key]] : [str]
      } else if(str instanceof String){
        return str.split(SEPARATOR_ARRAY_VALUE)
      } else {
        return [str]
      }
    }
    return null
  },

  convertBase64UrlToBlob(urlData){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/png'});
  },

  randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  },


  /**
   * //判断当前设备是否是手机移动端设备
   */
  isPcDevice(){
    var sUserAgent = navigator.userAgent.toLowerCase();  
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";  
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";  
    var bIsAndroid = sUserAgent.match(/android/i) == "android";  
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";  
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    return !(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)  
  },

  getMainColorOfModality(modality){
    const bgColors = {
      CT: '#0099CC',
      MR: '#99CCCC',
      DR: '#99CCFF',
      // CT: '#0099CC',
    }
    return modality ? bgColors[modality.toUpperCase()] : null
  },

  /**
  * Json对象的浅拷贝 返回具有父类属性的新的child对象
  * @param {Object} parent
  * @param {Object} child
  */
  extends(child, ...parents){
    var child = child || {};
    if(parents){
      for( let i = 0, len = parents.length; i < len; i++ ){
        var parent = parents[i]
        if(parent){
          for(var prop in parent) {
            child[prop] = parent[prop];
          }
        }
      }
    }
    return child;
  },

  /**
   * 深复制 Json
   * @param {*} jsonObj 
   */
  cloneJson(jsonObj){
    return jsonObj ? JSON.parse(JSON.stringify(jsonObj)) : jsonObj;
  },

  cloneJsonProps(target, source){
    const t = this.typeOf(source);
    if(t === 'array') {
      target = target || [];
    }else if ( t === 'object') {
      target = target || {};
    }
    let keySet = []
    for(let k1 in target){keySet.push(k1)}
    for(let k2 in source){keySet.push(k2)}
    keySet = keySet.filter(function(item, index, array) {
      return array.indexOf(item) === index
    });
    for(let i in keySet){
      let key = keySet[i]
      let tk = this.typeOf(source[key]);
      if(source[key] && tk === 'array' || t === 'object'){
        target[key] = this.cloneJson(source[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  },

  typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]'  : 'boolean',
        '[object Number]'   : 'number',
        '[object String]'   : 'string',
        '[object Function]' : 'function',
        '[object Array]'    : 'array',
        '[object Date]'     : 'date',
        '[object RegExp]'   : 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null',
        '[object Object]'   : 'object'
    };
    return map[toString.call(obj)];
  },

  // deepCopy
  deepCopy(data) {
    const t = this.typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(this.deepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = this.deepCopy(data[i]);
        }
    }
    return o;
  },

  convertToFormData(obj, form_data){
    let data = []
    if (obj instanceof File) {
      data.push({ key: "", value: obj });
    } else if (obj instanceof Array) {
      for (var j = 0, len = obj.length; j < len; j++) {
        var arr = this.convertToFormData(obj[j]);
        for (var k = 0, l = arr.length; k < l; k++) {
          var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
          data.push({ key: key, value: arr[k].value });
        }
      }
    } else if (typeof obj == "object") {
      for (var j in obj) {
        var arr = this.convertToFormData(obj[j]);
        for (var k = 0, l = arr.length; k < l; k++) {
          var key = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
          data.push({ key: key, value: arr[k].value });
        }
      }
    } else {
      data.push({ key: "", value: obj });
    }
    if (!!form_data) {
      // 封装
      for (var i = 0, len = data.length; i < len; i++) {
        form_data.append(data[i].key, data[i].value);
      }
    } else {
      return data;
    }
  },

  /**
   * json -> get 参数串(type = 1)
   * get 参数串 -> json (type = 2)
   * @param {*} str 
   * @param {*} type 
   */
  jsonget(str, type = 1){
    let sstr = str || ''
    if(type==1){
      //{"a":"11","b":"12",}
      sstr = sstr ? JSON.stringify(sstr) : ''
      sstr = sstr.replace(/\t/g,"");
      sstr = sstr.replace(/\"/g,"").replace("{","").replace("}","").replace(",","&").replace(":","=");
      sstr = sstr.replace(/\"/g,"").replace(/{/g,"").replace(/}/g,"").replace(/,/g,"&").replace(/:/g,"=");
    }else{
      sstr = sstr.replace(/&/g,'","').replace(/=/g,'":"');
      sstr = '{"'+sstr+'"}';
      sstr = JSON.parse(sstr)
    }
    return sstr
  }
  
}