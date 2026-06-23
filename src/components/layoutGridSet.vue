<template>
  <div :class="['zy-dicom-layout-grid', className]">
    <div class="layout-grid-box" :style="{minWidth: boxMinWidth+'px',minHeight: boxMinWidth+'px',margin: '2px'}" @mouseleave="mouseMoving=false">
      <div class="layout-grid-rows" v-for="i in sideLength" :key="'_zylg_r_'+i">
        <div v-for="j in sideLength" :key="'_zylg_r_'+i + '_c_'+j" :class="{'active': (mouseMoving ? i <= currRows && j <=currCols : i <= rows && j <=cols)}" 
          title="点击即可应用"
          @mousemove="handleMouseMove(i, j)" @click="handleClicked(i, j)">
        </div>
      </div>
    </div>
    <div class="layout-grid-hint">{{mouseMoving ? currRows : rows}}x{{mouseMoving ? currCols : cols}}，请点击确认</div>
  </div>
</template>
<script>
/**
 * 序列缩略图
 */
export default {
  props: {
    //添加css
    className: {
      type: String,
      default: function() {
        return ''
      }
    },
    sideLength: {
      type: Number,
      default: function() {
        return 5
      }
    },
    //从0开始
    rows: {
      type: Number,
      default: function() {
        return 0
      }
    },
    cols: {
      type: Number,
      default: function() {
        return 0
      }
    },
  },
  computed: {
    boxMinWidth(){
      return 28 * this.sideLength
    }
  },
  data() {
    return {
      mouseMoving: false,
      currRows: this.rows,
      currCols: this.cols
    }
  },
  // created() {
  //   //创建刷新进度的定时器
  //   this.__interval = window.setInterval(this.progressForward, 10)
  // },
  methods: {
    handleMouseMove(i, j) {
      this.mouseMoving = true
      this.currRows = i
      this.currCols = j
    },
    handleClicked(i, j) {
      this.currRows = i
      this.currCols = j
      this.mouseMoving = false
      this.$emit('on-change', i, j)
    },
  }
}
</script>
<style lang="less">
.zy-dicom-layout-grid {
  position: relative;
  .layout-grid-box {
    font-size: 0;
    line-height: 0;
    .layout-grid-rows {
      font-size: 0;
      line-height: 0;
      > div {
        display: inline-block;
        font-size: 0;
        line-height: 0;
        margin: 2px;
        box-sizing: border-box;
        white-space: nowrap;
        border: 1px solid #ccc;
        width: 24px;
        height: 24px;
        &.active {
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
