import Ajax from "@/api/customajax";
import {API_PICTURE_URL} from '@/config'

/**
 * 医生信息
 */
export default {

  /**
   * queryDoctors
   * @param {*}
   */
  queryStudyImagesByStudyZid(studyZid){
    var url = API_PICTURE_URL + "/studyImage/findImagesByStudy/"+studyZid;
    return Ajax.postQuery(url, {});
  },
  find3dImagesByStudy(studyZid){
    var url = API_PICTURE_URL + "/studyImage/find3dImagesByStudy/"+studyZid
    return Ajax.query(url)
  },
  findSystemConfigSysDir(){
    var url = API_PICTURE_URL + "/systemConfig/findSystemConfigByName/sys_dir"
    return Ajax.query(url);
  },
  findImagesByHisUid(hisUid){
    var url = API_PICTURE_URL + "/studyImage/findImagesByHisUid/"+hisUid
    return Ajax.query(url)
  },
};
