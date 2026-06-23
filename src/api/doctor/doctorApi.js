import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'

/**
 * 医生信息
 */
export default {
  
  /**
   * queryDoctors
   * @param {*} 
   */
  queryDoctors(params){
    var url = API_PACSMAIN_URL + "/doctor/queryDoctors";
    return Ajax.postQuery(url, params);
  },

  queryDoctorOptModalities(userZid){
    var url = API_PACSMAIN_URL + "/doctor/queryDoctorOptModalities/" + userZid;
    return Ajax.query(url, {});
  },

  pageQueryDoctorHospital(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/doctor/pageQueryDoctorHospital";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  findDoctorDetailInHospital(data){
    var url = API_PACSMAIN_URL + "/doctor/findDoctorDetailInHospital";
    return Ajax.postQuery(url, data);
  },

  todoTaskCountOfStudy(data){
    var url = API_PACSMAIN_URL + "/doctor/todoTaskCountOfStudy";
    return Ajax.postQuery(url, data);
  },

};
