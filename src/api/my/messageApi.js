import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'


export default {
  
  /**
   * pageQueryUserMessages
   * @param {*} 
   */
  pageQueryUserMessages(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/message/pageQueryUserMessages";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  /**
   * 批量更新消息状态
   * @param {*} params 
   */
  updateUserMessages(params){
    var url = API_PACSMAIN_URL + "/message/updateUserMessages";
    return Ajax.post(url, params);
  },

  /**
   * 查询上一条和下一条消息
   * @param {*} params 
   */
  findPrevAndNextMessage(params){
    var url = API_PACSMAIN_URL + "/message/queryLastAndNextMessage";
    return Ajax.post(url, params);
  },

  countUnreadMessage(params){
    var url = API_PACSMAIN_URL + "/message/countUnreadMessage";
    return Ajax.post(url, params);
  }
};
