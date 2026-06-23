import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'

export default {
  
  /**
   * findHeadIconByUserZid
   * @param {*} 
   */
  findHeadIconByUserZid(userZid){
    var url = API_PACSMAIN_URL + "/image/findHeadIconByUserZid/" + userZid;
    return Ajax.query(url, {});
  },

  /**
   * updateHeadIconByUserZid
   * @param {*} params 
   */
  saveHeadIconByUserZid(data){
    var url = API_PACSMAIN_URL + "/image/saveHeadIconByUserZid";
    return Ajax.post(url, data);
  },

  findSignImageByUserZid(userZid){
    var url = API_PACSMAIN_URL + "/image/findSignImageByUserZid/" + userZid;
    return Ajax.query(url, {});
  },

  /**
   * updateHeadIconByUserZid
   * @param {*} params 
   */
  saveSignImageByUserZid(data){
    var url = API_PACSMAIN_URL + "/image/saveSignImageByUserZid";
    return Ajax.post(url, data);
  },

  /**
   * 个人信息保存
   */
  findUserInfoByUserZid(userZid){
    var url = API_PACSMAIN_URL + "/user/findUserInfoByUserZid/" + userZid;
    return Ajax.query(url, {});
  },
  modifyUserInfo(data){
    var url = API_PACSMAIN_URL + "/user/modifyUserInfo";
    return Ajax.post(url, data);
  },

  //更改密码
  updatePassword(data){
    var url = API_PACSMAIN_URL + "/user/updatePassword";
    return Ajax.post(url, data);
  },

  testNoticeNewStudy(){
    var url = API_PACSMAIN_URL + "/study/notifyDoctorHaveStudy";
    return Ajax.post(url, {
      hospitalZid: 'zycsyyzid001',
      modality: 'CT'
    });
  },
};