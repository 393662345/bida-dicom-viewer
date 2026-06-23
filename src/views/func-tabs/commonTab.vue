<template>
<div>
    <div class="zy-viewer-func-tab-container" v-show="viewerManager.viewMode == '2d'">
        <div :class="['viewer-func-item', 'viewer-func-item-more']">
            <div class="viewer-func-item-icon icon-layout"></div>
            <div class="viewer-func-item-label">序列布局</div>
            <div class="viewer-func-item-more-dropdown">
              <LayoutGridSet :sideLength="5" :rows="containerLayout.rows" :cols="containerLayout.cols" @on-change="changeContainerLayoutGrid" />
            </div>
        </div>
        <div :class="['viewer-func-item', 'viewer-func-item-more']">
            <div class="viewer-func-item-icon icon-layout"></div>
            <div class="viewer-func-item-label">图像布局</div>
            <div class="viewer-func-item-more-dropdown">
              <LayoutGridSet :sideLength="5" :rows="currentBoxLayout.rows" :cols="currentBoxLayout.cols" @on-change="changeBoxLayoutGrid" />
            </div>
        </div>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.wwwc" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="viewer-func-item viewer-func-item-more">
            <div class="viewer-func-item-icon icon-preset"></div>
            <div class="viewer-func-item-label">预设</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.brain" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.lung" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.belly" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.skeleton" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>
        <FuncItem :item="funcItems.invert" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.pan" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.zoom" :enableActive="true" :hasMore="true" @on-click="handleFuncItemClick">
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.original" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.fitToWindow" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </FuncItem>
        <FuncItem :item="funcItems.stackScroll" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <div class="viewer-func-item viewer-func-item-more" >
            <div class="viewer-func-item-icon icon-rotate"></div>
            <div class="viewer-func-item-label">旋转</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.vflip" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.hflip" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.clockwise" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.anticlockwise" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.reset" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.reportRoi" label="ROI" @on-click="handleFuncItemClick"></FuncItem>
        <div :class="['viewer-func-item','viewer-func-item-more', {'viewer-func-item-active': currentLabelTool && currentLabelTool.active}]" >
            <div :class="['viewer-func-item-icon', currentLabelTool ? currentLabelTool.iconClass : 'icon-point']"></div>
            <div class="viewer-func-item-label">{{currentLabelTool ? currentLabelTool.name : '标注'}}</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.arrowAnnotate" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.probe" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>
        <div :class="['viewer-func-item','viewer-func-item-more', {'viewer-func-item-active': currentMeasureTool && currentMeasureTool.active}]" >
            <div :class="['viewer-func-item-icon', currentMeasureTool ? currentMeasureTool.iconClass : 'icon-measure']"></div>
            <div class="viewer-func-item-label">{{currentMeasureTool ? currentMeasureTool.name : '测量'}}</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.length" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.simpleAngle" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.rectangleRoi" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.ellipticalRoi" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>
        <FuncItem :item="funcItems.huValue" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.scrollPrev" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.play" 
            :icon="currentFirstActiveElement && currentFirstActiveElement.isPlaying ? 'icon-pause' : 'icon-play'"
            @on-click="triggerManagerPlayElement"></FuncItem>
        <FuncItem :item="funcItems.scrollNext" @on-click="handleFuncItemClick"></FuncItem>
        <div :class="['viewer-func-item', 'viewer-func-item-more', 'viewer-func-item-speed']" >
            <div class="viewer-func-item-label">速率：{{currentPlaySpeed ? currentPlaySpeed.name : ''}}</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.lowSpeed" size="small"  @on-click="toggleManagerPlaySpeed"></FuncItem>
                <FuncItem :item="funcItems.normalSpeed" size="small"  @on-click="toggleManagerPlaySpeed"></FuncItem>
                <FuncItem :item="funcItems.quickSpeed" size="small"  @on-click="toggleManagerPlaySpeed"></FuncItem>
            </div>
        </div>
    </div>
    <!-- MPR常用操作 -->
    <div class="zy-viewer-func-tab-container" v-show="viewerManager.viewMode != '2d'">
        <div class="viewer-func-item viewer-func-item-more" v-show="viewerManager.mprOptions.display3d">
            <div class="viewer-func-item-icon icon-direction-3d"></div>
            <div class="viewer-func-item-label">3D方向</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.mprCameraAngleC" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprCameraAngleS" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprCameraAngleA" size="small" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>
        <div class="viewer-func-item viewer-func-item-more" v-show="viewerManager.mprOptions.display3d">
            <div class="viewer-func-item-icon icon-vr-preset"></div>
            <div class="viewer-func-item-label">3D渲染</div>
            <div class="viewer-func-item-more-dropdown">
                <FuncItem :item="funcItems.mpr3DRenderDefault" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderBone" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderSkull" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderVessel1" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderCardiac1" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderCardiac2" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderSkin" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderLungTrans" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderLungSolid1" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderLungColor" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderMRIVessel" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderMRIBrain" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderVEColon1" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mpr3DRenderNone" size="small" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div>
        <div class="zy-viewer-split-line vertical" v-show="viewerManager.mprOptions.display3d"></div>
        
        <!-- <div class="viewer-func-item viewer-func-item-more">
            <div class="viewer-func-item-icon icon-thickness"></div>
            <div class="viewer-func-item-label">厚度</div>
            <div class="viewer-func-item-more-dropdown ">
                <FuncItem :item="funcItems.mprThickness1" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness2" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness3" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness4" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness5" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness10" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness15" size="small" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.mprThickness20" size="small" @on-click="handleFuncItemClick"></FuncItem>
            </div>
        </div> -->

        <!-- <div class="zy-viewer-split-line vertical"></div> -->
        <!-- <FuncItem :item="funcItems.mprAIP" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprMIP" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprMinIP" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprVR" @on-click="handleFuncItemClick"></FuncItem> -->

        <!-- <div class="zy-viewer-split-line vertical"></div> -->
        <!-- <FuncItem :item="funcItems.mprWwwc" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem> -->
        <div class="viewer-func-spec-items">
            <div class="viewer-func-spec-items-line">
                <FuncItem :item="funcItems.brain" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.lung" @on-click="handleFuncItemClick"></FuncItem>
            </div>
            <div class="viewer-func-spec-items-line">
                <FuncItem :item="funcItems.belly" @on-click="handleFuncItemClick"></FuncItem>
                <FuncItem :item="funcItems.skeleton" @on-click="handleFuncItemClick"></FuncItem>
            </div>
            <div class="viewer-func-spec-items-line">
                <div :class="['viewer-func-item', 'viewer-func-item-more',{'viewer-func-custom-show': isCustomWWWCSelect}]">
                    <div class="viewer-func-item-label"  @click="isCustomWWWCSelect = !isCustomWWWCSelect">自定义</div>
                    <div :class="['viewer-func-item-more-show']">
                        <div class="viewer-func-custom-wwwc">
                            <div class="viewer-func-wwwc-width">
                                <input type="text" placeholder="窗宽" @blur="isCustomWWWCSelect = false" @focus="isCustomWWWCSelect = true" v-model="currentWWWC.windowWidth">
                                <input type="text" placeholder="窗位" @blur="isCustomWWWCSelect = false" @focus="isCustomWWWCSelect = true" v-model="currentWWWC.windowCenter">
                                <button @click.stop="presetMprWwwcPapaya" @focus="isCustomWWWCSelect = true">应用</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.mprSwap" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprOrigin" @on-click="handleFuncItemClick"></FuncItem>
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.mprPan" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprZoom" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.mprRuler" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
    </div>
    
</div>
</template>
<script>
import FuncItem from './funcItem'
import LayoutGridSet from '../../components/layoutGridSet'
import * as FuncItems from './funcItems.js'
export default {
    components: {
        LayoutGridSet,
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
        containerLayout(){
            let container = this.viewerManager ? this.viewerManager.container : null
            return (container ? container.layout : null) || {
                rows: 0,
                cols: 0
            }
        },
        currentBoxLayout(){
            let box = this.viewerManager ? this.viewerManager.getCurrentActivedBox() : null
            return (box ? box.layout : null) || {
                rows: 0,
                cols: 0
            }
        },
        currentLabelTool(){
            if(this.funcItems.arrowAnnotate.active){
                return this.funcItems.arrowAnnotate
            } else if(this.funcItems.probe.active){
                return this.funcItems.probe
            }
            return null
        },
        currentMeasureTool(){
            if(this.funcItems.length.active){
                return this.funcItems.length
            } else if(this.funcItems.simpleAngle.active){
                return this.funcItems.simpleAngle
            } else if(this.funcItems.rectangleRoi.active){
                return this.funcItems.rectangleRoi
            } else if(this.funcItems.ellipticalRoi.active){
                return this.funcItems.ellipticalRoi
            }
            return null
        },
        currentFirstActiveElement(){
            const selectedElements = this.viewerManager.getSelectedElements()
            if(selectedElements && selectedElements.length > 0){
                return selectedElements[0]
            }
            return null
        },
        currentPlaySpeed(){
            let speed = this.appManager.playFramesPerSecond
            if(this.funcItems.lowSpeed.params == speed){
                return this.funcItems.lowSpeed
            } else if(this.funcItems.normalSpeed.params == speed){
                return this.funcItems.normalSpeed
            } else if(this.funcItems.quickSpeed.params == speed){
                return this.funcItems.quickSpeed
            }
            return null
        }
    },
    data(){
        return {
            funcItems: FuncItems,
            isCustomWWWCSelect: false,
            currentWWWC: {'windowWidth': null, 'windowCenter': null},
        }
    },
    methods: {
        handleFuncItemClick(funcItem){
            funcItem.handleClick(this.viewerManager.viewMode)
        },

        changeContainerLayoutGrid(rowsNum, colsNum){
            if(this.viewerManager && rowsNum && colsNum){
                this.viewerManager.cancelShowUniqueElement() //退出显示唯一的元素
                this.viewerManager.refreshContainerLayout({rows: rowsNum, cols: colsNum})
            }
        },

        changeBoxLayoutGrid(rowsNum, colsNum){
            if(this.viewerManager && rowsNum && colsNum){
                this.viewerManager.cancelShowUniqueElement() //退出显示唯一的元素
                let box = this.viewerManager.getCurrentActivedBox()
                this.viewerManager.refreshBoxLayout(box, {rows: rowsNum, cols: colsNum}, box.boxIndex)
            }
        },

        //播放、暂停
        triggerManagerPlayElement(funcItem){
            let target = this.currentFirstActiveElement
            if(funcItem && target){
                this.$set(target, 'isPlaying', !target.isPlaying) 
            }
        },

        toggleManagerPlaySpeed(funcItem){
            if(funcItem && funcItem.code && funcItem.params){
                this.appManager.setPlayFramesPerSecond(funcItem.params)
            }
        },
        
        //Mpr 操作
        toggleMprDisplay3d(){
            let flag = this.viewerManager.mprOptions.display3d
            this.viewerManager.mprOptions.display3d = !flag
            //
            let mprOptions = this.viewerManager.mprOptions
            if(mprOptions && mprOptions.iframeRef && mprOptions.iframeSrc){
                let message = {Tag:'closeSurfaceViewer'}
                if(this.viewerManager.mprOptions.display3d){
                    message = {Tag:'openSurfaceViewer'}
                }
                console.log(' #### Mpr postMessage', mprOptions.iframeSrc, JSON.stringify(message))
                mprOptions.iframeRef.postMessage(JSON.stringify(message), mprOptions.iframeSrc)
            }
        },
        presetMprWwwcPapaya(){
            let ww = this.currentWWWC.windowWidth
            let wc = this.currentWWWC.windowCenter
            if(!isNaN(Number(ww)) && !isNaN(Number(wc))) {
                console.log('papaya wl', Number(ww), Number(wc))
                window.papaya.Container.changeWL(Number(ww), Number(wc))
            }
            this.isCustomWWWCSelect = false
        },
        presetMprWwwc(){
            let mprOptions = this.viewerManager.mprOptions
            if(mprOptions && mprOptions.iframeRef && mprOptions.iframeSrc){
                let ww = this.currentWWWC.windowWidth
                let wc = this.currentWWWC.windowCenter
                if(!isNaN(Number(ww)) && !isNaN(Number(wc))) {
                    let message = {Tag:'changeWL', W:Number(ww),L:Number(wc)}
                    console.log(' #### Mpr postMessage', mprOptions.iframeSrc, JSON.stringify(message))
                    mprOptions.iframeRef.postMessage(JSON.stringify(message), mprOptions.iframeSrc)
                }
            }
            this.isCustomWWWCSelect = false
        }
    }
}
</script>


