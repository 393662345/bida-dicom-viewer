import ViewerConfig from './viewerConfig.js'
//键盘按键
const KEY_CODE = {
  SHIFT: 16,
  CTRL: 17,
  SPACE: 32,
}

export default function ViewerManager(viewerName, vm){
  let self = this
  this._viewerName = viewerName || 'ViewerManager'
  this._vm = vm
  this.studyStacks = []
  //2d: 3d :mpr
  this.viewMode = '2d'
  //日志输出前缀
  this.loggerPrefix = "### ViewerManager["+this._viewerName+"] ~ "
  // 页面显示图像区域 dom元素id
  this.containerDomId = this._viewerName + '_zyvContainer', 
  // 页面显示图像区域
  this.container = {
    boxes: [],
    layout: {
      rows: 1, 
      cols: 1
    }
  }
  //mpr参数
  this.mprOptions = {
    iframeDom: null,
    iframeBaseSrc: ViewerConfig.mprSeverBaseUrl,
    iframeSrc: '',
    iframeRef: null,
    display3d: false, //是否打开3d
    studyZid: null,
    seriesNumber: null,
  }
 
  /**
   * 按键事件监听
   */
  this.pressingKeyCode = null
  this.onKeydownListener = function(event){
    const keyCode = event.keyCode
    if(keyCode == KEY_CODE.SHIFT || keyCode == KEY_CODE.CTRL){
      self.pressingKeyCode = keyCode
    }
  }
  this.onKeyupListener = function(event) {
    self.pressingKeyCode = null
  }
  document.addEventListener('keydown', this.onKeydownListener)
  document.addEventListener('keyup', this.onKeyupListener)
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
ViewerManager.prototype.setStudyStacks = function(studyStacks) {
  this.studyStacks = studyStacks || []
}

ViewerManager.prototype.getStacksTotalCount = function() {
  let count = 0
  if(this.studyStacks){
    this.studyStacks.forEach(function (study) {
      count += study.stacks ? study.stacks.length : 0
    })
  }
  return count
}

/**
 * 获取目标页中存在图像的元素
 */
ViewerManager.prototype.getElementsHaveImage = function(){
  let imageElements = []
  if(this.container && this.container.boxes){
    this.container.boxes.forEach(function(box){
      if(box && box.elements && box.elements.length > 0){
        box.elements.forEach(function(element){
          if(element && element.image) imageElements.push(element)
        })
      }
    })
  }
  return imageElements
}

ViewerManager.prototype.getSelectedElements = function(){
  let selectedElements = []
  if(this.container && this.container.boxes){
    this.container.boxes.forEach(function(box){
      if(box && box.elements && box.elements.length > 0){
        box.elements.forEach(function(element){
          if(element && element.active) selectedElements.push(element)
        })
      }
    })
  }
  return selectedElements
}

ViewerManager.prototype.getSelectedImageElements = function(){
  let selectedElements = []
  if(this.container && this.container.boxes){
    this.container.boxes.forEach(function(box){
      if(box && box.elements && box.elements.length > 0){
        box.elements.forEach(function(element){
          if(element && element.active && element.image) selectedElements.push(element)
        })
      }
    })
  }
  return selectedElements
}

/**
 * 当前选中的第一个box
 */
ViewerManager.prototype.getCurrentActivedBox = function(){
  if(this.container && this.container.boxes){
    for(let i = 0, len = this.container.boxes.length; i < len; i++){
      if(this.container.boxes[i].active) return this.container.boxes[i]
    }
  }
  return null
}

ViewerManager.prototype.getContainerLayout = function(){
  return this.container ? this.container.layout : null
}

ViewerManager.prototype.resizeContainer = function(){
  let layout = this.container.layout || {rows: 1, cols: 1}
  this.refreshContainerLayout(layout)
}

/**
 * 刷新页面布局
 * pageIndex 从 1 开始
 */
ViewerManager.prototype.refreshContainerLayout = function(layout){
  if(this.container && layout){
    this.container.layout = layout
    this.container.boxes = this.container.boxes || new Array()
    //容器大小
    const validWidth = $("#"+this.containerDomId).width()
    const validHeight = $("#"+this.containerDomId).height()
    // console.log(this.loggerPrefix, 'refreshContainerLayout', validWidth+"/"+validHeight)
    let layoutItems = this.calculateLayoutItemsSize(layout, validWidth, validHeight)
    let boxShowNum = layoutItems ? layoutItems.length : 0
    for(let i = 0; i < boxShowNum; i++){
      let boxStyle = layoutItems[i]
      if(i < this.container.boxes.length){
        this.container.boxes[i].style = boxStyle
        // this._vm.$set(this.container.boxes[i], 'style', boxStyle)
      } else {
        //加入新的box
        let newBox = {
          active: false,
          visible: true,
          layout: {rows: 1, cols: 1},
          stack: null,
          elements: [],
          style: boxStyle
        }
        this.container.boxes.push(newBox)
      }
    }
    let self = this
    this.container.boxes.forEach(function(box, index){
      box.boxIndex = index + 1 //从1开始
      box.visible = index < boxShowNum
      box.layout = box.layout || {rows: 1, cols: 1}
      if(box.visible){
        self.refreshBoxLayout(box, box.layout, box.boxIndex)
      }
    }, this)
    //自动填入
    this.autoLoadStackIntoBox()
  }
}

/**
 * 刷新页面布局
 * boxIndex 从 1 开始
 */
ViewerManager.prototype.refreshBoxLayout = function(box, layout, boxIndex){
  if(box && layout){
    box.layout = layout
    box.elements = box.elements || new Array()
    //box大小
    const boxInnerWidth = box.style && box.style.width ? box.style.width.replace('px', '') - 2 : 0
    const boxInnerHeight = box.style && box.style.height ? box.style.height.replace('px', '') - 2 : 0
    // console.log(this.loggerPrefix, 'refreshBoxLayout', boxIndex, boxInnerWidth+"/"+boxInnerHeight)
    let layoutItems = this.calculateLayoutItemsSize(box.layout, boxInnerWidth, boxInnerHeight)
    box.boxSize = layoutItems ? layoutItems.length : 0
    for(let i = 0; i < box.boxSize; i++){
      let elementStyle = layoutItems[i]
      if(i < box.elements.length){
        box.elements[i].style = elementStyle
      } else {
        //加入新的
        let newElement = {
          active: false,
          visible: true,
          unique: false, //唯一展现的元素、双击全屏
          isPlaying: false,
          syncs: new Array(), //同步器
          image: null,
          bodyPartExamined: null,
          imageDataSet: null,
          style: elementStyle
        }
        box.elements.push(newElement)
      }
    }
    box.elements.forEach(function(element, index){
      element.boxIndex = boxIndex
      element.elementIndex = index + 1 //从1开始
      element.visible = index < box.boxSize
    })
    //当前框存在序列数据
    if(box.stack && box.visible){
      let images = box.stack.images || []
      for(let i = 0, len = box.elements.length; i < len; i++){
        if(box.elements[i].visible && !box.elements[i].image){
          //不存在数据则放入影像
          box.elements[i].image = i < images.length ? images[i] : null
        }
      }
    }
    //如果选中的元素已经被布局所隐藏，则选中第一个元素
    if(box.active && box.boxSize > 0){
      let activeIndex = -1
      for(let i = 0, len = box.elements.length; i < len; i++){
        if(box.elements[i].visible && box.elements[i].active){
          activeIndex = i
          break
        }
      }
      if(activeIndex < 0 || activeIndex >= box.boxSize){
        box.elements.forEach(function(element, index){
          element.active = index < 1
        })
      }
    }
    //管理序列之前的同步器
    this.toggleStackBoxSyncs(box)
  }
}
/**
 * 刷新box的选中状态
 */
ViewerManager.prototype.refreshBoxesActiveStatus = function() {
  let self = this
  this.container.boxes.forEach(function(box){
    if(box && box.elements){
      let activedNum = 0
      box.elements.forEach(function(item) {
        activedNum = activedNum + (item.active ? 1 : 0 )
      })
      box.active = activedNum > 0
      //
      self.toggleStackBoxSyncs(box)
    }
  })
}

ViewerManager.prototype.toggleStackBoxSyncs = function(box){
  //序列同步
  //如果存在多个序列同时选中，则也会加入到同一个同步器中（窗宽窗位，平移缩放等都会变成一样）
  if(box && box.elements){
    let syncName = 'synStackBox'
    box.elements.forEach(function(element) {
      let index = element.syncs.indexOf(syncName)
      if(box.active && element.image){
        if(index < 0){
          element.syncs.push(syncName)
        }
      } else {
        if(index >= 0){
          element.syncs.splice(index, 1)
        }
      }
    })
  }
}

/**
 * 自动填入序列数据到box
 */
ViewerManager.prototype.autoLoadStackIntoBox = function () {
  let self = this
  let nextStudyIndex = 0
  let nextStackIndex = 0
  if(this.studyStacks && this.container && this.container.boxes){
    this.container.boxes.forEach(function(box, index){
      let targetStudy = nextStudyIndex < self.studyStacks.length ? self.studyStacks[nextStudyIndex] : null
      let stacksLength = targetStudy && targetStudy.stacks ? targetStudy.stacks.length : 0
      let targetStack = targetStudy && nextStackIndex < stacksLength ? targetStudy.stacks[nextStackIndex] : null
      if(box.visible && !box.stack && targetStack){
        //可见没有序列
        self.putStackIntoBox(targetStack, box)
      }
      if(targetStudy && nextStackIndex + 1 < stacksLength){
        nextStackIndex++
      } else {
        nextStackIndex = 0
        nextStudyIndex++
      }
    }, this)
  }
}

/**
 * 将序列放入到某个box中
 * boxIndex 从1开始
 */
ViewerManager.prototype.putStackIntoBox = function (stack, box) {
  let targetBox = null
  let boxIndex = isNaN(Number(box)) ? null : Number(box)
  if(this.container && this.container.boxes && boxIndex && boxIndex <= this.container.boxes.length){
    targetBox = this.container.boxes[boxIndex-1]
  } else {
    targetBox = box
  }
  if(stack && targetBox && targetBox.visible){
    targetBox.stack = stack
    let images = stack.images || []
    //当前box是可见的，才可以放入新的图像
    targetBox.elements = targetBox.elements || new Array()
    for(let i = 0, len = targetBox.elements.length; i < len; i++){
      targetBox.elements[i].image = i < images.length ? images[i] : null
    }
  }
}

ViewerManager.prototype.putStackIntoActiveBox = function (stack) {
  let targetBox = this.getCurrentActivedBox()
  this.putStackIntoBox(stack, targetBox)
}

ViewerManager.prototype.findVisibleEmptyBoxes = function() {
  let boxes = []
  this.container.boxes.forEach(function(box){
    if(box && !box.stack && box.visible){
      boxes.push(box)
    }
  })
  return boxes
}

ViewerManager.prototype.findBoxesOfStack = function (stack) {
  let boxes = []
  if(stack && stack.studyZid && stack.seriesZid){
    this.container.boxes.forEach(function(box){
      if(box && box.stack && box.stack.studyZid == stack.studyZid && box.stack.seriesZid == stack.seriesZid){
        boxes.push(box)
      }
    })
  }
  return boxes
}

ViewerManager.prototype.setBoxActived = function (targetBox) {
  if(!isNaN(Number(targetBox))){
    let boxIndex = Number(targetBox)
    if(boxIndex < 1 || boxIndex > this.container.boxes.length){
      boxIndex = 1
    }
    targetBox = this.container.boxes[boxIndex - 1]
  }
  if(targetBox && targetBox.boxIndex){
    let activeBox = this.getCurrentActivedBox()
    if(activeBox && activeBox.boxIndex == targetBox.boxIndex){
      return
    }
    this.container.boxes.forEach(function(box){
      box.active = box && box.boxIndex == targetBox.boxIndex
      if(box.active){
        if(box.elements && box.elements.length > 0){
          box.elements[0].active = true
        }
      } else {
        if(box.elements){
          box.elements.forEach(function(element) {
            element.active = false
          })
        }
      }
      
    })
  }
}

ViewerManager.prototype.selectStackImages = function(stack){
  let self = this
  // const currPageIndex = this.currentPageIndex
  const printElements = this.printElements
  if(printElements && stack && stack.images && stack.images.length > 0){
    let stackImagesZids = []
    stack.images.forEach(function(image){
      stackImagesZids.push(image.imageZid)
    })
    printElements.forEach(function(element){
      let pageIndex = element ? element.pageIndex : null
      let imageZid = element && element.image ? element.image.imageZid : null
      element.active = imageZid && stackImagesZids.indexOf(imageZid) >= 0
    })
  }
}

ViewerManager.prototype.clearBoxElementsByStack = function (stack) {
  if(stack && stack.studyZid && stack.seriesZid){
    this.container.boxes.forEach(function(box){
      if(box && box.elements && box.stack 
          && box.stack.studyZid == stack.studyZid && box.stack.seriesZid == stack.seriesZid){
        box.elements.forEach(function(element) {
          element.image = null
        })
        box.stack = null
      }
    })
  }
}

ViewerManager.prototype.clearAllBoxElements = function () {
  this.container.boxes.forEach(function(box){
    if(box && box.elements){
      box.elements.forEach(function(element) {
        element.image = null
      })
      box.stack = null
    }
  })
}

ViewerManager.prototype.dblclickSingleElement = function(element){
  if(element && element.boxIndex && element.elementIndex && this.container && this.container.boxes){
    this.container.boxes.forEach(function(box){
      if(box && box.elements){
        box.elements.forEach(function(item) {
          //当前点击的元素
          item.active = item.boxIndex == element.boxIndex && item.elementIndex == element.elementIndex
          if(item.active){
            item.unique = !item.unique
          } else {
            item.unique = false
          }
        })
      }
    })
    this.refreshBoxesActiveStatus()
    //重新刷新定位线的同步器
    this.refreshReferenceLineSynchronizer(element)
  }
}

ViewerManager.prototype.cancelShowUniqueElement = function(){
  this.container.boxes.forEach(function(box){
    if(box && box.elements){
      box.elements.forEach(function(item) {
        item.unique = false
      })
    }
  })
}

/**
 * 点击单个元素
 */
ViewerManager.prototype.clickSingleElement = function(element){
  let self = this
  if(element && element.boxIndex && element.elementIndex && this.container && this.container.boxes){
    if(self.pressingKeyCode == KEY_CODE.SHIFT){
      //SHIFT 按键处理
    } else if(self.pressingKeyCode == KEY_CODE.CTRL){
      //CTRL 按键处理
      element.active = !element.active
    } else {
      //单点此元素
      this.container.boxes.forEach(function(box){
        if(box && box.elements){
          box.elements.forEach(function(item) {
            //当前点击的元素
            item.active = item.boxIndex == element.boxIndex && item.elementIndex == element.elementIndex
          })
        }
      })
    }
    this.refreshBoxesActiveStatus()
    //重新刷新定位线的同步器
    this.refreshReferenceLineSynchronizer(element)
  }
}

/**
 * //重新刷新定位线的同步器
 */
ViewerManager.prototype.refreshReferenceLineSynchronizer = function(activeElement){
  let self = this
  if(activeElement && this.container && this.container.boxes && activeElement.boxIndex){
    let syncName = 'refLine'
    let currBodyPart = activeElement.bodyPartExamined
    this.container.boxes.forEach(function(box){
      if(box && box.elements){
        box.elements.forEach(function(element) {
          //to be confirmed
          let tbc = activeElement.image && element.image
          //1、同一个序列box 内的，不需要同步
          //2、存在部位信息，但是和element不是同一个部位的，不需要同步
          //3、不存在图片的，不需要计算同步
          if(activeElement.boxIndex == element.boxIndex){
            tbc = false
          } else if(currBodyPart && element.bodyPartExamined && currBodyPart != element.bodyPartExamined){
            tbc = false
          }
          let index = element.syncs.indexOf(syncName)
          if(tbc){
            if(index < 0){
              element.syncs.push(syncName)
            }
          } else {
            if(index >= 0){
              element.syncs.splice(index, 1)
            }
          }
        })
      }
    })
  }
}

/**
 * 计算每个元素的px大小
 * clientWidth, clientHeight 不包含border
 */
ViewerManager.prototype.calculateLayoutItemsSize = function(layout, clientWidth, clientHeight){
  let layoutItems = []
  let enableWidth = clientWidth < 0 ? 0 : Math.floor(clientWidth)
  let enableHeight = clientHeight < 0 ? 0 : Math.floor(clientHeight)
  if(layout.rows && layout.cols){
    //计算列宽
    let avgWidth = Math.floor(enableWidth / layout.cols)
    let restWidth = Math.floor(enableWidth - avgWidth * layout.cols)
    //计算行高
    let avgHeight = Math.floor(enableHeight / layout.rows)
    let restHeight = Math.floor(enableHeight - avgHeight * layout.rows)
    // console.log(this.loggerPrefix, 'calculateLayoutItemsSize', enableWidth+"/"+enableHeight, layout.rows+"/"+layout.cols, avgWidth+"/"+restWidth, avgHeight+"/"+restHeight)
    for(let r = 0; r < layout.rows; r++){
      for(let c = 0; c < layout.cols; c++){
        layoutItems.push({
          width: (c < restWidth ? avgWidth + 1 : avgWidth) + 'px',
          height: (r < restHeight ? avgHeight + 1 : avgHeight) + 'px',
        })
      }
    }
  } else if(layout.imagesBox){
    for(let i = 0; i < layout.imagesBox.length; i++){
      let box = layout.imagesBox[i]
      let widthNum = box.width.indexOf('%') >=0 ? box.width.replace("%","") : box.width
      let heightNum = box.height.indexOf('%') >=0 ? box.height.replace("%","") : box.height
      let topNum = box.top.indexOf('%') >=0 ? box.top.replace("%","") : box.top
      let leftNum = box.left.indexOf('%') >=0 ? box.left.replace("%",""): box.left
      layoutItems.push({
        width: Math.floor(enableWidth * widthNum / 100) + 'px',
        height: Math.floor(enableHeight * heightNum / 100) + 'px',
        position: box.position,
        top: Math.floor(enableHeight * topNum / 100) + 'px',
        left: Math.floor(enableWidth * leftNum / 100) + 'px',
      })
    }
  }
  return layoutItems
}


