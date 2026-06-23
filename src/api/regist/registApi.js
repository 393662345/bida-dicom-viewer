import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PACSMAIN_URL} from '@/config'

export default {
  
  /**
   * submitRegist
   * 提交登记信息
   * @param {*} zid 
   */
  saveRegistInfo(data){
    var url = API_PACSMAIN_URL +"/regist/registStudy";
    return Ajax.post(url, data);
  },

  getSerialNoAndPatientId(data){
    var url = API_PACSMAIN_URL +"/regist/getSerialNoAndPatientId";
    return Ajax.post(url, data);
  },

  findRegistInfo(data){
    var url = API_PACSMAIN_URL +"/regist/findRegistInfoByParams";
    return Ajax.post(url, data);
  },

  removeRegistInfo(data){
    var url = API_PACSMAIN_URL +"/regist/removeRegistInfoByPatientZid";
    return Ajax.post(url, data);
  },

  pageQueryRegistStudy(params, pageIndex, pageSize){
    const paramsClone = Utils.cloneJson(params)
    if(paramsClone){
      paramsClone.modality = Utils.convertArrayValueToString(paramsClone.modalities)
      paramsClone.status = Utils.convertArrayValueToString(paramsClone.studyStatuses)
      paramsClone.modalities = null
      paramsClone.statuses = null
    }
    var url = API_PACSMAIN_URL + "/regist/pageQueryRegistStudy";
    return Ajax.postPageQuery(url, paramsClone, pageIndex, pageSize);
  },

  getQueueSeqByStudyZid(data){
    var url = API_PACSMAIN_URL +"/regist/getQueueSeqByStudyZid";
    return Ajax.post(url, data);
  },

};
