<template>
<div :class="['zy-dicom-element', className, options && options.active ? 'active' : '', options && options.unique ? 'unique-fixed' : '']"
  v-show="options.visible"
  :id="elementId"
  @click="handleClick"
  @dblclick="handleDblClick"
  v-resize="onResize">
  <div class="zy-dicom-element-placeholder" v-show="!(options && options.image && options.image.imageZid && options.image.loadUrl)">
    <div>{{placeholder}}</div>
    <div>Box: {{options.boxIndex}}</div>
    <div>Image: {{options.elementIndex}}</div>
  </div>
  <div class="zy-dicom-element-loading" v-show="options && options.image && !imgLoadFinished && options._loadStatus != 'fail'">
    <div class="loading-label">Loading</div>
    <DicomLoadingSpinner />
  </div>
  <div class="zy-dicom-element-layer top-left" v-show="options && options.image && imgLoadFinished">
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-PatientName')">姓名:{{layerData.patientName}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-PatientId')">标识:{{layerData.patientId}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-PatientGender')">性别:{{layerData.patientGender}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-PatientAge')">年龄:{{layerData.patientAge}}</div>
  </div>
  <div class="zy-dicom-element-layer top-right" v-show="options && options.image && imgLoadFinished">
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-StudyDate')">检查日期:{{layerData.studyDate}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-StudyDate')">{{layerData.xRayTubeCurrent}}mA {{layerData.kvp}}KV</div>
    
  </div>
  <div class="zy-dicom-element-layer bottom-left" v-show="options && options.image && imgLoadFinished">
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-ImageScale')">层厚:{{layerData.sliceThickness}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-ImageScale')">缩放:{{layerData.scale}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-ImageWwwc')">窗宽窗位:{{layerData.windowWidth}}/{{layerData.windowCenter}}</div>
  </div>
  <div class="zy-dicom-element-layer bottom-right" v-show="options && options.image && imgLoadFinished">
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-StackIndex')">序列:{{layerData.stackIndex + 1}}</div>
    <div v-show="appManager.isVisibleOfImage4Corner('I4C-ImageIndex')">图像:{{layerData.imageIndex+1}}/{{layerData.imageTotal}}</div>
  </div>
  <div class="zy-dicom-element-layer middle-right dicom-ruler" v-show="options && options.image && imgLoadFinished">
    <canvas class="dicom-ruler-canvas" v-show="appManager.isVisibleOfImage4Corner('I4C-ImageRuler')"></canvas>
  </div>
</div>
</template>
<script>
import resize from 'vue-resize-directive'
import DicomLoadingSpinner from './dicomLoadingSpinner'
export default {
  directives: {
    resize,
  },
  components: {
    DicomLoadingSpinner,
  },
  props: {
    appManager: {
      type: Object,
      default: function () {
        return null
      }
    },
    placeholder: {
      type: String,
      default: function () {
        return 'No Dicom File'
      }
    },
    //添加css
    className: {
      type: String,
      default: function () {
        return ''
      }
    },
    //具体参数
    options: {
      type: Object,
      default: function () {
        return {
          pageIndex: 0, //页码, 从1开始
          boxIndex: 0, //本页布局中的序号, 从1开始
          elementIndex: 0, //元素序号, 从1开始
          stackIndex : 0, //序列序号, 从0开始
          imageIndex: 0, //图像序号, 从0开始
          active: false, //当前是否选中
          visible: false, //当前是否可见
          unique: false, //当前是否是唯一可见的（双击切换）
          //元素大小位置
          style: {
            width: 0,
            height: 0,
            position: null,
            top: null,
            left: null,
          },
          //实际图像
          image: {
            _loadStatus: null,//图片加载状态
            _loadPercent: null,//图片加载状态
            imageZid: null,
            loadUrl: null,
          },
          triggerTransform: null, //图像变换方式,
          presetWwwc: null, //预设窗宽窗位
          isPlaying: false, //当前是否处于播放模式
          syncs: new Array(), //app manager 中的同步器 别名
          bodyPartExamined: null, //检查部位
          imageDataSet: {}, // 图片的tag数据
        }
      }
    },
  },
  watch: {
    //刷新图片
    'options.image'(image){
      try {
        this.options.isPlaying = false
        if(image && image.loadUrl && image.loadUrl.length > 0){
          // console.log('%%% image changed at ', this.elementId, image.imageZid)
          this.loadAndCacheImage()
        } else {
          this.options.syncs = []
          this.removeImage()
        }
      } catch (error) {
        console.log(error)
      }
    },
    'options.syncs'(){
      try {
        this.synSyncs()
      } catch (error) {
        console.log(error)
      }
    },
    'options.syncs.length'(){
      try {
        this.synSyncs()
      } catch (error) {
        console.log(error)
      }
    },
    'options.triggerTransform'(transform){
      try {
        if(transform && this.options && this.options.image){
          this.triggerImageTransform()
        }
      } catch (error) {
        console.log(error)
      }
    },
    'options.presetWwwc'(wwwc){
      try {
        if(wwwc && this.options && this.options.image){
          this.triggerImagePresetWwwc()
        }
      } catch (error) {
        console.log(error)
      }
    },
    'options.active'(active){
      try {
        let element = this.$el
        if(active && element && this.options && this.options.image){
          this.appManager.toggleRefLineActiveElement(element)
        }
      } catch (error) {
        console.log(error)
      }
    },
    'options.isPlaying'(){
      try {
        let element = this.$el
        let playFlag = this.options.isPlaying
        // console.log('#### cloadImageInElement Play.', playFlag)
        if(playFlag){
          this.appManager.handleElementTransform(element, 'playClip')
        } else {
          this.appManager.handleElementTransform(element, 'stopClip')
        }
      } catch (error) {
        console.log(error)
      }
    },
    'options.imageDataSet'(dataSet){
      try {
        let element = this.$el
        if(dataSet && dataSet.elements){
          this.options.bodyPartExamined = dataSet.string('x00180015')
          let bodyPartExamined = this.options.bodyPartExamined || 'unknown'
          // console.log('#### options.imageDataSet changed.', this.elementId, bodyPartExamined)
          this.appManager.toggleElementCommonSyncs(element, 'wwwc', bodyPartExamined)
          this.appManager.toggleElementCommonSyncs(element, 'panZoom', bodyPartExamined)
          this.appManager.toggleElementCommonSyncs(element, 'stackImageIndex', bodyPartExamined)
          // this.appManager.toggleElementCommonSyncs(element, 'updateImage', bodyPartExamined)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  data(){
    return {
      elementId: ("zydcm_" +Math.random()).replace('.',''),
      imgLoadFinished: false, // 加载提示
      renderedDetail: null, //图片渲染数据
      layerData: {
        patientId: null,
        patientName: null,
        patientAge: null,
        patientGender: null,
        studyDate: null,
        scale: null,
        windowWidth: null,
        windowCenter: null,
        stackIndex: null,
        imageIndex: null,
        imageTotal: null,
        bodyPartExamined: null
      },
      currSyncs : new Array(), //app manager 中的同步器 别名
    }
  },
  mounted(){
    let imageId = this.options && this.options.image ? this.options.image.loadUrl : null
    // console.log('#### mounted ok.', this.elementId, imageId)
    if(imageId && imageId.length > 0){
      this.loadAndCacheImage()
    }
  },
  methods: {
    handleClick(){
      this.$emit('on-click', this.options)
    },
    handleDblClick(){
      this.$emit('on-dblclick', this.options)
    },
    loadAndCacheImage(){
      let element = this.$el
      let imageId = this.options.image.loadUrl
      if(!this.appManager){
        console.log('#### can not find appManager.')
        return
      }
      // console.log('#### loadAndCacheImage.', element, imageId)
      if(element && imageId && this.appManager){
        let self = this
        this.imgLoadFinished = false
        this.appManager.loadImageInElement(element, imageId, this.onImageRendered, () => {
          // console.log('#### cloadImageInElement ok.', imageId)
          self.imgLoadFinished = true
          //加入同步器
          let syncs = self.options.syncs
          if(syncs.indexOf('wwwc') < 0) syncs.push('wwwc')
          if(syncs.indexOf('panZoom') < 0) syncs.push('panZoom')
          if(syncs.indexOf('stackImageIndex') < 0) syncs.push('stackImageIndex')
          // if(syncs.indexOf('updateImage') < 0) syncs.push('updateImage')
        })
      }
    },
    //移除图片
    removeImage(){
      // console.log('#### removeImage.', this.$el)
      this.renderedDetail = null
      for(let key in this.layerData){
        this.layerData[key] = null
      }
      this.options.triggerTransform = null
      this.options.syncs = []
      this.options.bodyPartExamined = null
      this.options.imageDataSet = null

      let element = this.$el
      this.appManager.removeElement(element)
      this.imgLoadFinished = false
    },
    //元素大小改变
    onResize(){
      let element = this.$el
      if(element && this.options && this.options.image){
        this.appManager.handleElementResize(element)
      }
    },

    triggerImageTransform(transform){
      let element = this.$el
      if(element && this.options && this.options.image){
        let transform = this.options.triggerTransform
        console.log('#### element triggerImageTransform.', transform)
        if(transform == 'saveAsPng'){
          let fileName = 'png' + Math.random()
          if(this.layerData){
            fileName = this.layerData.patientId + '-' + (this.layerData.stackIndex+1) + '-' + (this.layerData.imageIndex+1)
          }
          fileName = fileName + '.png'
          this.appManager.saveElementAsPng(element, fileName)
        } else if(transform == 'exportDcm'){
          let dcmfilename = 'dcm_' + Math.random()
          if(this.layerData){
            dcmfilename = this.layerData.patientId + '-' + (this.layerData.stackIndex+1) + '-' + (this.layerData.imageIndex+1)
          }
          dcmfilename = dcmfilename + '.dcm'
          this.appManager.exportElementAsDcm(element, dcmfilename)
        } else if(transform == 'screenshot'){
          //screenshot 截图
          this.$emit('on-screenshot', this.options, this.appManager.screenshotElement(element))
        } else {
          this.appManager.handleElementTransform(element, transform)
        }
        this.options.triggerTransform = null
      }
    },

    triggerImagePresetWwwc(wwwc){
      let element = this.$el
      if(element && this.options && this.options.image){
        let wwwc = this.options.presetWwwc
        // console.log('#### element triggerImagePresetWwwc.', wwwc)
        this.appManager.handleElementPresetWwwc(element, wwwc)
        this.options.presetWwwc = null
      }
    },

    synSyncs(){
      //移除多余的同步器
      let syncs = this.options.syncs
      if(syncs && this.currSyncs){
        //移除多余的同步器
        for(var i in this.currSyncs){
          let synName = this.currSyncs[i]
          if(syncs.indexOf(synName) < 0){
            this.removeFromSynchronizer(synName)
          }
        }
        //增加新的同步器
        for(var j in syncs){
          let synName = syncs[j]
          if(this.currSyncs.indexOf(synName) < 0){
            this.putIntoSynchronizer(synName)
          }
        }
        this.currSyncs = JSON.parse(JSON.stringify(syncs))
      }
    },

    putIntoSynchronizer(syncName){
      let element = this.$el
      if(element && this.options && this.options.image && syncName){
        this.appManager.putElementIntoSynchronizer(element, syncName)
      }
    },

    removeFromSynchronizer(syncName){
      let element = this.$el
      if(element && syncName){
        this.appManager.removeElementFromSynchronizer(element, syncName)
      }
    },

    onImageRendered(eventDetail, stackData, imagePlane){
      // console.log('#### element onImageRendered.', this.elementId, eventDetail, stackData, imagePlane)
      this.renderedDetail = eventDetail || {} //appmanager 事件detail
      let studyDetail = stackData ? stackData.studyDetail : {}
      if(eventDetail){
        let dataSet = eventDetail.image ? eventDetail.image.data : null
        dataSet = dataSet || {string: (v) => {return v}}
        this.layerData.patientName = studyDetail.patientName || dataSet.string('x00100010')
        this.layerData.patientId = studyDetail.patientId || dataSet.string('x00100020')
        this.layerData.seriesInstanceUID = dataSet.string('x0020000e')
        this.layerData.patientGender = studyDetail.gender || dataSet.string('x00100040')
        this.layerData.patientAge = (studyDetail.age ? studyDetail.age + studyDetail.ageUnit : null) || dataSet.string('x00101010')
        this.layerData.patientBirthDate = dataSet.string('x00100030')
        this.layerData.studyDate = dataSet.string('x00080020')
        this.layerData.bodyPartExamined = dataSet.string('x00180015')
        this.layerData.sliceThickness = Number(dataSet.string('x00180050') || 0)
        this.layerData.xRayTubeCurrent = Number(dataSet.string('x00181151') || 0)
        this.layerData.kvp = Number(dataSet.string('x00180060') || 0)
        //image DataSet
        this.options.imageDataSet = dataSet
        //
        const viewport = eventDetail.viewport
        this.layerData.scale = viewport.scale.toFixed(2);
        this.layerData.windowWidth = Math.round(viewport.voi.windowWidth)
        this.layerData.windowCenter = Math.round(viewport.voi.windowCenter)
        this.layerData.stackIndex = stackData ? stackData.stackIndex : -1
        this.layerData.imageIndex = stackData ? stackData.currentImageIdIndex : 0
        this.layerData.imageTotal = stackData && stackData.imageIds ? stackData.imageIds.length : 0
      }
      this.drawRulerInCanvas(eventDetail, imagePlane)
    },

    //绘画刻度尺
    drawRulerInCanvas(eventDetail, imagePlane){
      let rulerDiv = this.$el.getElementsByClassName("dicom-ruler")[0]
      let canvas = rulerDiv ? rulerDiv.firstChild : null;
      if(!rulerDiv || !canvas || !eventDetail){
        return
      }
      canvas.width = rulerDiv.clientWidth;
      canvas.height = rulerDiv.clientHeight;
      // console.log("canvas###" + canvas.width + "/" + canvas.height, canvas);
      let cw = canvas.width;
      let ch = canvas.height;
      //默认位置，没有计算，刻度不准确，用于测试
      var x_center = 0.5 * cw;
      var y_center = 0.5 * ch;
      var y_top = 0.2 * ch;
      var y_bottom = 0.8 * ch;
      //图像刻度尺的长度，5cm 或者 10cm，根据图像的缩放比例决定
      var rulerTotalCm = 5;//总共有多少cm
      var oneCmPixelNum = 0;//1cm多少像素点,>0表示已计算出图片的实际长度值
      //获取图像的scale,rowPixelSpacing (垂直距离，单位为毫米或未定义)
      const viewport = eventDetail.viewport;
      const image = eventDetail.image;

      var imageRows = image.rows;
      var vpScale = viewport.scale;

      let rowPixelSpacing;
      let colPixelSpacing;
      try {
        if (imagePlane) {
            rowPixelSpacing = imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing;
            colPixelSpacing = imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing;
        } else {
            rowPixelSpacing = image.rowPixelSpacing;
            colPixelSpacing = image.columnPixelSpacing;
        }
      } catch (error) {
          console.log(error);
      }
      // Set the length text suffix depending on whether or not pixelSpacing is available
      let suffix = ' mm';
      if (!rowPixelSpacing || !colPixelSpacing) {
          suffix = ' pixels';
      }
      if(rowPixelSpacing){
          var screenPixelSpacing = rowPixelSpacing / vpScale;//屏幕像素之间表达的实际距离，单位mm
          var rulerMaxValue = Math.floor(ch * 0.8 * screenPixelSpacing / 10);//cm,刻度尺最大占到高度的80%
          rulerTotalCm = rulerMaxValue > 10 ? 10 : 5;
          oneCmPixelNum = Math.round(10 / screenPixelSpacing);
      }
      if(oneCmPixelNum > 0){
          y_top = (ch - rulerTotalCm * oneCmPixelNum) / 2;
          y_bottom = ch - y_top;
      }
      // console.log("rowPixelSpacing###" + rowPixelSpacing + "/" + screenPixelSpacing + "/" + oneCmPixelNum + "/" + rulerTotalCm);
      var context = canvas.getContext("2d");
      context.save();
      // context.strokeStyle="#ffa500";//orange
      // context.fillStyle="#ffa500";//orange
      context.strokeStyle="#bebebe";
      context.fillStyle="#bebebe";
      context.beginPath();
      //y轴
      context.moveTo(x_center + 3, y_top);
      context.lineTo(x_center + 3, y_bottom);
      // console.log("beginPath###" + x_center + "/" + y_top + "/" + y_bottom);
      //从上到下依次绘制短横线
      var y_scale = (y_bottom - y_top) / rulerTotalCm;
      for(var i = 0; i <= rulerTotalCm; i++){
          var y_i = y_top + y_scale * i;
          context.moveTo(x_center + 3, y_i);
          context.lineTo(x_center - 3, y_i);
      }
      //刻度说明
      if(oneCmPixelNum > 0){
          context.font="10px sans-serif";
          context.textBaseline="top";
          context.fillText(rulerTotalCm+" cm", 0 , y_bottom + 5);
      }
      //重绘
      context.stroke();
      context.restore();
    }
  }
}
</script>
<style lang="less" scoped>
.zy-dicom-element {
  position: relative;
  text-align: center;
  .zy-dicom-element-placeholder {
    // display: inline-block;
    // margin: auto;
    font-size: 13px;
    color: #333;
    font-style: italic;
    font-weight: bold;
  }
  .zy-dicom-element-loading {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    font-size: 16px;
    font-weight: bold;
    color: #ccc;
    background-color: rgba(158, 158, 158, 0.2);
    .loading-label {
      width: 72px;
      height: 24px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -36px;
      margin-top: -42px;
    }
  }
  .zy-dicom-element-layer {
    position: absolute;
    padding: 2px;
    font-size: 12px;
    line-height: 14px;
    color: #bebebe;
    -moz-user-select: -moz-none;
    user-select: none;
    &.top-left {
      top: 0px;
      left: 0px;
      text-align: left;
    }
    &.top-right {
      top: 0px;
      right: 0px;
      text-align: right;
    }
    &.bottom-left {
      bottom: 0px;
      left: 0px;
      text-align: left;
    }
    &.bottom-right {
      bottom: 0px;
      right: 0px;
      text-align: right;
    }
    &.middle-right {
      top: 0px;
      bottom: 0px;
      right: 2px;
      width: 30px;
      background: 0 0;
      padding: 0;
    }
  }
}
</style>

