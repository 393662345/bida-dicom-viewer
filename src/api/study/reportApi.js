import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PACSMAIN_URL} from '@/config'

export default {
  /**
   * 通过证件号码分页查询患者历史报告
   * @param {*} params 
   * @param {*} pageIndex 
   * @param {*} pageSize 
   */
  pageQueryPatientHistoryReports(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/study/pageQueryPatientHistoryReports";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  /**
   * 报告模板 管理部分
   * reportTemplate
   */
  //查询模板种类
  pageQueryStudyCategory(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/reportTemplate/pageQueryStudyCategory";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  pageQueryReportTemplate(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/reportTemplate/pageQueryReportTemplate";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  //保存个人模板
  savePrivateReportTemplate(data){
    var url = API_PACSMAIN_URL + "/reportTemplate/savePrivateReportTemplate";
    return Ajax.post(url, data);
  },

  //删除个人模板
  removePrivateReportTemplate(data){
    var url = API_PACSMAIN_URL + "/reportTemplate/removeTemplate";
    return Ajax.post(url, data);
  },

  findReportInfoByStudyZid(studyZid){
    var url = API_PACSMAIN_URL + "/study/findReportInfoByStudyZid/" + studyZid;
    return Ajax.query(url, {});
  },

  //保存 提交报告
  saveReportByUserZid(data){
    var url = API_PACSMAIN_URL + "/study/saveReportByUserId/"+ data.status + "/" + data.reportUserZid;
    return Ajax.post(url, data);
  },
  //撤回报告
  recallReportByUserZid(data){
    var url = API_PACSMAIN_URL + "/study/recallStudyReport/" + data.recallUserZid;
    return Ajax.post(url, data);
  },
  //审核报告
  auditReportByUserZid(data){
    var url = API_PACSMAIN_URL + "/study/auditReport/"+ data.auditResult + "/" + data.auditUserZid;
    return Ajax.post(url, data);
  },
  //放弃诊断
  giveUpReportByUserZid(data){
    var url = API_PACSMAIN_URL + "/study/giveUpReport/" + data.reportUserZid;
    return Ajax.post(url, data);
  },

  //报告打印
  printStudyReport(data){
    var url = API_PACSMAIN_URL + "/study/printStudyReport";
    return Ajax.post(url, data);
  },
};
