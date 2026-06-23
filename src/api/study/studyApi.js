import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PACSMAIN_URL} from '@/config'

export default {
  /**
   * 分页查询检查信息
   * @param {*} params 
   * @param {*} pageIndex 
   * @param {*} pageSize 
   */
  pageQueryStudyInfo(params, pageIndex, pageSize){
    const paramsClone = Utils.cloneJson(params)
    if(paramsClone){
      paramsClone.modality = Utils.convertArrayValueToString(paramsClone.modalities)
      paramsClone.status = Utils.convertArrayValueToString(paramsClone.statuses)
      paramsClone.modalities = null
      paramsClone.statuses = null
    }
    var url = API_PACSMAIN_URL + "/study/pageQueryStudyInfo";
    return Ajax.postPageQuery(url, paramsClone, pageIndex, pageSize);
  },

  pageQueryStudyInfoOfDoctor(params, pageIndex, pageSize){
    const paramsClone = Utils.cloneJson(params)
    if(paramsClone){
      paramsClone.modality = Utils.convertArrayValueToString(paramsClone.modalities)
      paramsClone.status = Utils.convertArrayValueToString(paramsClone.statuses)
      paramsClone.modalities = null
      paramsClone.statuses = null
    }
    var url = API_PACSMAIN_URL + "/study/pageQueryStudyInfoOfDoctor";
    return Ajax.postPageQuery(url, paramsClone, pageIndex, pageSize);
  },

  /**
   * 催诊，诊断提醒
   * @param {*} urgeInfoParams 
   */
  urgeDiagnose(urgeInfoParams){
    var url = API_PACSMAIN_URL + "/message/urgeDiagnose";
    return Ajax.post(url, urgeInfoParams);
  },

  canOptReport(data){
    var url = API_PACSMAIN_URL + "/study/canOptReport/" + data.opt + "/" + data.userZid;
    return Ajax.post(url, data);
  },

  /**
   * 通过检查Zid查询检查信息
   * @param {*} StudyZid 
   */
  findStudyInfoByStudyZid(studyZid){
    var url = API_PACSMAIN_URL + "/study/findStudyInfoByStudyZid/" + studyZid;
    return Ajax.query(url, {});
  },

  findStudySimpleInfoByStudyZid(studyZid){
    var url = API_PACSMAIN_URL + "/study/findStudySimpleInfoByStudyZid/" + studyZid;
    return Ajax.query(url, {});
  },
  findStudySimpleInfoByHisUid(studyZid){
    var url = API_PACSMAIN_URL + "/study/findStudySimpleInfoByHisUid/" + studyZid;
    return Ajax.query(url, {});
  },
  
   modifyStudySimpleInfo(data){
    var url = API_PACSMAIN_URL + "/study/modifyStudySimpleInfo";
    return Ajax.post(url, data);
  },

  

  findApplyInfoByStudyZid(studyZid){
    var url = API_PACSMAIN_URL + "/apply/findApplyInfoByStudyZid/" + studyZid;
    return Ajax.query(url, {});
  },

  saveApplyInfo(data){
    var url = API_PACSMAIN_URL + "/apply/saveApplyInfo";
    return Ajax.post(url, data);
  },

  saveApplyImagesByApplyZid(data){
    var url = API_PACSMAIN_URL + "/apply/saveApplyImagesByApplyZid";
    return Ajax.post(url, data);
  },

  deleteApplyImagesByApplyZid(data){
    var url = API_PACSMAIN_URL + "/apply/deleteApplyImagesByApplyZid";
    return Ajax.delete(url, data);
  },

  //检查内容修改 确认
  confirmStudyContent(studyZid){
    var url = API_PACSMAIN_URL + "/study/confirmStudyContent";
    return Ajax.post(url, {studyZid: studyZid});
  },

  queryNewOldStudyContent(studyZid){
    var url = API_PACSMAIN_URL + "/study/queryNewOldStudyContent";
    return Ajax.post(url, {studyZid: studyZid});
  },

  //胶片发放 控制
  queryFilmReceiveInfoByStudyZid(studyZid){
    var url = API_PACSMAIN_URL + "/studyFilm/queryFilmReceiveInfo";
    return Ajax.post(url, {studyZid: studyZid});
  },

  sendStudyFilm(studyFilm){
    var url = API_PACSMAIN_URL + "/studyFilm/sendStudyFilm";
    return Ajax.post(url, studyFilm);
  },
 
  //诊断 权限 验证
  checkWriteReport(data){
    var url = API_PACSMAIN_URL + "/study/checkWriteReport";
    return Ajax.post(url, data);
  },

  checkAuditReport(data){
    var url = API_PACSMAIN_URL + "/study/checkAuditReport";
    return Ajax.post(url, data);
  },

  /**
   * 影像管理
   * @param {*} data 
   */
  queryStudySeries(data){
    var url = API_PACSMAIN_URL + "/studySeries/queryStudySeries/"+data.studyZid;
    return Ajax.post(url, data);
  },

  queryAllStudySeries(data){
    var url = API_PACSMAIN_URL + "/studySeries/queryAllStudySeries/"+data.studyZid;
    return Ajax.post(url, data);
  },

  insertStudySeries(data){
    var url = API_PACSMAIN_URL + "/studySeries/insertStudySeries";
    return Ajax.post(url, data);
  },

  removeStudySeries(data){
    var url = API_PACSMAIN_URL + "/studySeries/removeStudySeries";
    return Ajax.post(url, data);
  },

  recycleStudySeries(data){
    var url = API_PACSMAIN_URL + "/studySeries/recycleStudySeries";
    return Ajax.post(url, data);
  },

  //废弃 和恢复检查状态
  discardStudy(data){
    var url = API_PACSMAIN_URL + "/study/discardStudy";
    return Ajax.post(url, data);
  },

  //完成检查
  completeStudy(data){
    var url = API_PACSMAIN_URL + "/study/completeStudy";
    return Ajax.post(url, data);
  },
  recoverStudy(data){
    var url = API_PACSMAIN_URL + "/study/recoverStudy";
    return Ajax.post(url, data);
  },

  //发送云报告
  publishReport(data){
    var url = API_PACSMAIN_URL + "/cloudReport/publishReport";
    return Ajax.post(url, data);
  },

  //查询云报告信息
  findCloudReportInfo(data){
    var url = API_PACSMAIN_URL + "/cloudReport/findCloudReportInfo";
    return Ajax.post(url, data);
  },

  //送检 到设备
  sendStudy(data){
    var url = API_PACSMAIN_URL + "/regist/sendStudy";
    return Ajax.post(url, data);
  },

  getBeforeAppointNumber(data){
    var url = API_PACSMAIN_URL + "/regist/getBeforeAppointNumber";
    return Ajax.post(url, data);
  },

  //保存报告编辑信息
  updateReportStudyInfo(data){
    var url = API_PACSMAIN_URL + "/study/updateReportStudyInfo";
    return Ajax.post(url, data);
  }
};
