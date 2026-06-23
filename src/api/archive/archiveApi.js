import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'
import Utils from '@/utils/utils.js'

/**
 * 检查 档案信息管理
 */
export default {
  
  /**
   * 检查之间建立关联
   * @param {*} 
   */
  bindStudyRelation(data){
    var url = API_PACSMAIN_URL + "/study/bindStudy";
    return Ajax.post(url, data);
  },

  /**
   * 检查之间解除关联
   * @param {*} 
   */
  unbindStudyRelation(data){
    var url = API_PACSMAIN_URL + "/study/unbindStudy";
    return Ajax.post(url, data);
  },

  pageQueryRelatedStudies(params, pageIndex, pageSize){
    const paramsClone = Utils.cloneJson(params)
    if(paramsClone){
      paramsClone.modality = Utils.convertArrayValueToString(paramsClone.modalities)
      paramsClone.status = Utils.convertArrayValueToString(paramsClone.statuses)
      paramsClone.modalities = null
      paramsClone.statuses = null
    }
    var url = API_PACSMAIN_URL + "/study/pageQueryArchiveRelatedStudies";
    return Ajax.postPageQuery(url, paramsClone, pageIndex, pageSize);
  }

};
