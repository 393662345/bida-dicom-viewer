import Vue from 'vue'
/**
 * 表格列的定义
 */
function ViewerFuncItem(code, name) {
  this.code = code
  this.name = name
  this.active = false //当前item 是否处于激活/选中状态
  this.enableToggle = false // 是否可以true/false切换
  this.mode = '2d'
  this.handlers = {
    '2d': () => {},
    '3d': () => {},
  }
  this.params = null //默认参数
  this.iconClass = 'icon-layout'
  this.loggerPrefix = "### ViewerFuncItem["+this.name+"] ~ "
  return this
}

ViewerFuncItem.prototype.setIconClass = function(iconClass) {
  this.iconClass = iconClass;
  return this;
}

ViewerFuncItem.prototype.setMode = function(mode) {
  this.mode = mode;
  return this;
}

ViewerFuncItem.prototype.setGroup = function(group) {
  this.group = group;
  return this;
}

ViewerFuncItem.prototype.setParams = function(params) {
  this.params = params;
  return this;
}

ViewerFuncItem.prototype.setActive = function(active) {
  this.active = active
  return this;
}

ViewerFuncItem.prototype.setEnableToggle = function(enableToggle) {
  this.enableToggle = enableToggle
  return this;
}

ViewerFuncItem.prototype.setHandlers = function(handlers) {
  this.handlers = handlers
  return this;
}

ViewerFuncItem.prototype.handleClick = function(mode) {
  let handler = this.getHandler(mode)
  if(handler){
    handler(this, this.params)
  } else {
    console.log(this.loggerPrefix, "Event['click'] handler not found. mode:", mode)
  }
}

ViewerFuncItem.prototype.addClickHandler = function(mode, handler) {
  if(mode && handler){
    this.handlers[mode] = handler
  }
}

ViewerFuncItem.prototype.getHandler = function(mode) {
  return mode && this.handlers ? this.handlers[mode] : null
}

export const wwwc = new ViewerFuncItem("wwwc", "调窗").setGroup('mouseLeftBtn').setIconClass('icon-wwwc')
export const pan = new ViewerFuncItem("pan", "移动").setGroup('mouseLeftBtn').setIconClass('icon-pan')
export const zoom = new ViewerFuncItem("zoom", "缩放").setGroup('mouseLeftBtn').setIconClass('icon-zoom')
export const stackScroll = new ViewerFuncItem("stackScroll", "滚图").setGroup('mouseLeftBtn').setIconClass('icon-scroll')
export const huValue = new ViewerFuncItem("huValue", "HU值").setGroup('mouseLeftBtn').setIconClass('icon-hu-value')
export const huAreaValue = new ViewerFuncItem("huAreaValue", "区域HU值").setGroup('mouseLeftBtn').setIconClass('icon-hu-area')
//图像操作
export const invert = new ViewerFuncItem("invert", "负像").setGroup('enableOnce').setIconClass('icon-invert')
export const vflip = new ViewerFuncItem("vflip", "上下翻转").setGroup('enableOnce').setIconClass('icon-flip-up-down')
export const hflip = new ViewerFuncItem("hflip", "左右翻转").setGroup('enableOnce').setIconClass('icon-flip-left-right')
export const rotate = new ViewerFuncItem("rotate", "旋转").setGroup('enableOnce').setIconClass('icon-rotate')
export const reset = new ViewerFuncItem("reset", "复原").setGroup('enableOnce').setIconClass('icon-reset')
export const clockwise = new ViewerFuncItem("rotate+90", "顺时针").setGroup('enableOnce').setIconClass('icon-rotate-clockwise')
export const anticlockwise = new ViewerFuncItem("rotate-90", "逆时针").setGroup('enableOnce').setIconClass('icon-rotate-anticlockwise')
//预设操作
export const brain = new ViewerFuncItem("brain", "颅脑").setGroup('presetWwwc').setIconClass('icon-wwwc-brain').setParams({windowWidth: 1600, windowCenter: 450})
export const lung = new ViewerFuncItem("lung", "肺窗").setGroup('presetWwwc').setIconClass('icon-wwwc-lung').setParams({windowWidth: 1000, windowCenter: -650})
export const belly = new ViewerFuncItem("belly", "腹部").setGroup('presetWwwc').setIconClass('icon-wwwc-belly').setParams({windowWidth: 1500, windowCenter: -700})
export const skeleton = new ViewerFuncItem("skeleton", "骨骼").setGroup('presetWwwc').setIconClass('icon-wwwc-skeleton').setParams({windowWidth: 1600, windowCenter: 550})
// export const custom1 = new ViewerFuncItem("custom1", "自定义1").setGroup('enableOnce').setIconClass('aaa')
// export const custom2 = new ViewerFuncItem("custom2", "自定义2").setGroup('enableOnce').setIconClass('aaa')
//测量工具
export const arrowAnnotate = new ViewerFuncItem("arrowAnnotate", "箭头").setGroup('mouseLeftBtn').setIconClass('icon-arrow')
export const length = new ViewerFuncItem("length", "长度").setGroup('mouseLeftBtn').setIconClass('icon-line')
export const simpleAngle = new ViewerFuncItem("simpleAngle", "角度").setGroup('mouseLeftBtn').setIconClass('icon-angle')
export const rectangleRoi = new ViewerFuncItem("rectangleRoi", "矩形").setGroup('mouseLeftBtn').setIconClass('icon-rectangle')
export const ellipticalRoi = new ViewerFuncItem("ellipticalRoi", "椭圆").setGroup('mouseLeftBtn').setIconClass('icon-ellipse')
export const freehand = new ViewerFuncItem("freehand", "自由画").setGroup('mouseLeftBtn').setIconClass('icon-free-hand')
export const probe = new ViewerFuncItem("probe", "点").setGroup('mouseLeftBtn').setIconClass('icon-point')
export const eraser = new ViewerFuncItem("eraser", "橡皮擦").setGroup('mouseLeftBtn').setIconClass('icon-eraser')
export const magnify = new ViewerFuncItem("magnify", "放大镜").setGroup('mouseLeftBtn').setIconClass('icon-magnify')
//清除
export const clearTools = new ViewerFuncItem("clearTools", "清除").setGroup('enableOnce').setIconClass('icon-clear')
//播放
export const scrollPrev = new ViewerFuncItem("scrollPrev", "向前").setGroup('enableOnce').setIconClass('icon-play-prev')
export const scrollNext = new ViewerFuncItem("scrollNext", "向后").setGroup('enableOnce').setIconClass('icon-play-next')
export const play = new ViewerFuncItem("play", "播放").setGroup('enableOnce').setIconClass('icon-play')
export const lowSpeed = new ViewerFuncItem("lowSpeed", "慢").setGroup('enableOnce').setIconClass('').setParams(5)
export const normalSpeed = new ViewerFuncItem("normalSpeed", "中").setGroup('enableOnce').setIconClass('').setParams(10)
export const quickSpeed = new ViewerFuncItem("quickSpeed", "快").setGroup('enableOnce').setIconClass('').setParams(15)
export const original = new ViewerFuncItem("original", "原图").setGroup('enableOnce').setIconClass('icon-original')
export const fitToWindow = new ViewerFuncItem("fitToWindow", "窗口适配").setGroup('enableOnce').setIconClass('icon-fit-window')
export const exportDcm = new ViewerFuncItem("exportDcm", "文件导出").setGroup('enableOnce').setIconClass('icon-export-file')
export const saveAsPng = new ViewerFuncItem("saveAsPng", "保存").setGroup('enableOnce').setIconClass('icon-save')
export const reportRoi = new ViewerFuncItem("reportRoi", "报告ROI").setGroup('enableOnce').setIconClass('icon-roi-report')

//四角显示信息控制
export const layerPatientName = new ViewerFuncItem("I4C-PatientName", "患者姓名").setGroup('image4Corner').setIconClass('')
export const layerPatientId = new ViewerFuncItem("I4C-PatientId", "检查ID").setGroup('image4Corner').setIconClass('')
export const layerPatientGender = new ViewerFuncItem("I4C-PatientGender", "患者性别").setGroup('image4Corner').setIconClass('')
export const layerPatientAge = new ViewerFuncItem("I4C-PatientAge", "患者年龄").setGroup('image4Corner').setIconClass('')
export const layerStudyDate = new ViewerFuncItem("I4C-StudyDate", "检查日期").setGroup('image4Corner').setIconClass('')
export const layerImageScale = new ViewerFuncItem("I4C-ImageScale", "缩放比例").setGroup('image4Corner').setIconClass('')
export const layerImageWwwc = new ViewerFuncItem("I4C-ImageWwwc", "窗宽窗位").setGroup('image4Corner').setIconClass('')
export const layerImageRuler = new ViewerFuncItem("I4C-ImageRuler", "刻度尺").setGroup('image4Corner').setIconClass('')
export const layerStackIndex = new ViewerFuncItem("I4C-StackIndex", "序列序号").setGroup('image4Corner').setIconClass('')
export const layerImageIndex = new ViewerFuncItem("I4C-ImageIndex", "图像序号").setGroup('image4Corner').setIconClass('') 

//MPR / 3D
// export const mprOpen3d = new ViewerFuncItem("mprOpen3d", "打开/关闭3D").setGroup('mprEnableOnce')
export const mprWwwc = new ViewerFuncItem("mprWwwc", "调窗").setGroup('mprMouseLeftBtn').setIconClass('icon-wwwc')
export const mprPan = new ViewerFuncItem("mprPan", "移动").setGroup('mprMouseLeftBtn').setIconClass('icon-pan').setParams({Tag:'changeMPRDrawType',DT:1}).setEnableToggle(true)
export const mprZoom = new ViewerFuncItem("mprZoom", "缩放").setGroup('mprMouseLeftBtn').setIconClass('icon-zoom').setParams({Tag:'changeMPRMouseType',MT:1}).setEnableToggle(true)

export const mprOrigin = new ViewerFuncItem("mprOrigin", "原点").setGroup('mprMouseLeftBtn').setIconClass('icon-reset').setParams({Tag:'gotoCenter',DT:1})
export const mprSwap = new ViewerFuncItem("mprSwap", "切换").setGroup('mprMouseLeftBtn').setIconClass('icon-rotate').setParams({Tag:'swap',DT:1})
export const mprRuler = new ViewerFuncItem("mprRuler", "测量").setGroup('mprMouseLeftBtn').setIconClass('icon-measure').setParams({Tag:'swap',DT:1})

//厚度一般是1、2、3、4、5、10、15、20mm
export const mprThickness1 = new ViewerFuncItem("mprThickness1", "1mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:1}).setIconClass('') 
export const mprThickness2 = new ViewerFuncItem("mprThickness2", "2mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:2}).setIconClass('') 
export const mprThickness3 = new ViewerFuncItem("mprThickness3", "3mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:3}).setIconClass('') 
export const mprThickness4 = new ViewerFuncItem("mprThickness4", "4mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:4}).setIconClass('') 
export const mprThickness5 = new ViewerFuncItem("mprThickness5", "5mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:5}).setIconClass('') 
export const mprThickness10 = new ViewerFuncItem("mprThickness10", "10mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:10}).setIconClass('') 
export const mprThickness15 = new ViewerFuncItem("mprThickness15", "15mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:15}).setIconClass('') 
export const mprThickness20 = new ViewerFuncItem("mprThickness20", "20mm").setGroup('mprEnableOnce').setParams({Tag:'changeThicknessMM',MM:20}).setIconClass('') 

export const mprAIP = new ViewerFuncItem("mprAIP", "AIP").setGroup('mprEnableOnce').setIconClass('icon-aip').setParams({Tag:'changeMPRMode',RM:4})
export const mprMIP = new ViewerFuncItem("mprMIP", "MIP").setGroup('mprEnableOnce').setIconClass('icon-mip').setParams({Tag:'changeMPRMode',RM:1})
export const mprMinIP = new ViewerFuncItem("mprMinIP", "MinIP").setGroup('mprEnableOnce').setIconClass('icon-mip').setParams({Tag:'changeMPRMode',RM:5})
export const mprVR = new ViewerFuncItem("mprVR", "VR").setGroup('mprEnableOnce').setIconClass('icon-vr').setParams({Tag:'changeMPRMode',RM:2})

//3D方向
export const mprCameraAngleC = new ViewerFuncItem("mprCameraAngleC", "C位显示").setGroup('mprCameraAngle').setParams({Tag:'changeCameraAngle',CA:1}).setIconClass('') 
export const mprCameraAngleS = new ViewerFuncItem("mprCameraAngleS", "S位显示").setGroup('mprCameraAngle').setParams({Tag:'changeCameraAngle',CA:2}).setIconClass('') 
export const mprCameraAngleA = new ViewerFuncItem("mprCameraAngleA", "A位显示").setGroup('mprCameraAngle').setParams({Tag:'changeCameraAngle',CA:3}).setIconClass('') 
//3D渲染
//Default=0,
//Bone=1,
//Skull=2,
//Vessel1=3,
//Cardiac1=4,
//Cardiac2=5,
//Skin=6,
//Lung_Trans=7,
//Lung_Solid1=8,
//Lung_Color=9,
//MRI_Vessel=10,
//MRI_Brain=11,
//VE_Colon1=12,
//None=13
export const mpr3DRenderDefault = new ViewerFuncItem("mpr3DRenderDefault", "默认").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:0}).setIconClass('') 
export const mpr3DRenderBone = new ViewerFuncItem("mpr3DRenderBone", "骨骼").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:1}).setIconClass('') 
export const mpr3DRenderSkull = new ViewerFuncItem("mpr3DRenderSkull", "头颅").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:2}).setIconClass('') 
export const mpr3DRenderVessel1 = new ViewerFuncItem("mpr3DRenderVessel1", "血管").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:3}).setIconClass('') 
export const mpr3DRenderCardiac1 = new ViewerFuncItem("mpr3DRenderCardiac1", "心脏A").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:4}).setIconClass('') 
export const mpr3DRenderCardiac2 = new ViewerFuncItem("mpr3DRenderCardiac2", "心脏B").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:5}).setIconClass('') 
export const mpr3DRenderSkin = new ViewerFuncItem("mpr3DRenderSkin", "皮肤").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:6}).setIconClass('') 
export const mpr3DRenderLungTrans = new ViewerFuncItem("mpr3DRenderLungTrans", "肺反").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:7}).setIconClass('') 
export const mpr3DRenderLungSolid1 = new ViewerFuncItem("mpr3DRenderLungSolid1", "肺实").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:8}).setIconClass('') 
export const mpr3DRenderLungColor = new ViewerFuncItem("mpr3DRenderLungColor", "肺色").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:9}).setIconClass('') 
export const mpr3DRenderMRIVessel = new ViewerFuncItem("mpr3DRenderMRIVessel", "MRI血管").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:10}).setIconClass('') 
export const mpr3DRenderMRIBrain = new ViewerFuncItem("mpr3DRenderMRIBrain", "MRI大脑").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:11}).setIconClass('') 
export const mpr3DRenderVEColon1 = new ViewerFuncItem("mpr3DRenderVEColon1", "VE结肠").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:12}).setIconClass('') 
export const mpr3DRenderNone = new ViewerFuncItem("mpr3DRenderNone", "无").setGroup('mpr3DRender').setParams({Tag:'changeRenderMode',RM:13}).setIconClass('') 
/**
 * 监听当前选择的funcItem
 */
export var funcState = new Vue({
  data: {
    activeItem: {
      code: null,
      group: null,
      clickTime: null,
    }
  },
  methods: {
    getActiveItem(){
      return this.activeItem
    },
    setActiveItem(item){
      if(item){
        this.activeItem.code = item.code
        this.activeItem.group = item.group
        this.activeItem.clickTime = new Date().getTime()
      }
      
    }
  }
});

