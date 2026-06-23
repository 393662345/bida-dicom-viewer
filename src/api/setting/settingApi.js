import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PACSMAIN_URL} from '@/config'

export default {
  /**
   * 查询系统的全部字典
   * @param {*} hospitalZid  
   */
  queryHospitalAllDic(hospitalZid){
    var url = API_PACSMAIN_URL + "/dic/queryAllHospitalDic/"+hospitalZid;
    return Ajax.query(url, {});
  },

  queryAllSystemDic(){
    var url = API_PACSMAIN_URL + "/dic/queryAllSystemDic";
    return Ajax.query(url, {});
  },

  queryHospitalDicByDicType(hospitalZid, dicType){
    var url = API_PACSMAIN_URL + "/dic/queryHospitalDicByDicType/"+hospitalZid+"/"+dicType;
    return Ajax.query(url, {});
  },

  pageQueryHospitalDic(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/dic/pageQueryHospitalDic";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  hasUsedHospitalDic(data){
    var url = API_PACSMAIN_URL + "/dic/hasUsedHospitalDic";
    return Ajax.post(url, data);
  },

  saveHospitalDic(data){
    var url = API_PACSMAIN_URL + "/dic/saveHospitalDic";
    return Ajax.post(url, data);
  },

  removeHospitalDicByDicZid(dicZid){
    var url = API_PACSMAIN_URL + "/dic/removeHospitalDicByDicZid/" + dicZid;
    return Ajax.query(url, {});
  },

  removeHospitalDic(data){
    var url = API_PACSMAIN_URL + "/dic/removeHospitalDic";
    return Ajax.post(url, data);
  },

};