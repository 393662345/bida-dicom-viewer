<template>
    <div class="zy-viewer-func-tab-container">
        <div class="viewer-func-item" @click="handlePrint">
            <div class="viewer-func-item-icon icon-print"></div>
            <div class="viewer-func-item-label">打印</div>
        </div>
        <!-- <div class="viewer-func-item">
            <div class="viewer-func-item-icon icon-export-file"></div>
            <div class="viewer-func-item-label">文件导出</div>
        </div> -->
        <FuncItem :item="funcItems.exportDcm" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.saveAsPng" @on-click="handleFuncItemClick"></FuncItem>
    </div>
</template>
<script>
import FuncItem from './funcItem'
import * as FuncItems from './funcItems.js'
export default {
    components: {
        FuncItem,
    },
    props: {
        appManager: {
            type: Object,
            default: function () {
                return null
            }
        },
        viewerManager: {
            type: Object,
            default: function () {
                return null
            }
        },
    },
    computed: {
    },
    data(){
        return{
            funcItems: FuncItems,
        }
    },
    methods: {
        handleFuncItemClick(funcItem){
            funcItem.handleClick(this.viewerManager.viewMode)
        },
        handlePrint(){
          window.print()
        }
    }
}
</script>
