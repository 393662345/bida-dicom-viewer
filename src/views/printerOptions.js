//键盘按键
const KEY_CODE = {
  SHIFT: 16,
  CTRL: 17,
  SPACE: 32,
}

//horizontal-横向;vertical-纵向;
const FILM_DIRECTION = {
  HORIZONTAL : 'horizontal',
  VERTICAL : 'vertical'
}

/**
 * 追加图片方式
 */
const APPEND_IMAGE_MODES = {
  //从当前选中的位置（或当前页的页首）追加图片
  CURR_ACTIVE: "CURR_ACTIVE",
  //从第一个空位开始追加图片
  FIRST_EMPTY: "FIRST_EMPTY",
  //直接追加
  APPEND_LAST: 'APPEND_LAST',
}

export default function PrinterOptions(printerName, vm){
  let self = this
  this._printerName = printerName || 'printerOptions'
  this._vm = vm
  //日志输出前缀
  this.loggerPrefix = "### PrinterOptions["+this._printerName+"] ~ "

  //数据内容
  this.filmDomId = this._printerName + '_film', //dom元素ID
  this.filmDirection = 'vertical', 
  //胶片尺寸大小
  this.filmSize = {
    sizeZid: null,
    width: '512', //显示区域宽度
    height: '800', //显示区域高度
  },
  //目标打印机
  this.printMachine = null
  //当前键盘keydown的keycode
  this.appendImageMode = APPEND_IMAGE_MODES.APPEND_LAST
  //当前的元素
  this.printElements = [] 
  //当前页码,从1开始
  this.currentPageIndex = 0
  // 所有页
  this.printPages = []
  // this.printPages = [
  //   { //每一页的对象
  //     layout: {}, //当前页面布局
  //     boxes: [
  //         {
  //           layout: {}, //当前box布局
  //           elements: [] //当前box元素
  //         }
  //       ], 
  //   }
  // ]

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
 * 获取当前页
 */
PrinterOptions.prototype.getCurrentPage = function(){
  const currPageIndex = this.currentPageIndex
  const printPages = this.printPages
  if(printPages && currPageIndex >= 1 && currPageIndex <= printPages.length){
    return printPages[currPageIndex-1]
  }
  return null
}

PrinterOptions.prototype.getPageByPageIndex = function(pageIndex){
  const printPages = this.printPages
  if(printPages && pageIndex >= 1 && pageIndex <= printPages.length){
    return printPages[pageIndex-1]
  }
  return null
}

/**
 * 获取目标页中存在图像的元素
 */
PrinterOptions.prototype.getElementsHaveImage = function(page){
  let imageElements = []
  if(page && page.boxes && page.boxes.length > 0){
    page.boxes.forEach(function(box){
      if(box && box.elements && box.elements.length > 0){
        box.elements.forEach(function(element){
          if(element && element.image) imageElements.push(element)
        })
      }
    })
  }
  return imageElements
}

PrinterOptions.prototype.getSelectedElements = function(page){
  let selectedElements = []
  if(page && page.boxes && page.boxes.length > 0){
    page.boxes.forEach(function(box){
      if(box && box.elements && box.elements.length > 0){
        box.elements.forEach(function(element){
          if(element && element.active) selectedElements.push(element)
        })
      }
    })
  }
  return selectedElements
}

/**
 * !!!!!!!!!!
 * 重构所有页面，box的元素
 * !!!!!!!
 */
PrinterOptions.prototype.restructureElements = function(){
  let self = this
  const printElements = this.printElements
  const printPages = this.printPages

  // console.log(this.loggerPrefix, 'restructureElements begin. eles:', printElements.length, 'pages', printPages.length)
  //将选中的图片按照从第一个框开始，一个图像一个框的方式依次放入
  let nextElementIndex = 0
  printPages.forEach(function(page, pIndex){
    page.boxes = page.boxes || []
    page.boxes.forEach(function(box, bIndex){
      box.elements = box.elements || []
      for(let i = 0, len = box.elements.length; i < len; i++){
        let elementStyle = box.elements[i].style
        // console.log(self.loggerPrefix, 'restructureElements. page:'+pIndex+' -box:'+bIndex+' -ele:'+i+" -put:"+nextElementIndex+' style'+JSON.stringify(elementStyle))
        if(nextElementIndex >= printElements.length){
          //图片已经放完
          box.elements[i] = {
            pageIndex: pIndex + 1, //页码
            boxIndex: bIndex + 1, //本页布局中的序号,
            elementIndex: i + 1, //元素序号
            active: false,
            image: null,
            style: elementStyle
          }
          continue
        }
        const putElement = JSON.parse(JSON.stringify(printElements[nextElementIndex]))
        putElement.pageIndex = pIndex + 1
        putElement.boxIndex = bIndex + 1
        putElement.elementIndex = i + 1
        putElement.style = elementStyle
        self._vm.$set(box.elements, i, putElement)
        self._vm.$set(printElements, nextElementIndex, putElement)
        //继续下一个
        nextElementIndex++
      }
    })
  })
  //如果现有页面已经放不下元素，则继续追加新的页面
  if(nextElementIndex < printElements.length){
    let nextPageIndex = self.printPages.length + 1
    for(let next = nextElementIndex; next < printElements.length; ){
      let nextElement = JSON.parse(JSON.stringify(printElements[next])) //等待放入的元素
      let pagesLength = self.printPages.length
      if(nextPageIndex > pagesLength){
        console.log(this.loggerPrefix, '现有页面已经放不下元素，则继续追加新的页面, newpage: ', nextPageIndex)
        self.copyLastPage()
        pagesLength = self.printPages.length
      }
      //最后一页
      let lastPage = self.printPages[pagesLength - 1]
      lastPage.boxes = lastPage.boxes || []
      //标志位,表示图片已经放入位置
      let putIntoPlace = false
      for(let i = 0, len1 = lastPage.boxes.length; !putIntoPlace && i < len1; i++){
        const box = lastPage.boxes[i]
        box.elements = box.elements || []
        for(let j = 0, len2 = box.elements.length; !putIntoPlace && j < len2; j++){
          if(box.elements[j].image){
            //已经有图像
            continue
          }
          nextElement.pageIndex = nextPageIndex
          nextElement.boxIndex = i + 1
          nextElement.elementIndex = j + 1
          nextElement.style = box.elements[j].style
          self._vm.$set(box.elements, j, nextElement)
          self._vm.$set(printElements, next, nextElement)
          //标志位
          putIntoPlace = true
          break;
        }
      }
      if(putIntoPlace){
        //图片已经放入最后一页的某个位置
        next ++
      } else {
        //图片没有放入最后一页的位置，说明最后一页也放满了，此时需要继续追加一页
        nextPageIndex ++
      }
    }
  }
  //自动删除最后的空白页
  let emptyIndex = -1
  let plen = self.printPages.length
  for(let p = 0; p < plen; p++){
    let imgEles = self.getElementsHaveImage(self.printPages[p])
    if(!imgEles || imgEles.length < 1){
      emptyIndex = p
      break
    }
  }
  if(emptyIndex > 0 && plen > 1){
    //如果都没有元素，至少保留一个空白页
    emptyIndex = emptyIndex < 1 ? 1 : emptyIndex
    self.printPages.splice(emptyIndex, plen - emptyIndex)
  }
  //切换页码
  if(self.currentPageIndex > self.printPages.length){
    self.currentPageIndex = self.printPages.length
  }
  // console.log(this.loggerPrefix, 'restructureElements end. eles:', self.printElements.length, 'pages', self.printPages.length)
}

/**
 * 复制最后一页
 */
PrinterOptions.prototype.copyLastPage = function(){
  let layout = {rows: 2, cols: 2}
  if(this.printPages && this.printPages.length >= 1){
    const lastPage = this.printPages[this.printPages.length - 1]
    layout = JSON.parse(JSON.stringify(lastPage.layout))
  }
  this.createNewEmptyPage(layout)
}

/**
 * 创建新的空白页
 */
PrinterOptions.prototype.createNewEmptyPage = function(layout = {rows: 1, cols: 1}){
  this.printPages = this.printPages || []
  const newPageIndex = this.printPages.length + 1 //页码计算从1开始，当前页面总数上+1
  const newPage = {
    layout: layout,
    boxes: []
  }
  this.refreshPageLayout(newPage, layout, newPageIndex)
  this.printPages.push(newPage)
},

PrinterOptions.prototype.refreshAllPageLayout = function(layout){
  this.printPages = this.printPages || []
  let self = this
  this.printPages.forEach(function(page, index) {
    self.refreshPageLayout(page, layout ? layout : page.layout, index + 1)
  })
  this.restructureElements()
}

PrinterOptions.prototype.changePageBoxLayout = function(box, layout){
  if(layout && box && box.pageIndex && box.boxIndex){
    this.refreshBoxLayout(box, layout, box.pageIndex, box.boxIndex)
    this.restructureElements()
  }
}

/**
 * 刷新页面布局
 * pageIndex 从 1 开始
 */
PrinterOptions.prototype.refreshPageLayout = function(page, layout, pageIndex){
  if(page && layout && pageIndex){
    page.layout = layout
    page.boxes = page.boxes || new Array()
    //页面大小
    const pageWidth = this.getFilmPageStyleWidth()
    const pageHeight = this.getFilmPageStyleHeight()
    const pageValidWidth = pageWidth - 24 //左右边距
    const pageValidHeight = pageHeight - 24 //上下边距
    let layoutItems = this.calculateLayoutItemsSize(layout, pageValidWidth, pageValidHeight)
    // console.log('refreshPageLayout', pageIndex, layoutItems)
    let boxShowNum = layoutItems ? layoutItems.length : 0
    for(let i = 0; i < boxShowNum; i++){
      let boxStyle = layoutItems[i]
      if(i < page.boxes.length){
        page.boxes[i].style = boxStyle
      } else {
        //加入新的box
        let newBox = {
          layout: {rows: 1, cols: 1},
          elements: [],
          style: boxStyle
        }
        page.boxes.push(newBox)
      }
    }
    //刷新页码，删除多余的box
    if(page.boxes.length > boxShowNum){
      page.boxes.splice(boxShowNum, page.boxes.length - boxShowNum)
    }
    let self = this
    page.boxes.forEach(function(box, index){
      box.pageIndex = pageIndex
      box.boxIndex = index + 1 //从1开始
      box.layout = box.layout || {rows: 1, cols: 1}
      self.refreshBoxLayout(box, box.layout, box.pageIndex, box.boxIndex)
    })
  }
}

/**
 * 刷新页面布局
 * pageIndex 从 1 开始
 * boxIndex 从 1 开始
 */
PrinterOptions.prototype.refreshBoxLayout = function(box, layout, pageIndex, boxIndex){
  if(box && layout){
    box.layout = layout
    box.elements = box.elements || new Array()
    //box大小
    const boxInnerWidth = box.style && box.style.width ? box.style.width.replace('px', '') - 2 : 0
    const boxInnerHeight = box.style && box.style.height ? box.style.height.replace('px', '') - 2 : 0
    let layoutItems = this.calculateLayoutItemsSize(box.layout, boxInnerWidth, boxInnerHeight)
    // console.log('refreshBoxLayout', box, pageIndex, boxIndex, layoutItems)
    box.boxSize = layoutItems ? layoutItems.length : 0
    for(let i = 0; i < box.boxSize; i++){
      let elementStyle = layoutItems[i]
      if(i < box.elements.length){
        box.elements[i].style = elementStyle
      } else {
        //加入新的
        let newElement = {
          image: null,
          style: elementStyle
        }
        box.elements.push(newElement)
      }
    }
    if(box.elements.length > box.boxSize){
      box.elements.splice(box.boxSize, box.elements.length - box.boxSize)
    }
    box.elements.forEach(function(element, index){
      element.pageIndex = pageIndex
      element.boxIndex = boxIndex
      element.elementIndex = index + 1 //从1开始
    })
  }
}
/**
 * 刷新box的选中状态
 */
PrinterOptions.prototype.refreshBoxesActiveStatus = function() {
  let self = this
  this.printPages.forEach(function(page, pIndex) {
    page.boxes.forEach(function(box, bIndex){
      let activedNum = 0
      box.elements.forEach(function(element, index){
        activedNum = activedNum + (element.active ? 1 : 0 )
      })
      self._vm.$set(box, 'active', activedNum > 0)
    })
  })
}

/**
 * 页面跳转
 */
PrinterOptions.prototype.gotoPage = function(arrow){
  // console.log(this.loggerPrefix, 'gotoPage > ', arrow)
  let pageLength = this.printPages.length
  let goPage = this.currentPageIndex
  if(typeof arrow == 'string'){
    if(arrow == 'next'){
      goPage = goPage + 1
    } else if(arrow == 'prev'){
      goPage = goPage - 1
    } else if(arrow == 'fitst'){
      goPage = 1
    } else if(arrow == 'last'){
      goPage = pageLength
    } else {
      return
    }
  } else if(typeof arrow == 'number'){
    goPage = arrow
  }
  goPage = goPage < 1 ? 1 : goPage 
  goPage = goPage > pageLength ? pageLength : goPage 
  this.currentPageIndex = goPage 
}

/**
 * 图像操作
 */
PrinterOptions.prototype.removeActivedImages = function(page){
  const printElements = this.printElements
  if(printElements && page && page.boxes){
    let actived = this.getSelectedElements(page)
    if(actived && actived.length > 0){
      page.boxes.forEach(function(box){
        if(box && box.elements){
          box.elements.forEach(function(element){
            if(element.active){
              let index = printElements.indexOf(element)
              printElements.splice(index, 1)
            }
          })
        }
      })
      //重构所有页面
      this.restructureElements()
    }
  }
}

PrinterOptions.prototype.appendStackImages = function(stack){
  let self = this
  if(stack && stack.images && stack.images.length > 0){
    if(this.appendImageMode == APPEND_IMAGE_MODES.APPEND_LAST){
      self.printElements.forEach(function (item) {
        item.active = false
      })
      //图片依次追加到最后
      stack.images.forEach(function(image){
        self.printElements.push({
          stackIndex: stack._stackIndex, //序列序号
          imageIndex: image._imageIndex, //图像序号
          active: true,
          image: image,
        })
      })
    }
    //重构所有页面
    this.restructureElements()
  }
}

PrinterOptions.prototype.selectStackImages = function(stack){
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

PrinterOptions.prototype.selectPageElements = function(page){
  if(page && page.boxes){
    page.boxes.forEach(function(box) {
      if(box && box.elements){
        box.elements.forEach(function(element) {
          element.active = true
        })
      }
    })
  }
}

PrinterOptions.prototype.cancelAllSelected = function() {
  if(this.printPages){
    let self = this
    this.printPages.forEach(function(page) {
      self.cancelPageAllSelected(page)
    })
  }
}

PrinterOptions.prototype.cancelPageAllSelected = function(page) {
  if(page && page.boxes){
    let self = this
    page.boxes.forEach(function(box) {
      if(box && box.elements){
        box.elements.forEach(function(element) {
          element.active = false
        })
      }
      self._vm.$set(box, 'active', false)
    })
  }
}

PrinterOptions.prototype.dblclickSingleElement = function(element){
  const printElements = this.printElements
  if(element && element.pageIndex){
    printElements.forEach(function(item){
      item.active = item.pageIndex == element.pageIndex
    })
  }
}

/**
 * 点击单个元素
 */
PrinterOptions.prototype.clickSingleElement = function(element){
  let self = this
  const printElements = this.printElements
  if(element && element.pageIndex && element.boxIndex && element.elementIndex){
    if(self.pressingKeyCode == KEY_CODE.SHIFT){
      //SHIFT 按键处理
      //找到当前选中的元素
      let firstIndex = printElements.length
      let lastIndex = -1
      let currIndex = -1
      printElements.forEach(function(item, eleIndex){
        if(item.pageIndex == element.pageIndex && item.active){
          firstIndex = eleIndex < firstIndex ? eleIndex : firstIndex
          lastIndex = eleIndex > lastIndex ? eleIndex : lastIndex
        }
        if(item.pageIndex == element.pageIndex 
          && item.boxIndex == element.boxIndex 
          && item.elementIndex == element.elementIndex ){
          //当前点击的元素
          currIndex = eleIndex
        }
      })
      let beginIndex = Math.min(currIndex, firstIndex, lastIndex)
      let endIndex = Math.max(currIndex, firstIndex, lastIndex)
      printElements.forEach(function(item, eleIndex){
        item.active = eleIndex >= beginIndex && eleIndex <= endIndex
        // self.$set(item, 'active', eleIndex >= beginIndex && eleIndex <= endIndex)
      })
    } else if(self.pressingKeyCode == KEY_CODE.CTRL){
      //CTRL 按键处理
      // printElements.forEach(function(item, eleIndex){
      //   if(item.pageIndex == element.pageIndex 
      //     && item.boxIndex == element.boxIndex 
      //     && item.elementIndex == element.elementIndex ){
      //     //当前点击的元素
      //     item.active = !item.active
      //     // self.$set(item, 'active', !item.active)
      //   }
      // })
      element.active = !element.active
    } else {
      //单点此元素
      printElements.forEach(function(item, eleIndex){
        if(item.pageIndex == element.pageIndex){
          //当前点击的元素
          item.active = item.boxIndex == element.boxIndex && item.elementIndex == element.elementIndex
        }
      })
    }
    //其他页的元素的active置为false
    printElements.forEach(function(item){
      if(item.pageIndex != element.pageIndex) item.active = false
    })
  }
}


/**
 * 页面尺寸监听变化
 */
PrinterOptions.prototype._refreshFilmDomSize = function(){
  //改变dom元素大小
  let filmDom = document.getElementById(this.filmDomId)
  if(filmDom){
    filmDom.style.width = this.getFilmPageStyleWidth() + "px"
    filmDom.style.height = this.getFilmPageStyleHeight() + "px"
    this.refreshAllPageLayout()
  }
}

PrinterOptions.prototype.refreshFilmSize = function(size){
  // console.log(this.loggerPrefix, 'refreshFilmSize', JSON.stringify(size), JSON.stringify(this.filmSize))
  if(size && size.width && size.height){
    if(this.filmSize.width != size.width || this.filmSize.height != size.height){
      this.filmSize = size
      this._refreshFilmDomSize()
    }
  }
}

PrinterOptions.prototype.refreshFilmDirection = function(direction){
  // console.log(this.loggerPrefix, 'refreshFilmDirection', direction)
  if(direction == FILM_DIRECTION.HORIZONTAL || direction == FILM_DIRECTION.VERTICAL){
    if(this.filmDirection != direction){
      this.filmDirection = direction
      this._refreshFilmDomSize()
    }
  }
}

/**
 * 真实样式的宽高度
 */
PrinterOptions.prototype.getFilmPageStyleWidth = function(){
  const width = this.filmSize.width || 100
  const height = this.filmSize.height || 100
  if(this.filmDirection == FILM_DIRECTION.HORIZONTAL){
    return Math.max(width, height)
  } else if(this.filmDirection == FILM_DIRECTION.VERTICAL){
    return Math.min(width, height)
  }
  return width
}

PrinterOptions.prototype.getFilmPageStyleHeight = function(){
  const width = this.filmSize.width || 100
  const height = this.filmSize.height || 100
  if(this.filmDirection == FILM_DIRECTION.HORIZONTAL){
    return Math.min(width, height)
  } else if(this.filmDirection == FILM_DIRECTION.VERTICAL){
    return Math.max(width, height)
  }
  return height
}

/**
 * 计算每个元素的px大小
 * clientWidth, clientHeight 不包含border
 */
PrinterOptions.prototype.calculateLayoutItemsSize = function(layout, clientWidth, clientHeight){
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


