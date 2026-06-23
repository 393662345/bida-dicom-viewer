<template>
    <div class="zy-viewer-func-tab-container">
        <FuncItem :item="funcItems.stackScroll" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.pan" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.zoom" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.original" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.fitToWindow" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.wwwc" :enableActive="true" @on-click="handleFuncItemClick"></FuncItem>
        
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
                                <button @click.stop="setCustomWWWC" @focus="isCustomWWWCSelect = true">应用</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <FuncItem :item="funcItems.invert" @on-click="handleFuncItemClick"></FuncItem>

        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.vflip" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.hflip" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.clockwise" @on-click="handleFuncItemClick"></FuncItem>
        <FuncItem :item="funcItems.anticlockwise" @on-click="handleFuncItemClick"></FuncItem>
        
        <div class="zy-viewer-split-line vertical"></div>
        <FuncItem :item="funcItems.reset" @on-click="handleFuncItemClick"></FuncItem>

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
        return{
            funcItems: FuncItems,
            isCustomWWWCSelect: false,
            currentWWWC: {'windowWidth': null, 'windowCenter': null},
        }
    },
    methods: {
        handleFuncItemClick(funcItem){
            funcItem.handleClick(this.viewerManager.viewMode)
        },

        setCustomWWWC(){
            // console.log('click set wwwc',this.currentWWWC.windowWidth,this.currentWWWC.windowCenter)
            let self = this
            let ww = this.currentWWWC.windowWidth
            let wc = this.currentWWWC.windowCenter
            if(!isNaN(Number(ww)) && !isNaN(Number(wc))) {
                ww = Number(ww);
                wc = Number(wc);
                const selectedElements = this.viewerManager.getSelectedElements()
                if(selectedElements && selectedElements.length > 0){
                    selectedElements.forEach(function(element) {
                        self.$set(element, 'presetWwwc', {windowWidth: ww, windowCenter: wc}) 
                    })
                }
            }
            this.isCustomWWWCSelect = false
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
    }
}
</script>



