import {API_PICTURE_URL} from '@/config'

export default {

  convertImageListToStacks(imageList, modality){
    let studyStacks = []
    if(imageList && imageList.length > 0){
      for(var i = 0, len = imageList.length; i < len; i++){
        const image = imageList[i]
        if(!image){
          return
        }
        // {
        //   studyZid: "Td5gMo9K",
        //   seriesZid: "AorVR7e2",
        //   seriesSeq: null,
        //   seriesNumber: "1",
        //   thumbImgZid: "wISCWOcB",
        //   imageZid: "kcQERxvK",
        //   imageSeq: null,
        //   imageInstanceNumber: "1",
        //   hospitalZid: "cdzsgkyysc001"
        // },
        const studyZid = image.studyZid
        const seriesZid = image.seriesZid
        let imageZid = image.imageZid
        if(studyZid && seriesZid && imageZid){
          //检查
          let study = this.getStudyFromStudyList(studyStacks, studyZid)
          if(!study){
            study = {
              hospitalZid: image.hospitalZid,
              studyZid: image.studyZid,
              folded: false, //序列的缩略图是否全部展开
              //!!!下载进度，需要vue的computed,watch
              _loadedNum: 0,
              _loadStatus: null,
            }
            studyStacks.push(study)
          }
          //序列
          study.stacks = study.stacks || []
          let stack = this.getStackFromStudy(study, seriesZid)
          if(!stack){
            stack = {
              hospitalZid: image.hospitalZid,
              studyZid: image.studyZid,
              seriesZid: image.seriesZid,
              seriesSeq: image.seriesSeq,
              seriesNumber: image.seriesNumber,
              thumbImgZid: image.thumbImgZid,
              //!!!下载进度，需要vue的computed,watch
              _stackIndex: study.stacks.length, //从0开始
              _loadedNum: 0,
              _loadStatus: null,
            }
            study.stacks.push(stack)
          }
          if(!stack.thumbLoadUrl && image.thumbImgZid){
            stack.thumbLoadUrl = this.generateThumbLoadUrl(image.thumbImgZid)
          }
          //单个图像
          stack.images = stack.images || []
          let exist = this.getImageFromStack(stack, imageZid)
          if(!exist){
            image._loadStatus = null
            image._loadPercent = 0
            image._imageIndex = stack.images.length //从0开始
            stack.images.push(image)
          }
          stack._loadTotal = stack.images.length
          //图像加载url
          if(!image.loadUrl){
            if (modality == 'US') {
              imageZid = image.thumbImgZid || imageZid
            }
            image.loadUrl = this.generateImageLoadUrl(imageZid, modality)
          }
        }
      }
    }
    let self = this
    studyStacks.forEach(function (study) {
      self.sortStudyStacksAndImages(study)
    })
    return studyStacks
  },

  sortStudyStacksAndImages(study){
    let self = this
    study.stacks.sort(self.compareStack)
    study.stacks.forEach(function (stack, stkIndex) {
      stack._stackIndex = stkIndex
      stack.images.sort(self.compareImage)
      stack.images.forEach(function (image, imgIndex) {
        image._imageIndex = imgIndex //从0开始
      })
    })
  },

  generateImageLoadUrl(imageZid, modality){
    var prefixUrl = "dicomweb:" + API_PICTURE_URL + "/studyImage/getPictureDcm/"
    if(modality && modality == "US"){
      prefixUrl = "http:" + API_PICTURE_URL + "/studyImage/getPictureImg/"
    }
    return imageZid ? prefixUrl + imageZid : null
  },

  generateThumbLoadUrl(thumbImgZid){
    var prefixUrl = API_PICTURE_URL + "/studyImage/getPictureImg/"
    return thumbImgZid ? prefixUrl + thumbImgZid : null
  },

  getFirstImageFromStudyStack(studyStack){
    if(studyStack && studyStack.stacks && studyStack.stacks.length > 0){
      let firstStack = studyStack.stacks[0]
      if(firstStack && firstStack.images && firstStack.images.length > 0){
        return firstStack.images[0]
      }
    }
    return null
  },
  /**
   * 将targetStudy的数据 融合到 sourceStudies 中
   * @param {*} sourceStudies
   * @param {*} targetStudy
   */
  combineTargetStudyStack(sourceStudies, targetStudy){
    let self = this
    if(targetStudy && targetStudy.studyZid && targetStudy.stacks){
      if(sourceStudies){
        let tmpStu = self.getStudyFromStudyList(sourceStudies, targetStudy.studyZid)
        if(tmpStu){
          tmpStu.stacks = tmpStu.stacks || []
          targetStudy.stacks.forEach(function(stack) {
            let tmpStk = self.getStackFromStackList(tmpStu.stacks, stack.seriesZid)
            if(tmpStk){
              tmpStk.images = tmpStk.images || []
              stack.images.forEach(function(image) {
                let tmpImg = self.getStackFromStackList(tmpStk.images, image.imageZid)
                if(!tmpImg){
                  tmpStk.images.push(image)
                }
              })
            } else {
              tmpStu.stacks.push(stack)
            }
          });
          self.sortStudyStacksAndImages(tmpStu)
        } else {
          sourceStudies.push(targetStudy)
        }
      } else {
        sourceStudies = [targetStudy]
      }
    }
  },

  /**
   * 查找是否存在
   * @param {*} studyList
   * @param {*} studyZid
   */
  getStudyFromStudyList(studyList, studyZid){
    return this.getFirstElementFromArray(studyList, 'studyZid', studyZid)
  },

  getStackFromStudy(study, seriesZid){
    if(study && study.stacks){
      return this.getFirstElementFromArray(study.stacks, 'seriesZid', seriesZid)
    }
    return null
  },

  getStackFromStackList(stacks, seriesZid){
    return this.getFirstElementFromArray(stacks, 'seriesZid', seriesZid)
  },

  getImageFromStack(stack, imageZid){
    if(stack && stack.images){
      return this.getFirstElementFromArray(stack.images, 'imageZid', imageZid)
    }
    return null
  },

  getImageFromImageList(images, imageZid){
    return this.getFirstElementFromArray(images, 'imageZid', imageZid)
  },

  getFirstElementFromArray(arr, field, compareValue){
    if(arr && arr.length > 0 && field){
      for(var i = 0, len = arr.length; i < len; i++){
        if(arr[i][field] == compareValue){
          return arr[i]
        }
      }
    }
    return null
  },

  compareStack(stack1, stack2) {
    function compareBy(val1, val2) {
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
    let seq1 = stack1.seriesSeq
    let seq2 = stack2.seriesSeq

    let num1 = stack1.seriesNumber
    let num2 = stack2.seriesNumber
    if(seq1 != undefined && seq1 != null && seq2 != undefined && seq2 != null){
      return compareBy(seq1, seq2)
    } else {
      return compareBy(num1, num2)
    }
  },

  compareImage(image1, image2) {
    function compareBy(val1, val2) {
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
    let seq1 = image1.imageSeq
    let seq2 = image2.imageSeq
    let num1 = image1.imageInstanceNumber
    let num2 = image2.imageInstanceNumber
    if(seq1 != undefined && seq1 != null && seq2 != undefined && seq2 != null){
      return compareBy(seq1, seq2)
    } else {
      return compareBy(num1, num2)
    }
  },
}
