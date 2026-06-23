<template>
    <div class="zy-viewer-func-tab-container">
        <FuncItem :item="funcItems.reportRoi" @on-click="handleFuncItemClick"></FuncItem>
        
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.arrowAnnotate" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.length" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.simpleAngle" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.rectangleRoi" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.ellipticalRoi" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <!-- <FuncItem :item="funcItems.freehand" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem> -->
        <FuncItem :item="funcItems.probe" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.huValue" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.huAreaValue" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <!-- <FuncItem :item="funcItems.magnify" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem> -->
        <FuncItem :item="funcItems.eraser" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.clearTools" @on-click="handleFuncItemClick"></FuncItem>
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
    data(){
        return{
            funcItems: FuncItems
        }
    },
    methods: {
        handleFuncItemClick(funcItem){
            funcItem.handleClick(this.viewerManager.viewMode)
        },
    }
}
</script>




