<template>
    <div class="zy-viewer-func-tab-container">
        <FuncItem :item="funcItems.openViewer" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.openSurfaceViewer" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.closeSurfaceViewer" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.changeWL" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeThicknessMM" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.changeRenderMode1" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeRenderMode2" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeRenderMode3" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeRenderMode4" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeRenderMode5" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.changeCameraAngle1" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeCameraAngle2" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeCameraAngle3" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.changeMPRMouseType1" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.changeMPRMouseType2" @on-click="handleFuncItemClick"></FuncItem>

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
            funcItem.handleClick('3d')
        },
    }
}
</script>



