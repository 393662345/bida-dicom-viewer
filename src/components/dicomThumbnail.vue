<template>
  <div :class="['zy-dicom-thumbnail', className, options && options.active ? 'active' : '']" 
    :title="displayProgress >= 100 ? hoverHint : '加载中'"
    @click="handleClick" 
    @dblclick="handleDblClick">
    <img class="zy-dicom-thumbnail-icon" :src="options.thumbLoadUrl" v-show="options.thumbLoadUrl" />
    <div class="zy-dicom-thumbnail-label">{{options._stackIndex < 0 ? '-' : options._stackIndex + 1}} : {{options._loadTotal}}</div>
    <div class="zy-dicom-thumbnail-progress-mask" :style="{left: displayProgress+'%'}" v-show="displayProgress < 100"></div>
    <div class="zy-dicom-thumbnail-progress-value" v-show="displayProgress < 100">{{displayProgress}}%</div>
  </div>
</template>
<script>
/**
 * 序列缩略图
 */
export default {
  props: {
    appManager: {
      type: Object,
      default: function () {
        return null
      }
    },
    //添加css
    className: {
      type: String,
      default: function() {
        return ''
      }
    },
    hoverHint: {
      type: String,
      default: function() {
        return null
      }
    },
    //具体参数
    options: {
      type: Object,
      default: function() {
        return {
          hospitalZid: null,
          studyZid: null,
          seriesZid: null,
          seriesSeq: null,
          seriesNumber: null,
          thumbImgZid: null,
          thumbLoadUrl: null,
          images: [],
          _stackIndex: 0,
          _loadTotal: 0,
          _loadedNum: null,
          _loadStatus: null,
          active: false, //是否选中当前序列
        }
      }
    },
  },
  computed: {
      // loadProgress(){
      //   if(this.options._loadTotal < 1){
      //     return 100
      //   }
      //   let num = this.options._loadedNum
      //   let curr = (num == undefined || num == null) ? 0 : num
      //   return Math.floor(curr * 100 / this.options._loadTotal)
      // }
    },
    data() {
      return {
        loadProgress: 0, //真实进度百分比
        displayProgress: 0, //显示进度百分比
        __interval: null
      }
    },
    watch: {
      'options._loadedNum'(num) {
        if (this.options._loadTotal < 1) {
          this.loadProgress = 100
          return
        }
        let self = this
        let curr = (num == undefined || num == null) ? 0 : num
        this.loadProgress = Math.floor(curr * 100 / this.options._loadTotal)
        if(!this.options.thumbLoadUrl && num == 1){
          //当前序列没有缩略图
          let element = this.$el
          let imageId = this.options.images[0].loadUrl
          if(element && imageId && this.appManager){
            // console.log('try thumbnail by imageid', element, imageId)
            this.$nextTick(() => {
              self.appManager.loadImageInElementAsThumb(element, imageId)
            })
          }
        }
      },
      'options._loadStatus'(status) {
        if (status == 'loading') {
          
        } if (status == 'ok') {
          this.loadProgress = 100
        }
      },
      displayProgress(percent) {
        if (this.options_loadStatus == 'ok' && percent >= 100) {
          window.clearInterval(this.__interval);
        }
      }
    },
    created(){
      //创建刷新进度的定时器
      this.__interval = window.setInterval(this.progressForward, 10)
    },
    methods: {
      progressForward() {
        if (this.displayProgress < this.loadProgress) {
          this.displayProgress++
        }
      },
      handleClick() {
        this.$set(this.options, 'active', true)
        this.$emit('on-click', this.options)
      },
      handleDblClick() {
        this.$set(this.options, 'active', true)
        this.$emit('on-dblclick', this.options)
      },
    }
}
</script>
<style lang="less">
@dicomSeriesThumbSize: 64px;
@dicomSeriesThumbActiveBorder: rgba(255,255,255,0.66);
.zy-dicom-thumbnail {
  position: relative;
  text-align: center;
  width: @dicomSeriesThumbSize;
  height: @dicomSeriesThumbSize;
  margin: auto; // display: inline-block;
  border: 1px solid initial;
  background-color: #000;
  box-sizing: content-box;
  // cursor: pointer;
  &:hover {
    .zy-dicom-thumbnail-label {
      background-color: #ccc;
      color:#000;
    }
  }
  &.active {
    border: 1px solid @dicomSeriesThumbActiveBorder;
  }
  .zy-dicom-thumbnail-icon {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .zy-dicom-thumbnail-label {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    color: #ccc; // background-color: rgba(158, 158, 158, 0.54);
  }
  .zy-dicom-thumbnail-progress-value {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    font-size: 16px;
    font-weight: bold;
    color: #aaa;
    cursor: wait;
    line-height: @dicomSeriesThumbSize; // background-color: rgba(96, 125, 139, 0.52);
  }
  .zy-dicom-thumbnail-progress-mask {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    cursor: wait;
    background-color: rgba(96, 125, 139, 0.52);
  }
}
</style>
