import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoader.js'
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import * as cornerstoneMath from 'cornerstone-math'
import * as dicomParser from 'dicom-parser'
import { draghighlight } from './tools/highlight'
import { getToken } from '@/utils/authService'

const DICOM_CONFIG = {
  webWorkerManager: {
    webWorkerPath : '/static/cornerstone/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask' : {
            codecsPath: './cornerstoneWADOImageLoaderCodecs.js'
        }
    }
  },
  cornerToolConfig: {
   getTextCallback : getTextCallback,
    // changeTextCallback : changeTextCallback,
    drawHandles : true,
    drawHandlesOnHover : true,
    arrowFirst : true
  }
}

const SYNCHRONIZERS_CONFIG = {
  strategy: {
    default: 'default',
    sameBodyPart: 'sameBodyPart',
    sameStack: 'sameStack'
  }
}
/**
 * 鼠标按键数值
 */
export const MOUSE_BUTTONS = {
  LEFT : 1,
  MIDDLE : 2,
  RIGHT: 4,
}

/**
 * 每个tool 只能绑定到一个按键上
 */
export const MOUSE_BUTTON_TOOLS = {
  'none': {},
  'wwwc': cornerstoneTools.wwwc,
  'pan': cornerstoneTools.pan,
  'zoom': cornerstoneTools.zoom,
  'stackScroll': cornerstoneTools.stackScroll,
  'zoomWheel': cornerstoneTools.zoomWheel,
  'huValue': cornerstoneTools.dragProbe, //CT值、HU值
  // 'huAreaValue': cornerstoneTools.highlight, //区域CT值、HU值
  'huAreaValue': draghighlight, //区域CT值、HU值
  'length': cornerstoneTools.length, //测量-长度
  'simpleAngle': cornerstoneTools.simpleAngle, //测量-角度
  'rectangleRoi': cornerstoneTools.rectangleRoi, //测量-矩形
  'ellipticalRoi': cornerstoneTools.ellipticalRoi, //测量-椭圆
  'arrowAnnotate': cornerstoneTools.arrowAnnotate, //测量-箭头
  'probe': cornerstoneTools.probe, //测量-点
  'freehand': cornerstoneTools.freehand, //测量-自由画
  'eraser': cornerstoneTools.eraser, //测量-橡皮擦
  'magnify': cornerstoneTools.magnify, //测量-放大镜
}

export default function AppManager(appName){
  let self = this
  this._appName = appName || 'dicomAppManager'
  this._cornerstone_status = 0
  //papaya
  this.papaya = []
  //数据内容
  this.studyStacks = []
  //指定下一次目标加载序列
  this.specifyLoadStack = null
  //注册进来的element
  this.sourceElements = []
  //image rendered 事件监听 与 sourceElements 序号一一对应，
  this._renderedCallbacks = []
  //日志输出前缀
  this.loggerPrefix = "### AppManager["+this._appName+"] ~ "
  this.initCornerstone()
  //创建同步器
  this.appSynchronizers = {}
  this.initSynchronizers()
  //播放速度（每秒几张图）
  this.playFramesPerSecond = 10
  this.playElements=[] //正在播放的元素

  //图像四周显示信息
  this.image4CornerInfo = [
    'I4C-PatientName',
    'I4C-PatientId',
    'I4C-PatientGender',
    'I4C-PatientAge',
    'I4C-StudyDate',
    'I4C-ImageScale',
    'I4C-ImageWwwc',
    'I4C-ImageRuler',
    'I4C-StackIndex',
    'I4C-ImageIndex',
  ]

  //鼠标左键操作tool
  this.mouseLeftBtnTool = 'none'

  //空格键按下后配合鼠标左键，可以移动图像
  this.spaceKeydownTool = null
  //禁用右键菜单
  document.oncontextmenu = function(){
    event.returnValue = false;
  };
  // 禁用网页上选取的内容
  document.onselectstart = function(){
    event.returnValue = false;
  }
  //按键事件监听
  this.onKeydownListener = function(event){
    // keyCode 32 = space
    const keyCode = event.keyCode
    if(keyCode == 32 && self.spaceKeydownTool == null){
      //空格键配合鼠标左键，可以移动图像
      // console.log('onKeydownListener space', self.spaceKeydownTool)
      self.spaceKeydownTool = 'pan'
      self.toggleToolOfMouseLeftBtn(self.spaceKeydownTool, true)
      self.toggleToolOfMouseWheel('zoomWheel')
    }
  }

  this.onKeyupListener = function(event) {
    const keyCode = event.keyCode
    if(keyCode == 32 && self.spaceKeydownTool != null){
      // console.log('onKeyupListener space, go back:', self.spaceKeydownTool, self.mouseLeftBtnTool)
      self.spaceKeydownTool = null
      self.toggleToolOfMouseLeftBtn(self.mouseLeftBtnTool)
      self.toggleToolOfMouseWheel('none')
    }
  }
  document.addEventListener('keydown', this.onKeydownListener)
  document.addEventListener('keyup', this.onKeyupListener)
}

AppManager.prototype.initCornerstone = function() {
  try {
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone
    cornerstoneWebImageLoader.external.cornerstone = cornerstone
    try {
      cornerstoneWADOImageLoader.webWorkerManager.initialize(DICOM_CONFIG.webWorkerManager)
      cornerstoneWebImageLoader.configure({
        beforeSend: function(xhr) {
          let token = getToken()
          // Add custom headers here (e.g. auth tokens)
          //xhr.setRequestHeader('x-auth-token', 'my auth token')
          xhr.setRequestHeader('Authorization', token)
        }
      })

    } catch (error) {

    }
    // cornerstone.metaData.addProvider(metaDataProvider);
    cornerstoneTools.dragProbe.strategy = cornerstoneTools.dragProbe.strategies.minimal;

    cornerstoneTools.arrowAnnotate.setConfiguration(DICOM_CONFIG.cornerToolConfig)
    cornerstoneTools.length.setConfiguration({drawHandlesOnHover : true});
    cornerstoneTools.simpleAngle.setConfiguration({drawHandlesOnHover : true});
    cornerstoneTools.rectangleRoi.setConfiguration({drawHandlesOnHover : true});
    cornerstoneTools.ellipticalRoi.setConfiguration({drawHandlesOnHover : true});
    cornerstoneTools.freehand.setConfiguration({drawHandlesOnHover : true});
    this._cornerstone_status = 1
    console.log(this.loggerPrefix, 'Init Cornerstone OK.')
  } catch (error) {
    console.error(this.loggerPrefix, 'Init Cornerstone error: ', error)
    this._cornerstone_status = -1
  }
}

AppManager.prototype.initSynchronizers = function() {
  let synWwwc = new AppSynchronizer('synWwwc', cornerstone.EVENTS.IMAGE_RENDERED, cornerstoneTools.wwwcSynchronizer)
  synWwwc.strategy = SYNCHRONIZERS_CONFIG.strategy.sameBodyPart
  synWwwc.disable()

  let synPanZoom = new AppSynchronizer('synPanZoom', cornerstone.EVENTS.IMAGE_RENDERED, cornerstoneTools.panZoomSynchronizer)
  synPanZoom.strategy = SYNCHRONIZERS_CONFIG.strategy.sameBodyPart
  synPanZoom.disable()

  let synStackImageIndex = new AppSynchronizer('synStackImageIndex', cornerstone.EVENTS.NEW_IMAGE, cornerstoneTools.stackImageIndexSynchronizer)
  synStackImageIndex.strategy = SYNCHRONIZERS_CONFIG.strategy.sameBodyPart
  synStackImageIndex.disable()
  //
  // let synUpdateImage = new AppSynchronizer('synUpdateImage', cornerstone.EVENTS.NEW_IMAGE, cornerstoneTools.updateImageSynchronizer)

  let synStackBox = new AppSynchronizer('synStackBox')
  synStackBox.synchronizer('synBoxWwwc', new cornerstoneTools.Synchronizer(cornerstone.EVENTS.IMAGE_RENDERED, cornerstoneTools.wwwcSynchronizer))
  synStackBox.synchronizer('synBoxPanZoom', new cornerstoneTools.Synchronizer(cornerstone.EVENTS.IMAGE_RENDERED, cornerstoneTools.panZoomSynchronizer))
  synStackBox.synchronizer('synBoxUpdateImage', new cornerstoneTools.Synchronizer(cornerstone.EVENTS.NEW_IMAGE, cornerstoneTools.updateImageSynchronizer))
  synStackBox.synchronizer('synBoxStackScroll', new cornerstoneTools.Synchronizer(cornerstoneTools.EVENTS.STACK_SCROLL, cornerstoneTools.stackScrollSynchronizer))
  // synStackBox.synchronizer('synBoxOffset', new cornerstoneTools.Synchronizer(cornerstone.EVENTS.STACK_SCROLL, cornerstoneTools.stackImagePositionOffsetSynchronizer ))

  let synRefLines =  new AppReferenceLineSynchronizer('synRefLines')
  this.appSynchronizers = {
    'wwwc': synWwwc,
    'panZoom': synPanZoom,
    'stackImageIndex': synStackImageIndex,
    // 'updateImage': synUpdateImage,
    'synStackBox': synStackBox, //同一序列同步
    'refLine': synRefLines, //定位线同步
  }
}

/**
 * 销毁
 */
AppManager.prototype.destroy = function() {
  cornerstoneWADOImageLoader.wadouri.fileManager.purge() //删除本地文件记录
  document.removeEventListener('keydown', this.onKeydownListener)
  document.removeEventListener('keyup', this.onKeyupListener)
}

AppManager.prototype.isSynchronizerEnable = function(syncName) {
  if(this.appSynchronizers && syncName && this.appSynchronizers[syncName]){
    return !this.appSynchronizers[syncName].disabled
  }
  return false
}

AppManager.prototype.enableSynchronizer = function(syncName, enable) {
  if(this.appSynchronizers && syncName && this.appSynchronizers[syncName]){
    if(enable == undefined || enable == null || enable){
      this.appSynchronizers[syncName].enable()
    } else {
      this.appSynchronizers[syncName].disable()
    }
  }
}

/**
 * 检查list:
 * [
 *    { 检查对象数据
 *      stacks: [
 *        { 序列检查数据
 *          images: [
 *            {单个图片数据}
 *          ]
 *        }
 *      ]
 *    }
 * ]
 */
AppManager.prototype.setStudyStacks = function(studyStacks) {
  this.studyStacks = studyStacks || []
}
//指定加载某一序列
AppManager.prototype.setSpecifyLoadStack = function(stack) {
  this.specifyLoadStack = stack
}

/**
 * 添加本地文件
 */
AppManager.prototype.addLocalFile = function(file) {
  // console.log('cornerstoneWADOImageLoader', cornerstoneWADOImageLoader)
  return cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
}

/**
 * 开始加载已经设定的检查数据
 */
AppManager.prototype.startLoadStackImages = function() {
  if(this.studyStacks){
    //初始化加载信息
    for(let i = 0, studyLength = this.studyStacks.length; i < studyLength; i++){
      const study = this.studyStacks[i]
      let studyImagesTotal = 0
      if(study && study.stacks){
        for(let n = 0, len = study.stacks.length; n < len; n++){
          const stack = study.stacks[n]
          stack._loadTotal = stack && stack.images ? stack.images.length : 0
          study._loadedNum = 0
          study._loadStatus = stack._loadTotal < 1 ? 'ok' : 'wait'
          studyImagesTotal += stack._loadTotal
        }
      }
      study._loadTotal = studyImagesTotal
      study._loadedNum = 0
      study._loadStatus = studyImagesTotal < 1 ? 'ok' : 'wait'
    }
  }
  //开始加载
  this.gotoLoadNextImage()
  this.papaya = []
}

AppManager.prototype.refreshStackLoadState = function(stackImage) {
  if(this.studyStacks){
    for(let i = 0, slen = this.studyStacks.length; i < slen; i++){
      const study = this.studyStacks[i]
      if(study && study.studyZid == stackImage.studyZid && study.stacks){
        let studyLoadedNum = 0
        for(let n = 0, len = study.stacks.length; n < len; n++){
          const stack = study.stacks[n]
          if(stack && stack.seriesZid == stackImage.seriesZid){
            //统计序列加载进度
            const imagesTotal = stack.images.length
            let loadedNum = 0
            for(let m = 0; m < imagesTotal; m++){
              const image = stack.images[m]
              if(image._loadStatus == 'ok' || image._loadStatus == 'fail'){
                loadedNum++
              }
            }
            stack._loadedNum = loadedNum
            stack._loadStatus = loadedNum < imagesTotal ? "loading" : 'ok'
          }
          //检查的图像总数
          // studyImagesNum += stack && stack.images ? stack.images.length: 0
          studyLoadedNum += stack ? (stack._loadedNum || 0 ) : 0
        }
        study._loadedNum = studyLoadedNum
        study._loadStatus = studyLoadedNum < study._loadTotal ? "loading" : 'ok'

        //加载某张图片完成，日志打印加载进度
        // console.log(this.loggerPrefix, 'loading ['+study.studyZid+'] at : '+study._loadedNum+'/'+study._loadTotal+', image: '+stackImage.imageZid+' -status:'+stackImage._loadStatus)
      }
    }
  }
}

AppManager.prototype.continueLoadImages = function() {
  this.gotoLoadNextImage()
}

AppManager.prototype.gotoLoadNextImage = function() {
  if(this.studyStacks){
    const studyLength = this.studyStacks.length
    //优先加载指定序列
    let targetStack = null
    if(this.specifyLoadStack && this.specifyLoadStack.studyZid && this.specifyLoadStack.seriesZid){
      //存在优先指定加载某一序列，找到对应的序列
      for(let i = 0; targetStack == null && i < studyLength; i++){
        const study = this.studyStacks[i]
        if(study && study.studyZid == this.specifyLoadStack.studyZid && study.stacks){
          for(let n = 0, len = study.stacks.length; targetStack == null && n < len; n++){
            const stack = study.stacks[n]
            if(stack && stack.seriesZid == this.specifyLoadStack.seriesZid ){
              const imagesTotal = stack.images.length
              stack._loadStatus = stack._loadedNum < imagesTotal ? "loading" : 'ok'
              if(stack._loadStatus == 'loading'){
                targetStack = stack
                break
              }
            }
          }
        }
      }
    }
    if(targetStack == null){
      //优先序列已经加载完成，对象置为null，避免上一段的循环
      this.specifyLoadStack = null
      //不存在优先序列，重新寻找新的加载序列对象
      for(let i = 0; targetStack == null && i < studyLength; i++){
        const study = this.studyStacks[i]
        if(study && study.stacks){
          for(let n = 0, len = study.stacks.length; targetStack == null && n < len; n++){
            const stack = study.stacks[n]
            if(stack && stack._loadStatus != 'ok'){
              targetStack = stack
              break
            }
          }
        }
      }
    }
    if(targetStack && targetStack.images){
      //目标加载序列，在其中加载某一图像
      const imagesTotal = targetStack.images.length
      for(let m = 0; m < imagesTotal; m++){
        const image = targetStack.images[m]
        if(image._loadStatus != 'loading'
            && image._loadStatus != 'ok'
            && image._loadStatus != 'fail'){
          this.loadStackSingleImage(image)
          break;
        }
      }
    }
  }
}

AppManager.prototype.getPapayaData = function () {
  return this.papaya
}

/**
 *
 */
AppManager.prototype.loadStackSingleImage = function(stackImage) {
  let self = this
  if(stackImage && stackImage.loadUrl){
    stackImage._loadStatus = 'loading'
    self.refreshStackLoadState(stackImage)
    const imageId = stackImage.loadUrl
    cornerstone.loadAndCacheImage(imageId).then(function(image) {
      // 加载成功
      stackImage._loadStatus = 'ok'
      
      // 获取源数据 START
      // 检查 image.data 是否存在，这是 dicomParser 的数据集
      if (image.data && image.data.byteArray) {
        const dicomBuffer = image.data.byteArray.buffer
        const dicomBlob = new Blob([dicomBuffer])
        const name = stackImage.seriesZid + ',' + stackImage.imageZid
        self.papaya.push({
          name: name,
          data: dicomBlob
        })
      } else {
        console.warn(self.loggerPrefix, "DICOM data not available for image", stackImage);
      }
      // 获取源数据 END
      
      //刷新序列进度
      self.refreshStackLoadState(stackImage)
      self.gotoLoadNextImage()
    }, function (error){
      //加载失败
      stackImage._loadStatus = 'fail'
      console.error(self.loggerPrefix, "loadAndCacheImage fail", stackImage, error);
      //刷新序列进度
      self.refreshStackLoadState(stackImage)
      self.gotoLoadNextImage()
    });
  } else {
    console.error(this.loggerPrefix, "loadStackSingleImage argument is null. Load stoped");
  }
}

/**
 * 加载本地文件
 * 返回检查文件信息列表
 */
AppManager.prototype.loadLocalDicomFiles = function(dicomFiles, loadCallback) {
  let self = this
  let totalCount = dicomFiles ? dicomFiles.length : 0
  let loadNum = 0
  let imageList = []
  if(dicomFiles && dicomFiles.length > 0){
    for(let i = 0, len = dicomFiles.length; i < len; i++) {
      const file = dicomFiles[i]
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
      cornerstone.loadAndCacheImage(imageId).then(function(image) {
        const dataSet = image.data
        //数据交由utils整合
        let imageInfo = {}
        imageInfo.from = 'local'
        imageInfo.studyZid = dataSet.string('x0020000d') || dataSet.string('x00200010') || dataSet.string('x00100020') //Study Instance UID
        imageInfo.seriesZid = dataSet.string('x0020000e') || dataSet.string('x00200011') //Series Instance UID
        imageInfo.seriesSeq = dataSet.string('x00200011') //Series Number
        imageInfo.seriesNumber = dataSet.string('x00200011') //Series Number
        imageInfo.imageZid = dataSet.string('x00080018') || dataSet.string('x00200013') //SOP Instance UID Image/Instance Number:
        imageInfo.imageSeq = dataSet.string('x00200013') //Image/Instance Number:
        imageInfo.imageInstanceNumber = dataSet.string('x00200013') //Image/Instance Number:
        imageInfo.loadUrl = imageId

        imageList.push(imageInfo)
        // console.log(self.loggerPrefix, "loadLocalDicomFiles loaded ok. ", image);
        loadNum++
        if(loadCallback){
          loadCallback(loadNum)
        }
      }, function (error){
        console.error(self.loggerPrefix, "loadLocalDicomFiles fail. ", file, error);
        loadNum++
        loadCallback(loadNum)
      });
    }
  }
  return new Promise(function (resolve, reject) {
    let lfint = window.setInterval(
      function(){
        if(loadNum >= totalCount){
          resolve(imageList)
          window.clearInterval(lfint)
        }
      }
    , 10)
  })
}

AppManager.prototype.getStackImageByImageId = function(imageId) {
  let targetImage = null
  if(this.studyStacks){
    for(let i = 0, len1 = this.studyStacks.length; targetImage == null && i < len1; i++){
      const study = this.studyStacks[i]
      if(study && study.stacks){
        for(let n = 0, len2 = study.stacks.length; targetImage == null && n < len2; n++){
          const stack = study.stacks[n]
          if(stack && stack.images){
            for(let m = 0, len3 = stack.images.length; targetImage == null && m < len3; m++){
              const image = stack.images[m]
              if(image && image.loadUrl == imageId){
                targetImage = image
                break
              }
            }
          }
        }
      }
    }
  }
  return targetImage
}
/**
 * 通过Image 获取图片中的检查信息
 */
AppManager.prototype.getOriginalStudyDetailByImageId = function(imageId, resolve, reject) {
  let self = this
  if(imageId){
    cornerstone.loadAndCacheImage(imageId).then(function(image) {
      const dataSet = image.data
      let studyDetail = {}
      studyDetail.studyZid = dataSet.string('x0020000d') || dataSet.string('x00200010') || dataSet.string('x00100020') //Study Instance UID
      studyDetail.modality = dataSet.string('x00080060')
      studyDetail.studyDate = dataSet.string('x00080020')
      studyDetail.studyBodyPart = dataSet.string('x00180015')
      studyDetail.patientName = dataSet.string('x00100010')
      studyDetail.patientId = dataSet.string('x00100020')
      studyDetail.patientGender = dataSet.string('x00100040')
      studyDetail.PatientBirthDate = dataSet.string('x00100030')
      // console.log(self.loggerPrefix, "getStudyDetailByImageId loaded ok. ", image);
      resolve(studyDetail)
    }, function (error){
      console.error(self.loggerPrefix, "getStudyDetailByImageId fail. ", imageId, error);
      reject(error)
    });
  } else {
    reject({error: 'ImageId is null.'})
  }
}

/**
 * 组装stack对象保存到cornerstoneTools ToolState 中
 * var stack = {
 *        currentImageIdIndex : 0,
 *        imageIds: [
 *            'example://1',
 *            'example://2',
 *            'example://3'
 *        ];
 *    };
 */
AppManager.prototype.getStackDataByImage = function(targetImage) {
  let targetStack = null
  let stackIndex = null
  let studyDetail = null
  if(this.studyStacks && targetImage && targetImage.studyZid && targetImage.seriesZid){
    for(let i = 0, len1 = this.studyStacks.length; targetStack == null && i < len1; i++){
      const study = this.studyStacks[i]
      if(study && study.stacks && study.studyZid == targetImage.studyZid){
        for(let n = 0, len2 = study.stacks.length; targetStack == null && n < len2; n++){
          const stack = study.stacks[n]
          if(stack && stack.seriesZid == targetImage.seriesZid){
            targetStack = stack
            stackIndex = n
            studyDetail = study.studyDetail
            break
          }
        }
      }
    }
  }
  let stack = {
    stackIndex: stackIndex == null ? -1 : stackIndex,
    studyDetail: studyDetail,
    currentImageIdIndex: -1,
    imageIds: []
  }
  if(targetStack && targetStack.images){
    stack.currentImageIdIndex = targetStack.images.indexOf(targetImage)
    targetStack.images.forEach(function(image) {
      stack.imageIds.push(image.loadUrl)
    })
  }
  return stack
}

/**
 * toggleImage4CornerInfo
 * 图像四角信息
 */
AppManager.prototype.toggleImage4CornerInfo = function(i4cInfoCode) {
  if(i4cInfoCode && i4cInfoCode.length > 0){
    let index = this.image4CornerInfo.indexOf(i4cInfoCode)
    if(index < 0){
      this.image4CornerInfo.push(i4cInfoCode)
    } else {
      this.image4CornerInfo.splice(index, 1)
    }
  } else {
    if(this.image4CornerInfo.length < 1){
      this.image4CornerInfo = [
        'I4C-PatientName',
        'I4C-PatientId',
        'I4C-PatientGender',
        'I4C-PatientAge',
        'I4C-StudyDate',
        'I4C-ImageScale',
        'I4C-ImageWwwc',
        'I4C-ImageRuler',
        'I4C-StackIndex',
        'I4C-ImageIndex',
      ]
    } else {
      this.image4CornerInfo = []
    }
  }
}

AppManager.prototype.isVisibleOfImage4Corner = function(i4cInfoCode) {
  if(i4cInfoCode && i4cInfoCode.length > 0){
    let index = this.image4CornerInfo.indexOf(i4cInfoCode)
    return index >= 0
  }
  //总共10事项信息 是否全部显示
  return this.image4CornerInfo && this.image4CornerInfo.length > 0
}

/**
 * 激活activate cornerstoneTools
 */
AppManager.prototype.enableMouseTools = function(element) {
  if(!element){
    return
  }
  // cornerstoneTools.imageStats.enable(element);
  cornerstoneTools.orientationMarkers.enable(element); //方向显示
  cornerstoneTools.keyboardInput.enable(element);
  cornerstoneTools.mouseInput.enable(element);
  cornerstoneTools.mouseWheelInput.enable(element);
  //默认操作
  // cornerstoneTools.zoom.activate(element, MOUSE_BUTTONS.MIDDLE); // 鼠标中间键默认缩放
  cornerstoneTools.wwwc.activate(element, MOUSE_BUTTONS.RIGHT); // 鼠标右键默认设置窗宽窗位
  cornerstoneTools.stackScrollWheel.activate(element); // 鼠标滚轮默认翻层
  // cornerstoneTools.stackScrollKeyboard.activate(element);
  // cornerstoneTools.wwwc.activate(element, MOUSE_BUTTONS.LEFT); // 鼠标左键默认翻层
}

AppManager.prototype.disableMouseTools = function(element) {
  if(!element){
    return
  }
  for(var csType in MOUSE_BUTTON_TOOLS){
    if(csType && MOUSE_BUTTON_TOOLS[csType].disable){
      try {
        MOUSE_BUTTON_TOOLS[csType].disable(element)
      } catch (error) {

      }
    }
  }
  try {
    //默认操作
    cornerstoneTools.wwwc.disable(element); // 鼠标右键默认设置窗宽窗位
    cornerstoneTools.stackScrollWheel.disable(element); // 鼠标滚轮默认翻层
    // cornerstoneTools.stackScroll.activate(element, MOUSE_BUTTONS.LEFT); // 鼠标左键默认翻层
    cornerstoneTools.keyboardInput.disable(element);
    cornerstoneTools.mouseInput.disable(element);
    cornerstoneTools.mouseWheelInput.disable(element);
  } catch (error) {

  }
}

/**
 * 切换所有元素的鼠标左键事件
 */
AppManager.prototype.toggleToolOfMouseLeftBtn = function(toolType) {
  if(this.sourceElements && toolType && MOUSE_BUTTON_TOOLS[toolType]){
    if(this.spaceKeydownTool){
      //如果按下的是空格键，则激活pan
      // console.log(this.loggerPrefix, ' key [space] down, activate tool :', toolType)
    } else {
      this.mouseLeftBtnTool = toolType
    }
    console.log(this.loggerPrefix, ' toggle mouse left btn tool :', toolType)
    let self = this
    this.sourceElements.forEach(function(element){
      self.toggleElementMouseLeftBtnTool(element, toolType)
    })
  }
}

AppManager.prototype.toggleElementMouseLeftBtnTool = function(element, toolType) {
  // console.log('toggleElementMouseLeftBtnTool:', element, toolType)
  if(element && toolType && MOUSE_BUTTON_TOOLS[toolType]){
    const image = cornerstone.getImage(element);
    if(!image){
      return
    }
    for(var csType in MOUSE_BUTTON_TOOLS){
      if(csType != 'none'){
        MOUSE_BUTTON_TOOLS[csType].enable(element, MOUSE_BUTTONS.LEFT)
        MOUSE_BUTTON_TOOLS[csType].enable(element, MOUSE_BUTTONS.RIGHT)
      }
    }
    if(toolType != 'none'){
      MOUSE_BUTTON_TOOLS[toolType].activate(element, MOUSE_BUTTONS.LEFT)
    }
    if(toolType != 'wwwc'){
      cornerstoneTools.wwwc.activate(element, MOUSE_BUTTONS.RIGHT)
    }
    if(toolType != 'huAreaValue'){
      cornerstoneTools.clearToolState(element, "draghighlight");
    }
  }
}

AppManager.prototype.toggleToolOfMouseWheel = function(toolType) {
  if(this.sourceElements && toolType && MOUSE_BUTTON_TOOLS[toolType]){
    if(this.spaceKeydownTool){
      //如果按下的是空格键，则激活pan
      // console.log(this.loggerPrefix, ' key [space] down, activate tool :', toolType)
    } else {
      this.mouseWheelTool = toolType
    }
    let self = this
    // this.sourceElements.forEach(function(element){
    //   self.toggleElementMouseWheelTool(element, toolType)
    // })
  }
}

AppManager.prototype.putElementIntoSynchronizer = function(element, syncName) {
  if(this.appSynchronizers && syncName && this.appSynchronizers[syncName] && element){
    this.appSynchronizers[syncName].add(element)
  }
}

AppManager.prototype.removeElementFromSynchronizer = function(element, syncName) {
  if(this.appSynchronizers && syncName && this.appSynchronizers[syncName] && element){
    this.appSynchronizers[syncName].remove(element)
  }
}

/**
 * 通过元素中图像的具体检查部位来分配检查部位
 */
AppManager.prototype.toggleElementCommonSyncs = function (element, syncName, bodyPart) {
  if(this.appSynchronizers && element && syncName && bodyPart && this.appSynchronizers[syncName]){
    this.appSynchronizers[syncName].resetGroup(element, bodyPart)
  }
}

/**
 * 切换定位线的当前需要定位元素
 */
AppManager.prototype.toggleRefLineActiveElement = function (element) {
  let syncName = 'refLine'
  if(this.appSynchronizers && element && syncName && this.appSynchronizers[syncName]){
    this.appSynchronizers[syncName].setActiveElement(element)
  }
}

/**
 * 注册元素，图片渲染回调函数
 */
AppManager.prototype.registerElement = function(element) {
  let self = this
  this.sourceElements = this.sourceElements || []
  if(element && this.sourceElements.indexOf(element) < 0){
    this.sourceElements.push(element)
    //cornerstone激活
    cornerstone.enable(element);
    element.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED, this.onImageRendered)
    //
  }
}

AppManager.prototype.removeElement = function(element) {
  let self = this
  if(element && this.sourceElements){
    // this.removeElementFromSynchronizers(element)
    //移除事件监听
    element.removeEventListener(cornerstone.EVENTS.IMAGE_RENDERED, this.onImageRendered)
    this.disableMouseTools(element)
    //clearToolState
    try {
      cornerstoneTools.clearToolState(element, 'renderedCallback')
      cornerstoneTools.clearToolState(element, 'stack')
      cornerstone.disable(element)
    } catch (error) {

    }
    //删除元素
    const index = this.sourceElements.indexOf(element)
    this.sourceElements.splice(index, 1)
  }
}

AppManager.prototype.loadImageInElement = function(element, imageId, renderedCallback, loadedCallback){
  let self = this
  this.registerElement(element)
  if(element && imageId){
    let targetImage = this.getStackImageByImageId(imageId)
    let stack = this.getStackDataByImage(targetImage)
    // console.log('getStackImageByImageId', targetImage)
    if(targetImage){
      new Promise(function (resolve, reject) {
        let pint = window.setInterval(
          function(){
            if(targetImage._loadStatus == 'ok' || targetImage._loadStatus == 'fail'){
              resolve()
              window.clearInterval(pint)
            }
          }, 10)
      }).then(function(){
        cornerstone.loadAndCacheImage(imageId).then(function(image) {
          var viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);
          cornerstone.fitToWindow(element);
          //add tool state
          cornerstoneTools.addStackStateManager(element, ['stack', 'playClip', 'renderedCallback']);
          cornerstoneTools.addToolState(element, 'renderedCallback', renderedCallback); //渲染回调
          cornerstoneTools.addToolState(element, 'stack', stack);
          //enableMouseTools
          self.enableMouseTools(element)
          self.toggleElementMouseLeftBtnTool(element, self.mouseLeftBtnTool)

          //加载成功回调
          if(loadedCallback && typeof loadedCallback == 'function'){
             loadedCallback()
          }
        }, function(error){
          if(loadedCallback && typeof loadedCallback == 'function'){
             loadedCallback()
          }
        });
      })
    }
  }
}

/**
 * 缩略图加载
 */
AppManager.prototype.loadImageInElementAsThumb = function(element, imageId, loadedCallback){
  if(element && imageId){
    let targetImage = this.getStackImageByImageId(imageId)
    // let stack = this.getStackDataByImage(targetImage)
    // console.log('getStackImageByImageId', targetImage)
    if(targetImage){
      //cornerstone激活
      cornerstone.enable(element);
      new Promise(function (resolve, reject) {
        let pint = window.setInterval(
          function(){
            if(targetImage._loadStatus == 'ok' || targetImage._loadStatus == 'fail'){
              resolve()
              window.clearInterval(pint)
            }
          }, 10)
      }).then(function(){
        cornerstone.loadAndCacheImage(imageId).then(function(image) {
          var viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);
          cornerstone.fitToWindow(element);
          //加载成功回调
          if(loadedCallback && typeof loadedCallback == 'function'){
             loadedCallback()
          }
        }, function(error){
          if(loadedCallback && typeof loadedCallback == 'function'){
             loadedCallback()
          }
        });
      })
    }
  }
}

/**
 * Resize
 */
AppManager.prototype.handleElementResize = function(element){
  if(element){
    cornerstone.resize(element, true);
  }
}

AppManager.prototype.handleElementTransform = function(element, transform){
  if(element && transform){
    const viewport = cornerstone.getViewport(element)
    // console.log(this.loggerPrefix, 'handleElementTransform', element, transform, viewport)
    if(!viewport){
      return false
    }
    if(transform == 'invert'){
      //负像
      viewport.invert = !viewport.invert
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'hflip'){
      //左右
      viewport.hflip = !viewport.hflip
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'vflip'){
      //上下
      viewport.vflip = !viewport.vflip
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'rotate' || transform == 'rotate+90'){
      //90度旋转
      viewport.rotation += 90
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'rotate-90'){
      //90度旋转
      viewport.rotation -= 90
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'reset'){
      //还原
      cornerstone.reset(element);
    } else if(transform == 'clearTools'){
      //清除测量数据
      cornerstoneTools.clearToolState(element, "length");
      cornerstoneTools.clearToolState(element, "simpleAngle");
      cornerstoneTools.clearToolState(element, "rectangleRoi");
      cornerstoneTools.clearToolState(element, "ellipticalRoi");
      cornerstoneTools.clearToolState(element, "freehand");
      cornerstoneTools.clearToolState(element, "probe");
      cornerstoneTools.clearToolState(element, "arrowAnnotate");
      cornerstone.updateImage(element);
    } else if(transform == 'scrollPrev' || transform == 'scrollNext'){
      //向前，向后
      let toolState = cornerstoneTools.getToolState(element, 'stack')
      let stackData = toolState.data[0]
      let direction = transform == 'scrollNext' ? 1 : -1
      let gotoIndex = stackData.currentImageIdIndex + direction
      // console.log('cornerstoneTools.scrollToIndex:'+stackData.currentImageIdIndex, gotoIndex)
      if(gotoIndex >= 0 && gotoIndex < stackData.imageIds.length){
          cornerstoneTools.scrollToIndex(element, gotoIndex);
      }
    } else if(transform == 'fitToWindow'){
      cornerstone.fitToWindow(element);
    } else if(transform == 'original'){
      //原图
      viewport.scale = 1.0
      cornerstone.setViewport(element, viewport);
    } else if(transform == 'playClip'){
      //播放
      cornerstoneTools.playClip(element, this.playFramesPerSecond);
      let tmp = this.playElements.indexOf(element)
      if(tmp < 0){
        this.playElements.push(element)
      }
    }  else if(transform == 'stopClip'){
      //暂停
      cornerstoneTools.stopClip(element);
      let tmp = this.playElements.indexOf(element)
      if(tmp >= 0){
        this.playElements.splice(tmp, 1)
      }
    }
    return true
  }
}

AppManager.prototype.screenshotElement = function(element){
  if(element){
    const canvas = element.querySelector('canvas.cornerstone-canvas');
    const image = cornerstone.getImage(element)
    if(image && canvas){
      // Generate the image data（将Canvas的内容保存为图片借助toDataURL来实现） 方法返回一个包含图片展示的 data URI 。
      return canvas.toDataURL("image/jpg");
    }
  }
  return null
}

AppManager.prototype.saveElementAsPng = function(element, filename, mimetype = 'image/png'){
  if(element){
    filename = filename || 'png' + Math.random() + '.png'
    // cornerstoneTools.saveAs(element, filename)
    const canvas = element.querySelector('canvas.cornerstone-canvas');

    // If we are using IE, use canvas.msToBlob
    if (canvas.msToBlob) {
      const blob = canvas.msToBlob();

      return window.navigator.msSaveBlob(blob, filename);
    }

    // Thanks to Ken Fyrstenber
    // http://stackoverflow.com/questions/18480474/how-to-save-an-image-from-canvas
    const lnk = document.createElement('a');

    // The key here is to set the download attribute of the a tag
    lnk.download = filename;

    // Convert canvas content to data-uri for link. When download
    // Attribute is set the content pointed to by link will be
    // Pushed as 'download' in HTML5 capable browsers
    lnk.href = canvas.toDataURL(mimetype, 1);

    // Create a 'fake' click-event to trigger the download
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent('onclick');
    }
  }
}

AppManager.prototype.exportElementAsDcm = function(element, filename){
  if(element){
    filename = filename || 'dcm' + Math.random() + '.dcm'
    const image = cornerstone.getImage(element)
    if(image && image.data){
      // console.log(this.loggerPrefix, 'exportElementAsDcm', image, filename)
      let byteArray = image.data.byteArray
      var blob = new Blob([byteArray])
      const lnk = document.createElement('a');

      // The key here is to set the download attribute of the a tag
      lnk.download = filename;
      lnk.href = (window.URL || window.webkitURL).createObjectURL(blob)

      // Create a 'fake' click-event to trigger the download
      if (document.createEvent) {
        const e = document.createEvent('MouseEvents');
        e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        lnk.dispatchEvent(e);
      } else if (lnk.fireEvent) {
        lnk.fireEvent('onclick');
      }
    }
  }
}

AppManager.prototype.setPlayFramesPerSecond = function(playSpeed){
  if(playSpeed && this.playFramesPerSecond != playSpeed){
    this.playFramesPerSecond = playSpeed
    if(this.playElements){
      this.playElements.forEach(function(element) {
        //暂停
        cornerstoneTools.stopClip(element);
        //播放
        cornerstoneTools.playClip(element, playSpeed);
      })
    }
  }
}

AppManager.prototype.handleElementPresetWwwc = function(element, presetWwwc){
  if(element){
    const image = cornerstone.getImage(element);
    const viewport = cornerstone.getViewport(element)
    if(!viewport || !image){
      return false
    }
    let ww = presetWwwc ? presetWwwc.windowWidth : null
    let wc = presetWwwc ? presetWwwc.windowCenter : null
    if(ww == undefined || ww == null || wc == undefined || wc == null){
      ww = image.windowWidth
      wc = image.windowCenter
    }
    viewport.voi.windowWidth = ww
    viewport.voi.windowCenter = wc
    cornerstone.setViewport(element, viewport)
  }
}

/**
 * 图片渲染事件
 */
AppManager.prototype.onImageRendered = function(e){
  var eventDetail = e.detail;
  var element = e.target;
  if(eventDetail && element){
    var toolDataOfRender = cornerstoneTools.getToolState(element, 'renderedCallback')
    //渲染响应处理回调函数
    var callback = toolDataOfRender && toolDataOfRender.data && toolDataOfRender.data.length > 0 ? toolDataOfRender.data[0] : null
    //序列栈信息
    var toolDataOfStack = cornerstoneTools.getToolState(element, 'stack')
    var stackData = toolDataOfStack && toolDataOfStack.data && toolDataOfStack.data.length > 0 ? toolDataOfStack.data[0] : null
    var image = eventDetail.image
    // console.log('#### onImageRendered ok.', e, callback)
    if(callback && typeof callback == 'function'){
      var imagePlane = cornerstone.metaData.get('imagePlaneModule', image.imageId);
      callback(eventDetail, stackData, imagePlane)
    }
  }
}

// export default new AppManager('printerManager')
/**
 * 自定义同步器管理类
 * 可以实现：
 * 窗宽窗位、平移缩放、序列滚动
 * @param {*} syncName
 * @param {*} synchronizer
 */
function AppSynchronizer(syncName, event, synchronizer) {
  let _synName = syncName || 'appSynchronizer'
  this.defaultName = _synName //保证其和bodyPartGroups中的任何key不要相同
  this.cornerstoneEvent = event || cornerstone.EVENTS.IMAGE_RENDERED
  this.cornerstoneSynchronizer = synchronizer

  this.disabled = false
  this.strategy = SYNCHRONIZERS_CONFIG.strategy.default //策略
  this.elements = []
  this.synchronizers = {}
  if(event && synchronizer){
    this.synchronizers[_synName] = new cornerstoneTools.Synchronizer(event, synchronizer)
  }

  //根据bodyPart分组元素
  this.bodyPartGroups = {}
  this.groupSynchronizers = {}

  this.loggerPrefix = () => {
    return "### AppSynchronizer["+this.defaultName+"]/strategy:"+this.strategy+"/disabled:"+this.disabled+"/ ~ "
  }

  this.synchronizer = (aliasName, synchronizer) => {
    if(synchronizer){
      let alias = aliasName || this.synchronizerName || 'appSynchronizer'
      this.synchronizers = this.synchronizers || {}
      this.synchronizers[alias] = synchronizer
    }
    return this
  }

  this.add = (element, groupKey) => {
    if(element && this.elements.indexOf(element) < 0){
      this.elements.push(element)
      //根据strategy策略加入到Group
      if(groupKey && this.strategy == SYNCHRONIZERS_CONFIG.strategy.sameBodyPart){
        this.bodyPartGroups[groupKey] = this.bodyPartGroups[groupKey] || new Array()
        if(this.bodyPartGroups[groupKey].indexOf(element) < 0){
          this.bodyPartGroups[groupKey].push(element)
        }
      }
      if(!this.disabled){
        //当前同步器处于开启状态
        this.enable(element)
      }
    }
  }

  this.remove = (element) => {
    if(element && this.elements.indexOf(element) >= 0){
      this.disable(element)

      let index = this.elements.indexOf(element)
      this.elements.splice(index, 1)
      //从group中移除
      for(var key in this.bodyPartGroups){
        let group = this.bodyPartGroups[key]
        if(group && group.indexOf(element) >= 0 ){
          group.splice(group.indexOf(element), 1)
        }
      }
    }
  }

  this.resetGroup = (element, groupKey) => {
    if(element && groupKey){
      if(this.strategy == SYNCHRONIZERS_CONFIG.strategy.sameBodyPart){
        //其他组
        for(var key in this.bodyPartGroups){
          let group = this.bodyPartGroups[key]
          if(key != groupKey && group && group.indexOf(element) >= 0){
            group.splice(group.indexOf(element), 1)
            if(this.groupSynchronizers[key]){
              // console.log(this.loggerPrefix() ,' resetGroup remove', key, element)
              this.groupSynchronizers[key].remove(element)
            }
          }
        }
        //当前组
        this.bodyPartGroups[groupKey] = this.bodyPartGroups[groupKey] || new Array()
        if(this.bodyPartGroups[groupKey].indexOf(element) < 0){
          this.bodyPartGroups[groupKey].push(element)
          //同一部位的同步器
          if(this.cornerstoneEvent && this.cornerstoneSynchronizer){
            this.groupSynchronizers[groupKey] = this.groupSynchronizers[groupKey] || new cornerstoneTools.Synchronizer(this.cornerstoneEvent, this.cornerstoneSynchronizer)
            if(!this.disabled) {
              // console.log(this.loggerPrefix() ,' resetGroup add', groupKey, element)
              this.groupSynchronizers[groupKey].add(element)
            }
          }
        }
      }
    }
  }

  this.enable = (element) => {
    if(element){
      this._synAdd(element)
    } else {
      this.disabled = false
      for(var i in this.elements){
        this._synAdd(this.elements[i])
      }
    }
  }

  this.disable = (element) => {
    if(element){
      this._synRemove(element)
    } else {
      this.disabled = true
      for(var i in this.elements){
        this._synRemove(this.elements[i])
      }
    }
  }

  this._synAdd = (element) => {
    if(element){
      if(this.strategy == SYNCHRONIZERS_CONFIG.strategy.sameBodyPart){
        for(var key in this.bodyPartGroups){
          let group = this.bodyPartGroups[key]
          if(key && group){
            let exist = group.indexOf(element) >= 0
            //同一部位的同步器
            if(this.cornerstoneEvent && this.cornerstoneSynchronizer){
              this.groupSynchronizers[key] = this.groupSynchronizers[key] || new cornerstoneTools.Synchronizer(this.cornerstoneEvent, cornerstoneSynchronizer)
              if(exist){
                // console.log(this.loggerPrefix() ,' _synAdd add', key, element)
                this.groupSynchronizers[key].add(element)
              } else {
                // console.log(this.loggerPrefix() ,' _synAdd remove', key, element)
                this.groupSynchronizers[key].remove(element)
              }
            }
          }
        }
      } else {
        //默认加入的同步器
        for(var alias in this.synchronizers){
          if(this.synchronizers[alias]){
            // console.log(this.loggerPrefix() ,' _synAdd add', alias, element)
            this.synchronizers[alias].add(element)
          }
        }
      }
    }
  }

  this._synRemove = (element) => {
    if(element){
      for(var key in this.bodyPartGroups){
        let group = this.bodyPartGroups[key]
        if(key && group && this.groupSynchronizers[key]){
          // console.log(this.loggerPrefix() ,' _synRemove', key, element)
          this.groupSynchronizers[key].remove(element)
        }
      }
      for(var alias in this.synchronizers){
        if(alias && this.synchronizers[alias]){
          // console.log(this.loggerPrefix() ,' _synRemove', alias, element)
          this.synchronizers[alias].remove(element)
        }
      }
    }
  }

  this.clear = () => {
    for(var item in this.elements){
      this._synRemove(item)
    }
    this.elements = []
    this.synchronizers = {}
  }
}

//定位线同步器
function AppReferenceLineSynchronizer(syncName) {
  let _synName = syncName || 'appRefLineSynchronizer'
  this.defaultName = _synName
  //是否可用
  this.disabled = false
  //策略
  this.strategy = SYNCHRONIZERS_CONFIG.strategy.default

  this.elements = [] //当前加入对比的元素
  this.refElements = [] //当前存在定位线的元素（elements的子集）
  this.activeElement = null //当前选中的元素，如果此发生改变，则会触发refElements的重新计算
  this._synchronizer = new cornerstoneTools.Synchronizer(cornerstone.EVENTS.NEW_IMAGE, cornerstoneTools.updateImageSynchronizer);

  this.loggerPrefix = () => {
    return "### AppReferenceLineSynchronizer["+this.defaultName+"]/strategy:"+this.strategy+"/disabled:"+this.disabled+"/ ~ "
  }

  this.add = (element) => {
    // console.log('e', element)
    if (typeof element === 'function') return
    if(element && this.elements.indexOf(element) < 0){
      this.elements.push(element)
      //存在定位线
      let existRef = this.existReferenceLine(this.activeElement, element)
      if(existRef){
        this.addRefElement(element)
      }
    }
  }

  this.addRefElement = (element) => {
    if(element && this.refElements.indexOf(element) < 0){
      this.refElements.push(element)
      if(!this.disabled){
        this.enable(element)
      }
    }
  }

  this.remove = (element) => {
    if(element){
      let index = this.elements.indexOf(element)
      if(index >= 0){
        this.elements.splice(index, 1)
      }
      this.removeRefElement(element)
    }
  }

  this.removeRefElement = (element) => {
    if(element){
      let index = this.refElements.indexOf(element)
      if(index >= 0){
        this.refElements.splice(index, 1)
      }
      try {
        this.disable(element)
      } catch (error) {
        console.log(this.loggerPrefix(), 'removeRefElement(element) error:', error)
      }
    }
  }

  this.enable = (element) => {
    if(element){
      if(typeof element == 'function') return
      try {
        this._synchronizer.add(element);
        // enable reference Lines tool
        cornerstoneTools.referenceLines.tool.enable(element, this._synchronizer, this.renderer);
      } catch (error) {
        console.log(this.loggerPrefix(), 'enable(element) error:', error)
      }
    } else {
      this.disabled = false
      //重新计算refElements的所有元素
      this.refreshRefElements()
    }
  }

  this.disable = (element) => {
    if(element ){
      if(typeof element == 'function') return
      try {
        cornerstoneTools.referenceLines.tool.disable(element);
        this._synchronizer.remove(element)
      } catch (error) {
        console.log(this.loggerPrefix(), 'disable(element) error:', error)
      }
    } else {
      this.disabled = true
      //删除refElements的所有元素
      this.clearRefElements()
    }
  }

  this.setActiveElement = (element)=>{
    //移除之前的activeElement
    if(this.activeElement){
      this.disable(this.activeElement)
    }

    this.activeElement = element
    //chong
    this.clearRefElements()
    this.refreshRefElements()
    try {
      if(this.activeElement){
        this.enable(this.activeElement)
        //当前元素不显示定位线
        cornerstoneTools.referenceLines.tool.disable(this.activeElement);
      }
    } catch (error) {
      console.log(this.loggerPrefix(), 'setActiveElement(element) error:', error)
    }

  }

  /**
   * //重新计算refElements的所有元素
   */
  this.refreshRefElements = ()=>{
    for(var i in this.elements){
      let element = this.elements[i]
      let existRef = this.existReferenceLine(this.activeElement, element)
      if(existRef){
        this.addRefElement(element)
      } else {
        this.removeRefElement(element)
      }
    }
  }

  /**
   * //删除refElements的所有元素
   */
  this.clearRefElements = ()=>{
    for(var i in this.refElements){
      this.disable(this.refElements[i])
    }
    this.refElements = []
  }

  this.clear = ()=>{
    this.clearRefElements()
    this.refElements = []
    this.elements = []
    this.activeElement = null
  }

  this.existReferenceLine = function(targetElement, referenceElement){
    if(!targetElement || !referenceElement || targetElement == referenceElement){
      return null
    }
    if(typeof targetElement == 'function' || typeof referenceElement == 'function'){
      return null
    }
      // console.log("existReferenceLine", targetElement, referenceElement);
      const targetImage = cornerstone.getEnabledElement(targetElement).image;
      const referenceImage = cornerstone.getEnabledElement(referenceElement).image;

      // Make sure the images are actually loaded for the target and reference
      if (!targetImage || !referenceImage) {
          // console.log("!targetImage || !referenceImage", targetImage, referenceImage);
          return null;
      }
      const targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImage.imageId);
      const referenceImagePlane = cornerstone.metaData.get('imagePlaneModule', referenceImage.imageId);

      // Make sure the target and reference actually have image plane metadata
      // console.log("targetImagePlane , referenceImagePlane", targetImagePlane, referenceImagePlane);
      if (!targetImagePlane ||
              !referenceImagePlane ||
              !targetImagePlane.rowCosines ||
              !targetImagePlane.columnCosines ||
              !targetImagePlane.imagePositionPatient ||
              !referenceImagePlane.rowCosines ||
              !referenceImagePlane.columnCosines ||
              !referenceImagePlane.imagePositionPatient) {
          return null;
      }
      // The image planes must be in the same frame of reference
      if (targetImagePlane.frameOfReferenceUID !== referenceImagePlane.frameOfReferenceUID) {
          // console.log("frameOfReferenceUID", targetImagePlane.frameOfReferenceUID, referenceImagePlane.frameOfReferenceUID);
          return null;
      }

      targetImagePlane.rowCosines = this.convertToVector3(targetImagePlane.rowCosines);
      targetImagePlane.columnCosines = this.convertToVector3(targetImagePlane.columnCosines);
      targetImagePlane.imagePositionPatient = this.convertToVector3(targetImagePlane.imagePositionPatient);
      referenceImagePlane.rowCosines = this.convertToVector3(referenceImagePlane.rowCosines);
      referenceImagePlane.columnCosines = this.convertToVector3(referenceImagePlane.columnCosines);
      referenceImagePlane.imagePositionPatient = this.convertToVector3(referenceImagePlane.imagePositionPatient);

      // The image plane normals must be > 30 degrees apart
      const targetNormal = targetImagePlane.rowCosines.clone().cross(targetImagePlane.columnCosines);
      const referenceNormal = referenceImagePlane.rowCosines.clone().cross(referenceImagePlane.columnCosines);
      let angleInRadians = targetNormal.angleTo(referenceNormal);

      angleInRadians = Math.abs(angleInRadians);
      if (angleInRadians < 0.5) { // 0.5 radians = ~30 degrees
          // console.log("angleInRadians < 0.5");
          return null;
      }

      const referenceLine = cornerstoneTools.referenceLines.calculateReferenceLine(targetImagePlane, referenceImagePlane);
      return referenceLine;
  }

  this.convertToVector3 = function(arrayOrVector3) {
      if (arrayOrVector3 instanceof cornerstoneMath.Vector3) {
          return arrayOrVector3;
      }
      return new cornerstoneMath.Vector3(arrayOrVector3[0], arrayOrVector3[1], arrayOrVector3[2]);
  }

  /**
   * 自定义定位线的计算
   */
  const that = this;
  this.renderer = function (context, eventData, targetElement, referenceElement) {
    if (targetElement != that.activeElement && referenceElement != that.activeElement) {
      return;
    }
    // const cornerstone = external.cornerstone;
    const targetImage = cornerstone.getEnabledElement(targetElement).image;
    const referenceImage = cornerstone.getEnabledElement(referenceElement).image;

    // Make sure the images are actually loaded for the target and reference
    if (!targetImage || !referenceImage) {
      return;
    }

    const targetImagePlane = cornerstone.metaData.get('imagePlaneModule', targetImage.imageId);
    const referenceImagePlane = cornerstone.metaData.get('imagePlaneModule', referenceImage.imageId);

    // Make sure the target and reference actually have image plane metadata
    if (!targetImagePlane ||
          !referenceImagePlane ||
          !targetImagePlane.rowCosines ||
          !targetImagePlane.columnCosines ||
          !targetImagePlane.imagePositionPatient ||
          !referenceImagePlane.rowCosines ||
          !referenceImagePlane.columnCosines ||
          !referenceImagePlane.imagePositionPatient) {
      return;
    }

    // The image planes must be in the same frame of reference
    if (targetImagePlane.frameOfReferenceUID !== referenceImagePlane.frameOfReferenceUID) {
      return;
    }

    targetImagePlane.rowCosines = that.convertToVector3(targetImagePlane.rowCosines);
    targetImagePlane.columnCosines = that.convertToVector3(targetImagePlane.columnCosines);
    targetImagePlane.imagePositionPatient = that.convertToVector3(targetImagePlane.imagePositionPatient);
    referenceImagePlane.rowCosines = that.convertToVector3(referenceImagePlane.rowCosines);
    referenceImagePlane.columnCosines = that.convertToVector3(referenceImagePlane.columnCosines);
    referenceImagePlane.imagePositionPatient = that.convertToVector3(referenceImagePlane.imagePositionPatient);

    // The image plane normals must be > 30 degrees apart
    const targetNormal = targetImagePlane.rowCosines.clone().cross(targetImagePlane.columnCosines);
    const referenceNormal = referenceImagePlane.rowCosines.clone().cross(referenceImagePlane.columnCosines);
    let angleInRadians = targetNormal.angleTo(referenceNormal);

    angleInRadians = Math.abs(angleInRadians);
    if (angleInRadians < 0.5) { // 0.5 radians = ~30 degrees
      return;
    }

    const referenceLine = cornerstoneTools.referenceLines.calculateReferenceLine(targetImagePlane, referenceImagePlane);

    if (!referenceLine) {
      return;
    }

    const color = cornerstoneTools.toolColors.getActiveColor();

    // Draw the referenceLines
    context.setTransform(1, 0, 0, 1, 0, 0);

    cornerstoneTools.drawing.draw(context, (context) => {
      cornerstoneTools.drawing.drawLine(context, eventData.element, referenceLine.start, referenceLine.end, { color });
    });
  }

}

function getTextCallback(doneChangingTextCallback){
  var position = $("input:hidden[name='annotation-position']").val();
  if(position){
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var positionX = parseInt(position.split(',')[0])
    var positionY = parseInt(position.split(',')[1])
    //#宽度减120(序列显示区域宽度)#减240(弹出框宽度: 防止弹出框超出图像显示区域))
    if(positionX + 247 > windowWidth){
      positionX = positionX - 120 - 240;
    }else{
      positionX = positionX - 120 + 5;
    }
    //#高度减116(功能操作面板高度)#减72(弹出窗高度: 防止弹出框超出图像显示区域)
    if(positionY + 77 > windowHeight){
      positionY = positionY - 116 - 72;
    }else{
      positionY = positionY - 116 + 5;
    }
    $("#annotation-dialog").css({'left': positionX,'top': positionY})
  }else{
    $("#annotation-dialog").css({'left': '40%','top': '40%'})
  }
  $("#annotation-dialog").show();
  $("#annotation-input").focus();
  // 这句一定不能少
  $("#annotation-btn").off('click');
  $("#annotation-btn").on('click', function(){
      doneChangingTextCallback($("#annotation-input").val());
      $("#annotation-input").val('');
      $("#annotation-dialog").hide();
  });
}
