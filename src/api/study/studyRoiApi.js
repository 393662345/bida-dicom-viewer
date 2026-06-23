import Ajax from "@/api/customajax";
import Utils from '@/utils/utils.js'
import {API_PICTURE_URL} from '@/config'

export default {
  
  //诊断 权限 验证
  saveRoiImage(data){
    var url = API_PICTURE_URL + "/studyRoi/saveStudyRoi";
    return Ajax.post(url, data);
  },

  deleteRoiImage(data){
    var url = API_PICTURE_URL + "/studyRoi/deleteStudyRoi/"+data
    return Ajax.delete(url, {});
  },

  queryStudyRoiImagesByStudyZid(data){
    var url = API_PICTURE_URL + "/studyRoi/queryStudyRoiByStudyZid";
    return Ajax.post(url, data);
  },

  generateImageUrl(imageZid){
    var url = API_PICTURE_URL + "/studyImage/getPictureImg/"+ imageZid
    return url
  },

  useRoiImagesIntoReport(data){
    var url = API_PICTURE_URL + "/studyRoi/useStudyRoiInReport";
    return Ajax.post(url, data);
  },

};
