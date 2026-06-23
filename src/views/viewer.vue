<template>
  <div :class="['zy-viewer zy-viewer-container', viewerStyle]" v-resize="onResizeViewer">
    <!-- 功能 操作面板 -->
    <!-- @click="currentMode = mode">{{mode.name}}</div> -->
    <div class="zy-viewer-func-panel" ref="zyvFuncPanel">
      <div class="func-panel-header">
        <div class="viewer-mode-toggler">
          <div class="viewer-mode-label curr-mode">{{ currentMode.name }}</div>
          <div class="viewer-mode-dropdown">
            <div class="viewer-mode-label" v-for="(mode, mi) in viewerModes" :key="'_zyv_vm_' + mi"
              v-show="mode.code != currentMode.code && mode.visible" @click="handleShowMPR(mode)">{{ mode.name }}</div>
          </div>
        </div>
        <div :class="['func-tabs', 'func-tab-title', { 'func-tab-active': currentTab === tab.code }]"
          v-for="tab in funcTabs" :key="'_ftab_' + tab.code" v-show="tab.mode && tab.mode.indexOf(currentMode.code) >= 0"
          @click="currentTab = tab.code">
          {{ tab.name }}
        </div>
        <div class="viewer-tabs-more" @click="toggleFullScreen">
          <div class="viewer-tabs-more-item">
            <div :class="['viewer-tabs-more-icon', isFullScreen ? 'icon-full-screen-exit' : 'icon-full-screen']"></div>
            <div class="viewer-tabs-more-txt">{{ isFullScreen ? '退出' : '全屏' }}</div>
          </div>
        </div>
      </div>
      <div class="func-panel-content" :is="currentTab" keep-alive :appManager="appManager"
        :viewerManager="viewerManager"></div>
    </div>
    <!-- 序列显示区域 -->
    <div v-show="viewerManager.viewMode === '2d'" class="zy-viewer-series-panel" ref="zyvSeriesPanel">
      <div :class="['zy-viewer-series-content', study.folded ? 'folded' : '']" v-for="(study, stuIndex) in studyStacks"
        :key="'_pri_stu_' + stuIndex">
        <div class="zy-viewer-study-info">
          <div class="viewer-fold-arrow" :title="study.folded ? '展开序列' : '折叠'" @click="study.folded = !study.folded"><i
              class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i></div>
          <div class="viewer-patient-name">{{ study.studyDetail && study.studyDetail.patientName ?
            study.studyDetail.patientName : '-姓名-'}}</div>
          <div class="viewer-study-bodypart">{{ study.studyDetail && study.studyDetail.studyBodyPart ?
            study.studyDetail.studyBodyPart : '-部位-'}}</div>
          <div class="viewer-study-datetime">{{ study.studyDetail && study.studyDetail.studyDate ?
            study.studyDetail.studyDate : '-时间-'}}</div>
          <div class="viewer-study-modality">{{ study.studyDetail && study.studyDetail.modality ?
            study.studyDetail.modality : '-设备-'}}：{{ study.stacks.length }}个序列</div>
        </div>
        <div class="zy-viewer-study-series">
          <li class="study-series-item" v-for="(stack, stackIndex) in study.stacks" :key="'_pri_stu_ser_' + stackIndex">
            <DicomThumbnail :options="stack" :appManager="appManager" hoverHint="单击选中序列图像"
              @on-click="handleStackClicked" @on-dblclick="handleStackDblClicked" />
          </li>
        </div>
      </div>
    </div>
    <!-- 图像显示区域 -->
    <div class="zy-viewer-main-panel" :style="{ bottom: viewerManager.viewMode != '2d' ? '0' : '80px' }" ref="zyvMainPanel">
      <div class="zy-viewer-main-container" @mousemove="getMousePosition" ref="zyvMainContainer"
        :id="viewerManager.containerDomId" v-resize="onResizeContainer">
        <div :class="['viewer-stack-box', box.active ? 'active' : '', box.visible ? '' : 'hidden']"
          v-for="(box, boxIndex) in viewerManager.container.boxes" :key="'_zyv_main_b' + boxIndex" :style="box.style">
          <DicomElement className="viewer-image-element" v-for="(element, eleIndex) in box.elements"
            :key="'_zyv_main_b' + boxIndex + '_e' + eleIndex" :options="element" :appManager="appManager"
            :style="element.style" @on-click="handleElementClicked" @on-dblclick="handleElementDblClicked"
            @on-screenshot="handleElementScreenshot">
          </DicomElement>
        </div>
        <!-- 箭头标注弹出框 -->
        <div id="annotation-dialog" class="annotation-dialog">
          <div class="annotation-panel">
            <input id="annotation-input" class="annotation-input" placeholder="text">
            <input id="annotation-position" type="hidden" name="annotation-position" :value="mousePosition">
            <button id="annotation-btn" class="annotation-btn">OK</button>
          </div>
        </div>
      </div>
      <!-- 2d 遮罩 -->
      <div :class="['zy-viewer-2d-mock', { 'zy-viewer-mocked': viewerManager.viewMode != '2d' }]"></div>
      <!-- 3d frame -->
      <div :class="['zy-viewer-3d-container', { 'show-3dimension': viewerManager.viewMode != '2d' }]">
        <!-- <div class="papaya" data-params="params"></div> -->
        <!-- <div class="zy-papaya-wrap" style="width: 100%; height: 700px">
          <div class="papaya zy-papaya" data-params="params"></div>
        </div> -->
        <!-- <iframe ref="iframe3D" id="iframe3D"  :src="viewerManager.mprOptions.iframeSrc"
          frameborder="0" scrolling="no" marginheight="0" marginwidth="0" onload=""></iframe> -->
      </div>
    </div>

    <!-- 报告ROI -->
    <el-dialog title="ROI" :visible.sync="showReportRoiModal" @close="closeReportRoiModal" width="400px">

      <div style="text-align:center">
        <div class="zy-image-editor" style="height: 200px; max-width: 100%;">
          <img :src="roiSrc" alt="" style="height: 200px; max-width: 100%;">
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReportRoiModal">取消</el-button>
        <el-button type="primary" @click="confirmReportRoiModal">确定</el-button>
      </span>
    </el-dialog>

    <!-- PAPAYA -->
    <div :style="{ marginTop: viewerManager.viewMode != '2d' && mprType === 2 ? '120px' : '9999px' }" class="papaya-wrap"
      @mousemove="handlePapayaMouse" @mouseenter="papayaDiagLoc.show = true" @mouseleave="papayaDiagLoc.show = false">
      <div class="zy-papaya papaya"></div>
    </div>
    <!-- PAPAYA DIALOG -->
    <div class="papaya-diag" :style="{
      left: papayaDiagLoc.x + 'px',
      top: papayaDiagLoc.y + 'px',
      display: papayaDiagLoc.show ? 'block' : 'none'
    }">
      x: {{ papayaDiag.x }} y: {{ papayaDiag.y }} z: {{ papayaDiag.z }} val: {{ papayaDiag.val }}
    </div>
    <!-- PAPAYA PROGRESS -->
    <div class="papaya-progress" v-show="viewerManager.viewMode != '2d' && papayaProgress > 0 && papayaProgress < 100">
      <el-progress  :percentage="papayaProgress"   stroke-color="#008283" :percent="papayaProgress" />
    </div>
    <!-- 桥接页 -->
    <iframe id="bridger" style="position: absolute; left: -9999px; top: -9999px;" src="http://localhost:8642/#/bridger"
      frameborder="0"></iframe>
  </div>
</template>

<script>
import resize from 'vue-resize-directive'
import Cropper from 'cropperjs';
import '@/components/image-preview/cropper.min.css'
import DicomStackBox from '../components/dicomStackBox'
import DicomElement from '../components/dicomElement'
import DicomThumbnail from '../components/dicomThumbnail'
import CommonTab from './func-tabs/commonTab'
import ImageTab from './func-tabs/imageTab'
import MeasureTab from './func-tabs/measureTab'
import ConfigTab from './func-tabs/configTab'
import PrintTab from './func-tabs/printTab'
import ThreeDTab from './func-tabs/threeDTab'
import Utils from '@/utils/utils.js'
import ViewerConfig from './viewerConfig.js'
import ViewerUtils from './viewerUtils.js'
import AppManager from './appManager.js'
import ViewerManager from './viewerManager.js'
import LocalStorageManager from './tools/localStorage.js'
import * as FuncItems from './func-tabs/funcItems.js'
import FullScreen from './tools/fullScreen.js'
import { testData } from './test-data.js'
import StudyApi from '@/api/study/studyApi.js'
import StudyRoiApi from '@/api/study/studyRoiApi.js'
import PictureApi from '@/api/picture/pictureApi'
export default {
  directives: {
    resize,
  },
  components: {
    DicomStackBox,
    DicomElement,
    DicomThumbnail,
    CommonTab,
    ImageTab,
    MeasureTab,
    ConfigTab,
    PrintTab,
    ThreeDTab
  },
  data() {
    let self = this
    return {
      findStudyInfoApi: {
        1: 'findStudyInfoByStudyZid',
        2: 'findStudySimpleInfoByHisUid'
      },
      studyZidType: 1, // 1 studyzid, 2 his_uid
      mprType: 2, // 1 socket + radiant 2 papaya
      papayaMpr: {
        pan: false,
        zoom: false,
        ruler: false
      }, // 操作值
      papayaDiagLoc: {
        x: -99,
        y: -99,
        show: false
      }, // hu位置
      papayaDiag: {
        x: 0,
        y: 0,
        z: 0,
        val: 0
      }, // hu值
      papayaProgress: 0, // papaya进度条
      ws: null,
      wsDir: null,
      wsPath: null,
      wsSupport: true,
      wsOpen: false,
      roiSrc: null,
      sender: null,
      refreshContainerLayout: true,
      viewerStyle: '',
      mousePosition: null,
      //检查信息
      targetStudyZids: [],
      targetStudies: {},
      //当前界面模式
      currentMode: { code: '2d', name: '2D' },
      viewerModes: [
        { code: '2d', name: '2D', enable: ViewerConfig.enable2D, visible: ViewerConfig.enable2D },
        { code: 'mpr', name: 'MPR', enable: ViewerConfig.enableMPR, visible: ViewerConfig.enableMPR },
        { code: '3d', name: '3D', enable: ViewerConfig.enable3D, visible: ViewerConfig.enable3D },
      ],
      //顶部操作标签栏
      currentTab: 'CommonTab',
      funcTabs: [
        { code: 'CommonTab', name: '常用操作', mode: '2d,mpr,3d' },
        { code: 'ImageTab', name: '图像操作', mode: '2d' },
        { code: 'MeasureTab', name: '标注测量', mode: '2d' },
        { code: 'ConfigTab', name: '配置及信息', mode: '2d' },
        { code: 'PrintTab', name: '打印', mode: '2d' },
        // {code: 'ThreeDTab', name: '3D', mode: ''}
      ],
      isFullScreen: false,
      //检查影像数据
      studyStacks: [],
      //cornerstone app manager
      appManager: new AppManager('viewerAppManager'),
      //控制器
      viewerManager: new ViewerManager('zyvViewer1', self),
      //
      localStorageManager: null,
      //检查报告roi
      showReportRoiModal: false,
      reportRoiCropper: null,
      reportRoiForm: {
        studyZid: null,
        data: null
      },
    }
  },
  computed: {
  },
  watch: {
    currentMode(mode) {
      this.viewerManager.viewMode = mode ? mode.code : '2d'
      if (mode && (mode.code == 'mpr' || mode.code == '3d')) {
        if (mode.code == 'mpr' && !ViewerConfig.enableMPR) {
          return
        }
        if (mode.code == '3d' && !ViewerConfig.enable3D) {
          return
        }
        this.currentTab = 'CommonTab'
        this.displayStudyByMpr()
      }
    },

    'targetStudyZids.length'() {
      this.loadStudyDetails()
    },
    'papayaMpr.zoom'(val, old) {
      if (val !== old) {
        window.papaya.Container.changeMPRMouseType(this.papayaMpr.zoom ? 1 : 0)
      }
    },
    'papayaMpr.pan'(val, old) {
      if (val !== old) {
        window.papaya.Container.changeMPRDrawType(this.papayaMpr.pan ? 1 : 0)
      }
    }
  },
  created() {
    window.addEventListener('message', this.handleReceiveMsg, false)
    this.handleSendMsgByInterval()
  },
  beforeDestroy() {
    clearInterval(this.sender)
    this.sender = null
  },
  methods: {
    handleSendMsgByInterval() {
      // 注册一次定时器
      if (this.sender) return
      this.sender = setInterval(() => {
        this.handleSendMsg(1)
      }, 2000);
      // 原来的created
      this.handleCreated()
      // // 原来的mounted
      this.handleMounted()
      // mock load web image data
      // this.loadStudyImagesByStudyDetailMock()
    },
    handleReceiveMsg(event) {
      let { data } = event
      if (!data) return
      if (data.type === 'reportToViewer' && data.data) {
        this.reloadStudy(data.data)
        // if (data.data.type === 'reload') {
        //   this.reloadStudy(data.data)
        // } else if (data.data.type === 'append') {
        //   this.appendStudy(data.data)
        // }
        // 回应消息
        this.handleSendMsg(0)
      }

    },
    handleSendMsg(code) {
      // code 0, 回应,对方注册监听定时器
      // code 1, 对方监听定时器开始监听
      if (document.querySelector('#bridger')) {
        document.querySelector('#bridger').contentWindow.postMessage({
          type: 'viewerToReport',
          date: new Date().getTime(),
          data: {
            code: code
          }
        }, '*')
        // console.log('did i send msg')
      }

    },
    handleCreated() {
      this.targetStudyZids = [] //多个检查的ID
      this.targetStudies = {} //多个检查的信息
      //注入处理方法
      this.registerFuncItemsHandler()

      //初始化模式
      this.currentMode = { code: '2d', name: '2D' }
      this.viewerManager.viewMode = '2d'

      ////LocalStorageManager
      let self = this
      // created 即 type === append
      const query = this.$route.query
      this.appendStudy(query)

      //默认鼠标左键 是 缩放模式
      this.$nextTick(() => {
        FuncItems.zoom.handleClick(this.viewerManager.viewMode)
        FuncItems.funcState.setActiveItem(FuncItems.zoom)
      })
      //建立MPR socket
      if (this.mprType === 1) {
        this.socketConnect()
      }
    },
    handleMounted() {
      this.onResizeViewer()
      // this.initRoiCropper()

      //检查影像
      // this.studyStacks = ViewerUtils.convertImageListToStacks(testData)
      this.studyStacks = []
      this.viewerManager.setStudyStacks(this.studyStacks)
      this.appManager.setStudyStacks(this.studyStacks)
      this.appManager.startLoadStackImages()

      //初始化布局
      this.refreshContainerLayout = true
      this.initMainContainerLayout()

      //初始化mpr参数
      this.viewerManager.mprOptions.iframeSrc = this.viewerManager.mprOptions.iframeBaseSrc + '?_=' + Math.random()
      this.viewerManager.mprOptions.iframeDom = this.$refs.iframe3D
      if (this.$refs.iframe3D) {
        this.viewerManager.mprOptions.iframeRef = this.$refs.iframe3D.contentWindow
      }

      //开始加载检查数据
      // let studyData = this.localStorageManager.getItemData()
      // if(this.$route.query && this.$route.query.studyZid){
      //   studyData = {
      //     studyZid: this.$route.query.studyZid
      //   }
      //   this.localStorageManager.setItemData(JSON.stringify(studyData))
      // }
      // if(studyData && studyData.studyZid){
      //   this.reloadStudy(studyData)
      // } else {
      //   this.localStorageManager.setItemData(JSON.stringify({studyZid: "none"}))
      // }
    },
    toggleFullScreen() {
      if (this.isFullScreen) {
        FullScreen.exitFullScreen();
      } else {
        FullScreen.fullScreen();
      }
    },
    /**
     * 尺寸变化
     */
    onResizeViewer() {
      this.isFullScreen = FullScreen.isDomFullScreen()
      let el = this.$el
      let width = $(el).width()
      let height = $(el).height()
      if (width > height) {
        this.viewerStyle = 'zy-viewer-container--horizontal'
      } else {
        this.viewerStyle = 'zy-viewer-container--vertical'
      }
    },

    onResizeContainer() {
      this.viewerManager.resizeContainer()
    },

    //初始化布局
    initMainContainerLayout() {
      if (!this.refreshContainerLayout) {
        //是否重新设置布局
        return
      }
      let stacksTotal = this.viewerManager.getStacksTotalCount()
      stacksTotal = stacksTotal < 1 ? 1 : stacksTotal
      if (stacksTotal >= 4) {
        this.viewerManager.refreshContainerLayout({ rows: 2, cols: 2 })
      } else {
        this.viewerManager.refreshContainerLayout({ rows: 1, cols: stacksTotal })
      }
      this.viewerManager.setBoxActived(1)
    },

    //刷新左侧序列的选中状态
    resetStackActivedStatus(stack) {
      let self = this
      let activeStudy = null //当前选中的检查
      if (this.studyStacks && stack) {
        this.studyStacks.forEach(function (study) {
          if (study && study.stacks) {
            study.stacks.forEach(function (item) {
              self.$set(item, 'active', item.studyZid == stack.studyZid && item.seriesZid == stack.seriesZid)
              if (item.active && activeStudy == null) {
                activeStudy = study
              }
            })
          }
        })
      }
      this.resetViewerModesVisible(activeStudy ? activeStudy.studyDetail : null)
    },

    resetViewerModesVisible(studyDetail) {
      // console.log('resetViewerModesVisible', studyDetail)
      let ctFlag = studyDetail && studyDetail.modality == 'CT'
      this.viewerModes.forEach(function (mode) {
        mode.visible = (mode.code == '2d' || ctFlag) && mode.enable
      })
      if (!ctFlag) {
        this.currentMode = { code: '2d', name: '2D' }
      }
    },

    //页面元素，单击事件处理,
    handleElementClicked(element) {
      this.viewerManager.clickSingleElement(element)
      //刷新左侧序列的选中状态
      let box = this.viewerManager.getCurrentActivedBox()
      this.resetStackActivedStatus(box ? box.stack : null)
    },

    //页面元素，双击事件处理，选中当前页所有元素
    handleElementDblClicked(element) {
      this.viewerManager.dblclickSingleElement(element)
      //刷新左侧序列的选中状态
      let box = this.viewerManager.getCurrentActivedBox()
      this.resetStackActivedStatus(box ? box.stack : null)
    },

    /**
     * 单击序列选中当前页中，此序列的图像
     */
    handleStackClicked(stack) {
      let self = this
      this.resetStackActivedStatus(stack)
      let viewMode = this.viewerManager.viewMode
      if (viewMode != '2d') {
        this.toggleMprDisplayStack(stack)
        return
      }
      this.viewerManager.cancelShowUniqueElement() //退出显示唯一的元素
      //找到当前
      let thisBoxes = this.viewerManager.findBoxesOfStack(stack)
      if (thisBoxes && thisBoxes.length > 0 && thisBoxes[0].visible) {
        this.viewerManager.setBoxActived(thisBoxes[0])
        return
      }
      //找到没有影像的box
      let emptyBoxes = this.viewerManager.findVisibleEmptyBoxes()
      if (emptyBoxes && emptyBoxes.length > 0 && emptyBoxes[0].visible) {
        this.viewerManager.putStackIntoBox(stack, emptyBoxes[0])
        this.viewerManager.setBoxActived(emptyBoxes[0])
        return
      }
      //当前box
      let activeBox = this.viewerManager.getCurrentActivedBox()
      if (activeBox) {
        this.viewerManager.putStackIntoBox(stack, activeBox)
      }
    },

    /**
     * 双击序列，追加序列中的图像
     */
    handleStackDblClicked(stack) {
      let self = this
      this.resetStackActivedStatus(stack)
      let viewMode = this.viewerManager.viewMode
      if (viewMode != '2d') {
        this.toggleMprDisplayStack(stack)
        return
      }
      this.viewerManager.cancelShowUniqueElement() //退出显示唯一的元素
      this.viewerManager.putStackIntoActiveBox(stack)
    },

    /**
     * triggerElementTransform
     */
    triggerActiveElementTransform(transform) {
      let self = this
      const activedBox = this.viewerManager.getCurrentActivedBox()
      if (transform && activedBox && activedBox.elements) {
        activedBox.elements.forEach(function (element) {
          self.$set(element, 'isPlaying', false) //全部暂停
          self.$set(element, 'triggerTransform', transform)
        })
      }
    },

    //x
    registerFuncItemsHandler() {
      let self = this
      //为每个func item 注入事件处理
      FuncItems.wwwc.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.pan.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.zoom.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.stackScroll.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.huValue.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.huAreaValue.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      //图像操作
      FuncItems.invert.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.vflip.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.hflip.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.rotate.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.reset.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.clockwise.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.anticlockwise.addClickHandler('2d', this.triggerManagerTransform)
      //测量工具
      FuncItems.arrowAnnotate.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.length.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.simpleAngle.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.rectangleRoi.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.ellipticalRoi.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.freehand.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.probe.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.clearTools.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.eraser.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      FuncItems.magnify.addClickHandler('2d', this.toggleManagerMouseLeftBtnTool)
      //播放
      FuncItems.scrollPrev.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.scrollNext.addClickHandler('2d', this.triggerManagerTransform)
      // FuncItems.play.addClickHandler('2d', this.triggerManagerPlayElement)
      //原图
      FuncItems.original.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.fitToWindow.addClickHandler('2d', this.triggerManagerTransform)
      //文件保存
      FuncItems.exportDcm.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.saveAsPng.addClickHandler('2d', this.triggerManagerTransform)
      FuncItems.reportRoi.addClickHandler('2d', this.displayReportRoiModal)

      //预设-窗宽窗位
      FuncItems.brain.addClickHandler('2d', this.triggerManagerPresetWwwc)
      FuncItems.lung.addClickHandler('2d', this.triggerManagerPresetWwwc)
      FuncItems.belly.addClickHandler('2d', this.triggerManagerPresetWwwc)
      FuncItems.skeleton.addClickHandler('2d', this.triggerManagerPresetWwwc)
      //预设-mpr窗宽窗位
      // papaya 颅脑
      FuncItems.brain.addClickHandler('mpr', this.triggerMprPresetMprWwwcPapaya)
      // papaya 肺窗
      FuncItems.lung.addClickHandler('mpr', this.triggerMprPresetMprWwwcPapaya)
      // papaya 腹部
      FuncItems.belly.addClickHandler('mpr', this.triggerMprPresetMprWwwcPapaya)
      // papaya 骨骼
      FuncItems.skeleton.addClickHandler('mpr', this.triggerMprPresetMprWwwcPapaya)
      FuncItems.brain.addClickHandler('3d', this.triggerMprPresetMprWwwcPapaya)
      FuncItems.lung.addClickHandler('3d', this.triggerMprPresetMprWwwcPapaya)
      FuncItems.belly.addClickHandler('3d', this.triggerMprPresetMprWwwcPapaya)
      FuncItems.skeleton.addClickHandler('3d', this.triggerMprPresetMprWwwcPapaya)

      //3D//mpr
      FuncItems.mprWwwc.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      // papaya 移动
      FuncItems.mprPan.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      // papaya 缩放
      FuncItems.mprZoom.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      //回到原点，切换窗口
      // papaya 原点
      FuncItems.mprOrigin.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      // papaya 切换
      FuncItems.mprSwap.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      // papaya 测量
      FuncItems.mprRuler.addClickHandler('mpr', this.triggerMprMouseToolPapaya)
      //厚度
      FuncItems.mprThickness1.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness2.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness3.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness4.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness5.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness10.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness15.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprThickness20.addClickHandler('mpr', this.triggerMprPostMessage)
      //
      FuncItems.mprAIP.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprMIP.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprMinIP.addClickHandler('mpr', this.triggerMprPostMessage)
      FuncItems.mprVR.addClickHandler('mpr', this.triggerMprPostMessage)

      FuncItems.mprWwwc.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      FuncItems.mprPan.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      FuncItems.mprZoom.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      //回到原点，切换窗口
      FuncItems.mprOrigin.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      FuncItems.mprSwap.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      FuncItems.mprRuler.addClickHandler('3d', this.triggerMprMouseToolPapaya)
      //厚度
      FuncItems.mprThickness1.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness2.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness3.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness4.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness5.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness10.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness15.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprThickness20.addClickHandler('3d', this.triggerMprPostMessage)
      //
      FuncItems.mprAIP.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprMIP.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprMinIP.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprVR.addClickHandler('3d', this.triggerMprPostMessage)


      //3d方向
      FuncItems.mprCameraAngleC.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprCameraAngleS.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mprCameraAngleA.addClickHandler('3d', this.triggerMprPostMessage)

      //3d渲染
      FuncItems.mpr3DRenderDefault.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderBone.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderSkull.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderVessel1.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderCardiac1.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderCardiac2.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderSkin.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderLungTrans.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderLungSolid1.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderLungColor.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderMRIVessel.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderMRIBrain.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderVEColon1.addClickHandler('3d', this.triggerMprPostMessage)
      FuncItems.mpr3DRenderNone.addClickHandler('3d', this.triggerMprPostMessage)
    },

    //使用postMessage请求3d操作
    triggerMprPostMessage(funcItem) {
      let self = this
      let viewMode = this.viewerManager.viewMode
      let mprOptions = this.viewerManager.mprOptions
      if (viewMode != '2d' && mprOptions.iframeRef && mprOptions.iframeSrc) {
        let message = JSON.stringify(funcItem.params)
        console.log(' #### Mpr postMessage', mprOptions.iframeSrc, message)
        mprOptions.iframeRef.postMessage(message, mprOptions.iframeSrc)
      }
    },

    triggerMprMouseToolPapaya(funcItem) {
      if (funcItem.code === 'mprPan') { // 移动
        this.papayaMpr.pan = !this.papayaMpr.pan
        this.papayaMpr.zoom = false
      } else if (funcItem.code === 'mprZoom') { // 缩放
        this.papayaMpr.zoom = !this.papayaMpr.zoom
        this.papayaMpr.pan = false
      } else if (funcItem.code === 'mprRuler') { // 测量
        this.papayaMpr.pan = false
        this.papayaMpr.zoom = false
        this.papayaMpr.ruler = !this.papayaMpr.ruler
        window.papaya.Container.showRulers(this.papayaMpr.ruler)
      } else if (funcItem.code === 'mprSwap') { // 切换
        papaya.Container.swap()
      } else if (funcItem.code === 'mprOrigin') { // 原点
        papaya.Container.gotoCenter()
      }
    },
    triggerMprMouseToolPostMessage(funcItem) {
      let self = this
      let viewMode = this.viewerManager.viewMode
      let mprOptions = this.viewerManager.mprOptions
      if (viewMode != '2d' && mprOptions.iframeRef && mprOptions.iframeSrc) {
        this.$nextTick(() => {
          let params = JSON.parse(JSON.stringify(funcItem.params))
          if (params.Tag && params.Tag == 'changeMPRDrawType') {
            params.DT = funcItem.active ? 1 : 0
          } else if (params.Tag && params.Tag == 'changeMPRMouseType') {
            params.MT = funcItem.active ? 1 : 0
          }
          let message = JSON.stringify(params)
          console.log(' #### Mpr postMessage', mprOptions.iframeSrc, message)
          mprOptions.iframeRef.postMessage(message, mprOptions.iframeSrc)
        })
      }
    },
    triggerMprPresetMprWwwcPapaya(funcItem) {
      console.log('papaya wl', funcItem.params)
      if (this.viewerManager.viewMode !== '2d') {
        papaya.Container.changeWL(funcItem.params.windowWidth, funcItem.params.windowCenter)
      }
    },
    triggerMprPresetMprWwwc(funcItem) {
      let viewMode = this.viewerManager.viewMode
      let mprOptions = this.viewerManager.mprOptions
      if (viewMode != '2d' && mprOptions && mprOptions.iframeRef && mprOptions.iframeSrc && funcItem) {
        let ww = funcItem.params ? funcItem.params.windowWidth : 0
        let wc = funcItem.params ? funcItem.params.windowCenter : 0
        if (!isNaN(Number(ww)) && !isNaN(Number(wc))) {
          let message = { Tag: 'changeWL', W: Number(ww), L: Number(wc) }
          console.log(' #### Mpr postMessage', mprOptions.iframeSrc, JSON.stringify(message))
          mprOptions.iframeRef.postMessage(JSON.stringify(message), mprOptions.iframeSrc)
        }
      }
    },

    //切换到MPR x
    displayStudyByMpr() {
      let self = this
      let activeStack = this.findMprActiveStack()
      // this.toggleMprDisplayStack(activeStack)
      // this.socketConnect()
    },
    //切换到MPR ✓
    handleShowMPR(mode) {
      let activeStack = this.findMprActiveStack()
      if (this.mprType === 1) {
        this.socketSendMsg(activeStack, mode.name)
      } else if (this.mprType === 2) {
        this.currentMode = mode
        if (mode.code !== '2d') {
          this.sendPapaya()
        }
      }
    },

    toggleMprDisplayStack(activeStack) {
      return
      //检查当前选中的序列是否是CT
      if (!activeStack || !activeStack.studyZid) {
        return
      }
      let studyDetail = this.targetStudies[activeStack.studyZid]
      if (!studyDetail) {
        return
      }
      if (studyDetail.modality != 'CT') {
        this.currentMode = { code: '2d', name: '2D' } // 切回2d
        alert('此检查不是CT，不能查看MPR或3D.')
        return
      }
      let mprOptions = this.viewerManager.mprOptions
      if (activeStack && activeStack.studyZid && activeStack.seriesNumber && mprOptions && mprOptions.iframeRef) {
        //是否点开的是3d
        let viewMode = this.viewerManager.viewMode
        this.viewerManager.mprOptions.display3d = viewMode == '3d'

        //刷新options
        if (activeStack.studyZid != mprOptions.studyZid || activeStack.seriesNumber != mprOptions.seriesNumber) {
          let self = this

          mprOptions.iframeDom.onload = mprOptions.iframeDom.onreadystatechange = (e) => {
            // console.log(' ####iframe readyState:', mprOptions.iframeSrc, mprOptions.iframeDom.readyState)
            if (!mprOptions.iframeDom.readyState || mprOptions.iframeDom.readyState == "complete") {
              console.log(' ####iframe reload done. at:' + mprOptions.iframeSrc)
            } else {
              return
            }
            self.viewerManager.mprOptions.studyZid = activeStack.studyZid
            self.viewerManager.mprOptions.seriesNumber = activeStack.seriesNumber

            let message = { Tag: 'openViewer', StudyId: activeStack.studyZid, SID: activeStack.seriesNumber }
            if (self.viewerManager.mprOptions.display3d) {
              message = { Tag: 'openViewerAll', StudyId: activeStack.studyZid, SID: activeStack.seriesNumber }
            }
            console.log(' #### Mpr postMessage at:' + mprOptions.iframeSrc, JSON.stringify(message))
            mprOptions.iframeRef.postMessage(JSON.stringify(message), mprOptions.iframeSrc)
          }

          mprOptions.iframeSrc = mprOptions.iframeBaseSrc + '?_=' + Math.random()
          // mprOptions.iframeRef.location.reload(true); //强制刷新

        } else {
          //相同序列
          let message3d = { Tag: 'closeSurfaceViewer' }
          if (this.viewerManager.mprOptions.display3d) {
            message3d = { Tag: 'openSurfaceViewer' }
          }
          console.log(' #### Mpr postMessage', mprOptions.iframeSrc, JSON.stringify(message3d))
          mprOptions.iframeRef.postMessage(JSON.stringify(message3d), mprOptions.iframeSrc)
        }
      }
    },

    findMprActiveStack() {
      let self = this
      let activeStack = null
      if (this.studyStacks) {
        for (let i = 0, len = this.studyStacks.length; activeStack == null && i < len; i++) {
          let study = this.studyStacks[i]
          if (study && study.stacks) {
            for (let j = 0, len2 = study.stacks.length; activeStack == null && j < len2; j++) {
              if (study.stacks[j].active) {
                activeStack = study.stacks[j]
                break
              }
            }
          }
        }

        if (activeStack == null) {
          if (this.studyStacks.length > 0) {
            let study = this.studyStacks[0]
            if (study && study.stacks && study.stacks.length > 0) {
              this.$set(study.stacks[0], 'active', true)
              activeStack = study.stacks[0]
            }
          }
        }
      }
      return activeStack
    },

    //切换鼠标左键的tool
    toggleManagerMouseLeftBtnTool(funcItem) {
      let self = this
      if (funcItem && funcItem.code) {
        self.appManager.toggleToolOfMouseLeftBtn(funcItem.code)
      }
      // for(var i in FuncItems){
      //   // console.log('####FuncItems', i, FuncItems[i])
      //   let item = FuncItems[i]
      //   if(funcItem.group && item.group == funcItem.group){
      //     item.active = item.code == funcItem.code
      //   }
      // }
    },

    /**
     * 触发图像的变换操作，一次有效
     */
    triggerManagerTransform(funcItem) {
      let self = this
      if (funcItem && funcItem.code) {
        console.log('triggerManagerTransform', funcItem)
        self.triggerActiveElementTransform(funcItem.code)
      }
    },

    /**
     * 预设窗宽窗位
     */
    triggerManagerPresetWwwc(funcItem) {
      let self = this
      if (funcItem && funcItem.code && funcItem.params) {
        const selectedElements = this.viewerManager.getSelectedElements()
        if (selectedElements && selectedElements.length > 0) {
          selectedElements.forEach(function (element) {
            self.$set(element, 'presetWwwc', funcItem.params)
          })
        }
      }
    },

    //获取鼠标位置
    getMousePosition(event) {
      this.mousePosition = event.clientX + ',' + event.clientY
    },

    /**
     * 加载检查数据
     */
    reloadStudy(study) {
      study.studyZid = study.studyZid || study.his_uid
      if (study && study.studyZid) {
        this.targetStudyZids = []
        this.targetStudies = {}
        this.viewerManager.clearAllBoxElements()
        this.studyStacks = []
        this.viewerManager.setStudyStacks(this.studyStacks)
        this.appManager.setStudyStacks(this.studyStacks)
        let self = this
        this.$nextTick(() => {
          self.currentMode = { code: '2d', name: '2D' } //回到2d模式
          self.refreshContainerLayout = true
          self.targetStudyZids.push(study.studyZid)
        })
      }
    },

    appendStudy(study) {
      // query.studyzid
      if (study && study.studyZid) {
        let index = this.targetStudyZids.indexOf(study.studyZid)
        if (index < 0) {
          this.refreshContainerLayout = true
          this.targetStudyZids.push(study.studyZid)
        }
        // quey.his_uid
      } else if (study && study.his_uid) {
        this.studyZidType = 2
        let his_uid = study.his_uid
        if (his_uid.includes('[') && his_uid.includes(']')) {
          his_uid = his_uid.replace('[', '')
          his_uid = his_uid.replace(']', '')
        }
        let index = this.targetStudyZids.indexOf(his_uid)
        if (index < 0) {
          this.refreshContainerLayout = true
          this.targetStudyZids.push(his_uid)
        }
      } else {
        this.$Message.error('没有检查信息')
      }
    },

    loadStudyDetails() {
      console.log(' viewer loadStudyDetails studyZids', this.targetStudyZids)
      if (this.targetStudyZids && this.targetStudyZids.length > 0) {
        // console.log(' viewer loadStudyDetails studyZids', this.targetStudyZids)
        for (var i in this.targetStudyZids) {
          if (this.targetStudyZids[i]) {
            this.loadStudyDetailByZid(this.targetStudyZids[i])
          }
        }
      }
    },

    loadStudyDetailByZid(studyZid) {
      if (studyZid == undefined || studyZid == null || studyZid.length < 1 || studyZid == 'none') {
        console.log(' viewer loadStudyDetailByZid studyZid is null')
        return
      }
      let self = this
      let studyInfo = this.targetStudies[studyZid]
      if (studyInfo && studyInfo == 'loading') {
        console.log(' viewer loadStudyDetailByZid studyZid id loading.', studyZid)
        return
      }
      if (studyInfo && studyInfo.studyZid) {
        console.log(' viewer loadStudyDetailByZid studyZid has loaded.', studyZid)
        return
      }
      self.targetStudies[studyZid] = 'loading'
      StudyApi[this.findStudyInfoApi[this.studyZidType]](studyZid).then(function (response) {
        if (response.data) {
          let studyDetail = response.data
          studyDetail.studyBodyPart = studyDetail.bodyPartAndTypeStr || studyDetail.studyType
          studyDetail.studyDate = studyDetail.studyDatetime ? studyDetail.studyDatetime.substring(0, 16) : null
          self.targetStudies[studyZid] = studyDetail
          console.log('findStudyInfoApi', studyDetail)
          self.loadStudyImagesByStudyDetail(studyDetail)
        } else {
          alert('抱歉，系统找不到检查信息');
          self.targetStudies[studyZid] = 'null'
        }
      });
    },

    loadStudyImagesByStudyDetail(studyDetail) {
      let self = this
      if (studyDetail && studyDetail.studyZid) {
        // console.log(' viewer loadStudyImagesByStudyDetail ', studyDetail.studyZid)
        PictureApi.queryStudyImagesByStudyZid(studyDetail.studyZid).then((response) => {
          if (response.result) {
            let imageList = response.result
            let thisStacks = ViewerUtils.convertImageListToStacks(imageList, studyDetail.modality)
            thisStacks.forEach(function (study) {
              //合并检查数据
              ViewerUtils.combineTargetStudyStack(self.studyStacks, study)
              //获取检查信息
              self.$set(study, 'studyDetail', studyDetail)
            })
            self.viewerManager.setStudyStacks(self.studyStacks)
            self.appManager.setStudyStacks(self.studyStacks)
            self.appManager.continueLoadImages()
            //重新刷新下布局，将影像加入到操作区域中
            if (self.refreshContainerLayout) {
              self.initMainContainerLayout()
            }
          }
        }).catch(err => { console.log(' viewer queryStudyImagesByStudyZid studyZid no images.', studyDetail.studyZid, err) });
      }
    },

    loadStudyImagesByStudyDetailMock() {
      let self = this
      let studyDetail = {
        studyZid: 'xxx',
        modality: 'CT',
        bodyPartAndTypeStr: 'CC'
      }
      let imageList = [
        {
          studyZid: "Td5gMo9K",
          seriesZid: "AorVR7e2",
          seriesSeq: null,
          seriesNumber: "1",
          thumbImgZid: "wISCWOcB",
          imageZid: "kcQERxvK",
          imageSeq: null,
          imageInstanceNumber: "1",
          hospitalZid: "cdzsgkyysc001",
          loadUrl: 'http://localhost:8642/static/Renal_Cell_Carcinoma.jpg'
        },
        {
          studyZid: "Td5gMo9K",
          seriesZid: "AorVR7e2",
          seriesSeq: null,
          seriesNumber: "1",
          thumbImgZid: "wISCWOcB",
          imageZid: "kcQERxvK",
          imageSeq: null,
          imageInstanceNumber: "1",
          hospitalZid: "cdzsgkyysc001",
          loadUrl: 'http://localhost:8642/static/Renal_Cell_Carcinoma.jpg'
        },
        {
          studyZid: "Td5gMo9K",
          seriesZid: "AorVR7e2",
          seriesSeq: null,
          seriesNumber: "1",
          thumbImgZid: "wISCWOcB",
          imageZid: "kcQERxvK",
          imageSeq: null,
          imageInstanceNumber: "1",
          hospitalZid: "cdzsgkyysc001",
          loadUrl: 'http://localhost:8642/static/Renal_Cell_Carcinoma.jpg'
        },
      ]
      let thisStacks = ViewerUtils.convertImageListToStacks(imageList)
      thisStacks.forEach(function (study) {
        //合并检查数据
        ViewerUtils.combineTargetStudyStack(self.studyStacks, study)
        //获取检查信息
        self.$set(study, 'studyDetail', studyDetail)
      })
      self.viewerManager.setStudyStacks(self.studyStacks)
      self.appManager.setStudyStacks(self.studyStacks)
      self.appManager.continueLoadImages()
      //重新刷新下布局，将影像加入到操作区域中
      if (self.refreshContainerLayout) {
        self.initMainContainerLayout()
      }
    },

    /**
     * ReportRoi
     */
    initRoiCropper() {
      let self = this
      let cropEle = document.getElementById('zyv_roiCropper');
      this.reportRoiCropper = new Cropper(cropEle, {
        dragMode: 'move',
        // preview: '#preview1',
        // preview: '.image-preview',
        restore: false,
        center: false,
        highlight: false,
        autoCrop: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        // ready() {
        //   self.reportRoiCropper.crop();
        //   //重置截图区域大小
        //   const fixedWidth = 200;
        //   const parent = cropEle.parentElement
        //   if(parent){
        //     const left = (parent.offsetWidth - 200) / 2
        //     const top = (parent.offsetHeight - 200) / 2
        //     const areaData = {
        //       left: left,
        //       top: top,
        //       width: fixedWidth,
        //       height: fixedWidth
        //     }
        //     if(left > 0 && top > 0){
        //       self.reportRoiCropper.setCropBoxData(areaData)
        //     }
        //   }
        // },
      });
    },

    displayReportRoiModal() {
      let elements = this.viewerManager.getSelectedImageElements()
      if (elements && elements.length > 0 && elements[0]) {
        this.$set(elements[0], 'triggerTransform', 'screenshot')
        return
      }
      this.$Message.warning('请选择一张影像图片');
      // this.showReportRoiModal = true
    },

    handleElementScreenshot(element, dataUrl) {
      if (element && element.image && element.image.hospitalZid && element.image.studyZid) {
        this.roiSrc = dataUrl
        this.reportRoiForm.hospitalZid = element.image.hospitalZid
        this.reportRoiForm.studyZid = element.image.studyZid
        this.reportRoiForm.data = dataUrl
        this.showReportRoiModal = true
      } else {
        this.$Message.error('ROI信息不足')
      }

      // if(element && element.image && element.image.hospitalZid && element.image.studyZid){
      //   if (!this.reportRoiCropper) {
      //     this.$Message.error('No Cropper was inited')
      //     return
      //   }
      //   this.reportRoiForm.hospitalZid = element.image.hospitalZid
      //   this.reportRoiForm.studyZid = element.image.studyZid
      //   this.reportRoiForm.data = dataUrl
      //   this.reportRoiCropper.replace(dataUrl);
      //   // console.log('reportRoiCropper', this.reportRoiCropper)
      //   this.showReportRoiModal = true
      // } else {
      //   console.error('handleElementScreenshot', element)
      // }
    },
    closeReportRoiModal() {
      this.reportRoiForm.hospitalZid = null
      this.reportRoiForm.studyZid = null
      this.reportRoiForm.data = null
      this.showReportRoiModal = false
    },
    confirmReportRoiModal() {
      let self = this
      if (this.reportRoiForm.studyZid && this.reportRoiForm.data) {
        let formData = new FormData()
        formData.append("studyZid", this.reportRoiForm.studyZid)
        let imgData = this.reportRoiForm.data
        // if(this.reportRoiCropper){
        //   imgData = this.reportRoiCropper.getCroppedCanvas().toDataURL();
        // }
        formData.append("image", Utils.convertBase64UrlToBlob(imgData))
        StudyRoiApi.saveRoiImage(formData).then(function (response1) {
          if (response1.data) {
            localStorage.setItem('STG_ZY_REFRESH_ROI', response1.data.zid || 'true');
            self.$Message.success('保存成功');
          }
          self.closeReportRoiModal()
        })
      } else {
        self.closeReportRoiModal()
      }

    },
    // socket + radant dicom
    socketConnectServer() {
      let self = this
      const support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null)
      if (support === null) {
        this.wsSupport = false
        this.$Message.error('浏览器不支持websocket')
        return
      }
      this.ws = new window[support]('ws://localhost:2012')
      this.ws.onmessage = function () {
      }
      this.ws.onopen = function () {
        console.log('### Zyine mpr socket open')
        self.wsOpen = true
      }
      this.ws.onclose = function () {
        console.log('### Zyine mpr socket close')
        self.wsOpen = false
      }
    },
    socketSendMsg(activeStack, name) {
      let studyDetail = this.targetStudies[activeStack.studyZid]
      if (!studyDetail) {
        return
      }
      if (studyDetail.modality != 'CT') {
        this.currentMode = { code: '2d', name: '2D' } // 切回2d
        this.$Message.error('此检查不是CT，不能查看MPR或3D.')
        return
      }
      if (this.wsSupport && this.wsOpen && this.ws !== null) {
        this.$Message.success('正在打开' + name + '..')
        if (this.wsDir && this.wsPath) {
          console.log('@@@ origin dir', this.wsDir)
          console.log('@@@ file path ', this.wsPath)
          console.log('@@@ dicom path', this.wsDir + this.wsPath)
          let tmpPath = this.wsDir + this.wsPath
          // let tmpPath = '\\\\192.168.13.100\\zy_file\\' + this.wsPath
          let dicomPath = tmpPath
          this.ws.send('DICOM_' + name + ' ' + dicomPath)
        } else {
          this.$Message.error('未找到文件目录')
        }
      } else {
        if (!this.wsSupport) {
          this.$Message.error('浏览器不支持WebSocket')
        } else if (!this.wsOpen) {
          this.$Message.error('WebSocket连接失败, 请开启服务.')
        } else {
          this.$Message.error('WebSocket创建失败')
        }
      }
    },
    socketConnect() {
      this.socketConnectServer()
      const query = this.$route.query
      query.studyZid = query.studyZid || query.his_uid
      if (query && query.studyZid) {
        PictureApi.find3dImagesByStudy(query.studyZid).then(response => {
          if (response && response.result && response.result.length > 0) {
            let filePath = response.result[0].filePath
            if (filePath) { // fiePath: D:\\home\\zy_file\\**\\**.dcm
              let file = filePath.split('zy_file\\')[1]
              let fileArr = file.split('\\')
              fileArr.pop()
              let path = fileArr.join('\\')
              this.wsPath = path
            }
          }
        })
      }

      PictureApi.findSystemConfigSysDir().then(response => {
        // console.log('cccc', response) // \\DESKTOP-9EQFAUS\zy_file\
        if (response.data && response.status == 200) {
          this.wsDir = response.data.value || ''
        }
      })
    },
    socketDisconnect() {
      if (this.ws) {
        this.ws.close()
      }
    },
    // Papaya
    // 打开阅片BY PAPAYA
    sendPapaya() {
      const papayaData = this.appManager.getPapayaData()
      // console.log('get papaya data', papayaData)
      const callback = (data) => {
        // console.log('papaya callback', data)
        if (data.type === '1') {
          // {type: "1", x: 381, y: 416, z: 2, val: -90}
          this.papayaDiag = { ...data }
          // console.log('this', this.papayaDiag)
        } else if (data.type === '0') {
          this.papayaProgress = Math.floor(data.progress * 100)
          // {type: "0", progress: 0.1}
          // console.log('mpr progress', data)
        }
      }
      papaya.Container.openViewer(papayaData, callback)
    },
    handlePapayaMouse(e) {
      // console.log('papaya mouse', e)
      this.papayaDiagLoc.x = e.clientX + 15
      this.papayaDiagLoc.y = e.clientY + 15
    }
  }
}

</script>
<style lang="less">
@import '../styles/viewer.less';
</style>
