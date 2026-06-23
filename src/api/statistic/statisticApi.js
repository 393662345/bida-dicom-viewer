import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PACSMAIN_URL} from '@/config'

export default {
  /**
   * 个人统计-当日诊断情况
   * @param {*} params  
   */
  countDiagnoseNumOfToday(params){
    // var url = API_PACSMAIN_URL + "/study/countDiagnoseNumOfToday";
     var url = API_PACSMAIN_URL + "/statistic/countDiagNum";
    return Ajax.post(url, params);
  },

  countDoctorDiagnoseNumOfToday(params){
    // var url = API_PACSMAIN_URL + "/study/countDoctorDiagnoseNumOfToday";
    // countDiagNum
    var url = API_PACSMAIN_URL + "/statistic/countDiagNum";
    return Ajax.post(url, params);
  },

  countDiagnoseNum(params){
    // var url = API_PACSMAIN_URL + "/study/countDiagnoseNumOfToday";
     var url = API_PACSMAIN_URL + "/statistic/countDiagNum";
    return Ajax.post(url, params);
  },

  /**
   * 检查个数趋势
   * @param {*} params 
   */
  studyModalityTendencyOfHospital(params){
    var url = API_PACSMAIN_URL + "/statistic/studyModalityTendencyOfHospital";
    return Ajax.post(url, params);
  },

  studyModalityTendencyOfDoctor(params){
    var url = API_PACSMAIN_URL + "/statistic/studyModalityTendencyOfDoctor";
    return Ajax.post(url, params);
  },

  studyWorkloadCount(params){
    var url = API_PACSMAIN_URL + "/statistic/studyWorkloadCount";
    return Ajax.post(url, params);
  },

  pageQueryStudyWorkloadDetail(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/statistic/pageQueryStudyWorkloadDetail";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  studyPositiveRateCount(params){
    var url = API_PACSMAIN_URL + "/statistic/studyPositiveRateCount";
    return Ajax.post(url, params);
  },

  pageQueryStudyPositiveRateDetail(params, pageIndex, pageSize){
    var url = API_PACSMAIN_URL + "/statistic/pageQueryStudyPositiveRateDetail";
    return Ajax.postPageQuery(url, params, pageIndex, pageSize);
  },

  //
  /**
   * 按照医生统计
   */
  statDoctorWorkloadTotalCount(params){
    var url = API_PACSMAIN_URL + "/statistic/statDoctorWorkloadTotalCount";
    return Ajax.post(url, params);
  },

  statDoctorWorkloadByDoctors(params){
    var url = API_PACSMAIN_URL + "/statistic/statDoctorWorkloadByDoctors";
    return Ajax.post(url, params);
  },

  statModalityWorkload(params){
    var url = API_PACSMAIN_URL + "/statistic/statModalityWorkload";
    return Ajax.post(url, params);
  },

  statModalityPositiveRateByDate(params){
    var url = API_PACSMAIN_URL + "/statistic/statModalityPositiveRateByDate";
    return Ajax.post(url, params);
  },

  statApplyOfficeUser(params){
    var url = API_PACSMAIN_URL + "/statistic/statApplyOfficeUser";
    return Ajax.post(url, params);
  },

  statPatientSource(params){
    var url = API_PACSMAIN_URL + "/statistic/statPatientSource";
    return Ajax.post(url, params);
  },

  statTodayStudyInfo(params){
    var url = API_PACSMAIN_URL + "/statistic/statTodayInfo";
    return Ajax.post(url, params);
  },
};