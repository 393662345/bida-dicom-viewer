import Ajax from "@/api/customajax";
import {API_PACSMAIN_URL} from '@/config'

export default {
  
  /**
   * findHospitalInfoByHospitalZid
   * @param {*} 
   */
  findHospitalInfoByHospitalZid(zid){
    var url = API_PACSMAIN_URL + "/hospital/findHospitalInfoByHospitalZid/" + zid;
    return Ajax.query(url);
  },

  /**
   * 更新医院联系电话
   * @param {*} data 
   */
  modifyHospitalPhone(data){
    var url = API_PACSMAIN_URL + "/hospital/modifyHospitalPhone";
    return Ajax.post(url, data);
  },

  modifyHospitalContactInfo(data){
    var url = API_PACSMAIN_URL + "/hospital/modifyHospitalContactInfo";
    return Ajax.post(url, data);
  },

  queryHospitalDataNum(data){
    var url = API_PACSMAIN_URL + "/hospital/queryHospitalDataNum";
    return Ajax.post(url, data);
  },


  /**
   * 查询医院成员 
   * @param {*} params 
   * @param {*} pageIndex 
   * @param {*} pageSize 
   */
  pageQueryMemberByHospitalZid(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/hospital/pageQueryMemberByHospitalZid";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  queryMembersByHospitalZid(params){
    var url = API_PACSMAIN_URL + "/hospital/queryMembersByHospitalZid";
    return Ajax.postQuery(url, params);
  },

  /**
   * 保存医院成员信息
   * @param {*} memberData 
   */
  saveMemberInfo(memberData){
    var url = API_PACSMAIN_URL + "/hospital/saveMemberInfo";
    return Ajax.post(url, memberData);
  },

  removeMember(memberData){
    var url = API_PACSMAIN_URL + "/hospital/removeMember";
    return Ajax.post(url, memberData);
  },

  //更新成员的在职状态
  updateMemberDutyStatus(memberData){
    var url = API_PACSMAIN_URL + "/hospital/updateMemberDutyStatus";
    return Ajax.post(url, memberData);
  },

  queryUserGroupsByHospitalZid(zid){
    var url = API_PACSMAIN_URL + "/hospital/queryGroupByHospitalZid/" + zid;
    return Ajax.query(url);
  },

  addUserGroup(userGroup){
    var url = API_PACSMAIN_URL + "/hospital/addUserGroup";
    return Ajax.post(url, userGroup);
  },

  modifyUserGroup(userGroup){
    var url = API_PACSMAIN_URL + "/hospital/modifyUserGroup";
    return Ajax.post(url, userGroup);
  },

  queryHospitalModalities(hospitalZid){
    var url = API_PACSMAIN_URL + "/hospital/queryHospitalModalities/" + hospitalZid;
    return Ajax.query(url);
  },

  queryUserGroupInfo(userGroup){
    var url = API_PACSMAIN_URL + "/hospital/queryUserGroupInfo";
    return Ajax.post(url, userGroup);
  },

  saveUserGroupAccess(data){
    var url = API_PACSMAIN_URL + "/hospital/saveUserGroupAccess";
    return Ajax.post(url, data);
  },

  removeUserGroupByUserGroupZid(data){
    var url = API_PACSMAIN_URL + "/hospital/removeUserGroupByUserGroupZid";
    return Ajax.post(url, data);
  },

  /**
   * post查询医院科室
   */
  queryOfficeInfoByHospitalZid(data){
    var url = API_PACSMAIN_URL + "/hospital/queryOfficeInfoByHospitalZid";
    return Ajax.post(url, data);
  },

  /**
   * 通过UserZid查询此用户在某家医院所属的用户组
   * @param {*} data 
   */
  queryHospitalUserGroupByUserZid(data){
    var url = API_PACSMAIN_URL + "/hospital/queryHospitalUserGroupByUserZid";
    return Ajax.post(url, data);
  },

  queryMemberByUserGroupZid(userGroupZid){
    var url = API_PACSMAIN_URL + "/hospital/queryMemberByUserGroupZid/" + userGroupZid;
    return Ajax.query(url);
  },

  removeMemberInUserGroup(user){
    var url = API_PACSMAIN_URL + "/hospital/removeMemberInUserGroup";
    return Ajax.post(url, user);
  },

  /**
   * 医院业务设置
   * @param {*} hospitalZid 
   */
  queryHospitalSetting(hospitalZid){
    var url = API_PACSMAIN_URL + "/hospital/queryHospitalSetting/" + hospitalZid;
    return Ajax.query(url);
  },

  updateHospitalSetting(settings){
    var url = API_PACSMAIN_URL + "/hospital/updateHospitalSetting";
    return Ajax.post(url, settings);
  },

  //通过手机号码查询用户信息
  findUserInfoByMobilePhone(data){
    var url = API_PACSMAIN_URL + "/hospital/findUserInfoByMobilePhone";
    return Ajax.post(url, data);
  },

  findUserInfoByParam(data){
    var url = API_PACSMAIN_URL + "/hospital/findUserInfoByParam";
    return Ajax.post(url, data);
  },

  /**
   * 科室管理
   */
  pageQueryHospitalOffice(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/office/pageQueryHospitalOffice";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  saveHospitalOffice(data){
    var url = API_PACSMAIN_URL + "/office/saveHospitalOffice";
    return Ajax.post(url, data);
  },

  removeHospitalOffice(data){
    var url = API_PACSMAIN_URL + "/office/removeHospitalOffice";
    return Ajax.post(url, data);
  },

  /**
   * 设备管理
   */
  pageQueryHospitalEquipment(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/studyEquipment/pageQueryHospitalEquipment";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  queryStudyDeviceByParams(data){
    var url = API_PACSMAIN_URL + "/studyEquipment/queryStudyDeviceByParams";
    return Ajax.post(url, data);
  },

  saveHospitalEquipment(data){
    var url = API_PACSMAIN_URL + "/studyEquipment/saveHospitalEquipment";
    return Ajax.post(url, data);
  },

  removeHospitalEquipment(data){
    var url = API_PACSMAIN_URL + "/studyEquipment/removeHospitalEquipment";
    return Ajax.post(url, data);
  },
 
  /**
   * 机房管理
   */
  pageQueryHospitalRoom(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/studyEquipmentRoom/pageQueryStudyEquipmentRoom";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  queryAllStudyEquipmentRoom  (data){
    var url = API_PACSMAIN_URL + "/studyEquipmentRoom/queryAllStudyEquipmentRoom";
    return Ajax.post(url, data);
  },

  saveHospitalRoom(data){
    var url = API_PACSMAIN_URL + "/studyEquipmentRoom/saveStudyEquipmentRoom";
    return Ajax.post(url, data);
  },

  removeHospitalRoom(data){
    var url = API_PACSMAIN_URL + "/studyEquipmentRoom/removeStudyEquipmentRoom";
    return Ajax.post(url, data);
  },


  /**
   * 部位管理
   */
  pageQueryStudyPart(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/studyPart/pageQueryStudyPart";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  addStudyPart(data){
    var url = API_PACSMAIN_URL + "/studyPart/addStudyPart";
    return Ajax.post(url, data);
  },

  modifyStudyPart(data){
    var url = API_PACSMAIN_URL + "/studyPart/modifyStudyPart";
    return Ajax.post(url, data);
  },
  
  removeStudyPart(data){
    var url = API_PACSMAIN_URL + "/studyPart/removeStudyPart";
    return Ajax.post(url, data);
  },

  /**
   * 费用管理
   */
  pageQueryPartFee(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/partFee/pageQueryPartFee";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  addPartFee(data){
    var url = API_PACSMAIN_URL + "/partFee/addPartFee";
    return Ajax.post(url, data);
  },

  modifyPartFee(data){
    var url = API_PACSMAIN_URL + "/partFee/modifyPartFee";
    return Ajax.post(url, data);
  },
  
  removePartFee(data){
    var url = API_PACSMAIN_URL + "/partFee/removePartFee";
    return Ajax.post(url, data);
  },
  
  queryBodyPartsByModality(data){
    var url = API_PACSMAIN_URL + "/regist/findPartInfoByModality";
    return Ajax.post(url, data);
  }
};
