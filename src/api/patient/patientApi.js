import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'

export default {
  
  /**
   * findPatientInfoByZid
   * @param {*} zid 
   */
  findPatientInfoByZid(zid){
    var url = API_PACSMAIN_URL +"/patient/findPatientInfoByZid/" + zid;
    return Ajax.query(url);
  },

  /**
   * 保存患者信息
   * @param {*} patientInfo 
   */
  savePatientInfo(patientInfo){
    var url = API_PACSMAIN_URL + "/patient/savePatientInfo";
    return Ajax.post(url, patientInfo);
  }
};
