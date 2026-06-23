<template>
    <div class="zy-viewer-func-tab-container">
        <div class="viewer-func-item viewer-func-item-more">
            <div class="viewer-func-item-icon icon-info-4corner"></div>
            <div class="viewer-func-item-label">四角信息</div>
            <div class="viewer-func-item-more-dropdown ">
                <div class="viewer-func-item viewer-func-item-small" @click="toggleImage4CornerLayer()">
                    <div :class="['viewer-func-item-icon', appManager.isVisibleOfImage4Corner() ? 'icon-check-true':'icon-check-false']"></div>
                    <div class="viewer-func-item-label">全选/不选</div>
                </div>
                <div class="zy-viewer-split-line horizontal"></div>
                <FuncItem :item="funcItems.layerPatientName" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerPatientName.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerPatientId" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerPatientId.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerPatientGender" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerPatientGender.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerPatientAge" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerPatientAge.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerStudyDate" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerStudyDate.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerImageScale" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerImageScale.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerImageWwwc" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerImageWwwc.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerImageRuler" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerImageRuler.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerStackIndex" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerStackIndex.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
                <FuncItem :item="funcItems.layerImageIndex" size="small" :icon="appManager.isVisibleOfImage4Corner(funcItems.layerImageIndex.code) ? 'icon-check-true':'icon-check-false'" @on-click="toggleImage4CornerLayer"></FuncItem>
            </div>
        </div>
        <!-- <div class="viewer-func-item viewer-func-item-more">
            <div class="viewer-func-item-icon icon-series-compare"></div>
            <div class="viewer-func-item-label">序列对比</div>
        </div> -->
        <div class="zy-viewer-split-line vertical"></div>
        <div class="viewer-func-spec-items">
            <div class="viewer-func-spec-items-line">
                <div class="viewer-func-item" style="text-align:left;min-width:84px;" @click="toggleAppManagerSync('stackImageIndex')">
                    <div :class="['viewer-func-item-icon', appManager.isSynchronizerEnable('stackImageIndex') ? 'icon-check-true':'icon-check-false']"></div>
                    <div class="viewer-func-item-label">图像ID</div>
                </div>
                <div class="viewer-func-item" style="text-align:left;min-width:84px;" @click="toggleAppManagerSync('refLine')">
                    <div :class="['viewer-func-item-icon', appManager.isSynchronizerEnable('refLine') ? 'icon-check-true':'icon-check-false']"></div>
                    <div class="viewer-func-item-label">定位线</div>
                </div>
            </div>
            <div class="viewer-func-spec-items-line">
                <div class="viewer-func-item" style="text-align:left;min-width:84px;" @click="toggleAppManagerSync('wwwc')">
                    <div :class="['viewer-func-item-icon', appManager.isSynchronizerEnable('wwwc') ? 'icon-check-true':'icon-check-false']"></div>
                    <div class="viewer-func-item-label">窗宽窗位</div>
                </div>
                <div class="viewer-func-item" style="text-align:left;min-width:84px;" @click="toggleAppManagerSync('panZoom')">
                    <div :class="['viewer-func-item-icon', appManager.isSynchronizerEnable('panZoom') ? 'icon-check-true':'icon-check-false']"></div>
                    <div class="viewer-func-item-label">平移/缩放</div>
                </div>
            </div>
            <div class="viewer-func-spec-items-line">
                <div class="viewer-func-item">
                    <div class="viewer-func-item-label">图像同步</div>
                </div>
            </div>
        </div>
        <div class="zy-viewer-split-line vertical"></div>
        <div class="viewer-func-item" @click="toggleDCMInfo">
            <div class="viewer-func-item-icon icon-info-dcm"></div>
            <div class="viewer-func-item-label">DCM信息</div>
        </div>
        <!-- <div :class="['viewer-func-spec-dcm-info']">
            <Modal v-model="showDcmInfo" width="70" ok-text="关闭" cancel-text="" :closable="false" :scrollable="false">
                <Tabs>
                    <TabPane label="ALL">
                        <Table :loading="modalLoading" :columns="dcmColumns" :data="dcmDataAll" width="881px" height="510"></Table>
                    </TabPane>
                    <TabPane label="Patient">
                        <Table :columns="dcmColumns" :data="dcmDataPatient" width="881px" height="510"></Table>
                    </TabPane>
                    <TabPane label="Study">
                        <Table :columns="dcmColumns" :data="dcmDataStudy" width="881px" height="510"></Table>
                    </TabPane>
                    <TabPane label="Physician">
                        <Table :columns="dcmColumns" :data="dcmDataPhysician" width="881px" height="510"></Table>
                    </TabPane>
                    <TabPane label="Image">
                        <Table :columns="dcmColumns" :data="dcmDataImage" width="881px" height="510"></Table>
                    </TabPane>
                </Tabs>
            </Modal>
        </div> -->
        
        <!-- <div class="viewer-func-item">
            <div class="viewer-func-item-label">本地</div>
            <input class="func-import-input" type="file" multiple="multiple" accept=".dcm,.DCM" @change="handleLoadFileChanged"/>
        </div> -->
    </div>
</template>
<script>
import ViewerUtils from '../viewerUtils.js'
import FuncItem from './funcItem'
import * as FuncItems from './funcItems.js'
import {tagsData} from './tagsCode.js'
import * as dcmTagsFilter from './dcmTagsFilter.js'
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
            dcmColumns: [
                {
                    title: 'Group',
                    key: 'group',
                    width: 70
                },
                {
                    title: 'Element',
                    key: 'element',
                    width: 80
                },
                {
                    title: 'Tag Description',
                    key: 'tagDescription',
                    width: 360
                },
                {
                    title: 'VR',
                    key: 'vr',
                    width: 50
                },
                {
                    title: 'Length',
                    key: 'length',
                    width: 72
                },
                {
                    title: 'Value',
                    key: 'value',
                    minWidth: 300
                },
                
            ],
            modalLoading: false,
            dcmDataAll: [],
            showDcmInfo: false,
            funcItems: FuncItems,
            //文件导入信息
            showProcessModal: false,
            processModalOptions: {
                total: 0,
                finished: 0,
                percent: 0,
            },
        }
    },
    computed:{
        dcmDataPatient(){
            var patientList = dcmTagsFilter.patient.join('-');
            return this.dcmDataAll.filter(item => {
                return patientList.indexOf(item.group+','+item.element) > -1
            })
        },
        dcmDataStudy(){
            var studyList = dcmTagsFilter.study.join('-');           
            return this.dcmDataAll.filter(item => {
                return studyList.indexOf(item.group+','+item.element) > -1
            })
        },
        dcmDataPhysician(){
            var physicianList = dcmTagsFilter.physician.join('-');
            return this.dcmDataAll.filter(item => {
                return physicianList.indexOf(item.group+','+item.element) > -1
            })
        },
        dcmDataImage(){
            var imageList = dcmTagsFilter.image.join('-');
            return this.dcmDataAll.filter(item => {
                return imageList.indexOf(item.group+','+item.element) > -1
            })
        }
    },
    methods: {
        handleFuncItemClick(funcItem){
            funcItem.handleClick(this.viewerManager.viewMode)
        },
        //切换四周的显示信息控制
        toggleImage4CornerLayer(funcItem){
            if(funcItem && funcItem.code){
                this.appManager.toggleImage4CornerInfo(funcItem.code)
            } else {
                this.appManager.toggleImage4CornerInfo()
            }
        },
        //切换同步开关
        toggleAppManagerSync(syncName){
            let enable = this.appManager.isSynchronizerEnable(syncName)
            this.appManager.enableSynchronizer(syncName, !enable)
        },
        
        handleLoadFileChanged(e){
            let self = this
            let target = e.target
            if(target && target.files){
                this.showProcessModal = true
                this.processModalOptions.total = target.files.length
                this.processModalOptions.percent = 0
                //加载文件
                this.appManager.loadLocalDicomFiles(target.files, (num) => {
                    this.processModalOptions.finished = num
                    if(this.processModalOptions.total < 0){
                        this.processModalOptions.percent = 100
                    } else {
                        this.processModalOptions.percent = Math.floor(num * 100 / this.processModalOptions.total)
                    }
                }).then(function(imageList){
                    const appendStudyStacks = ViewerUtils.convertImageListToStacks(imageList)
                    appendStudyStacks.forEach(function(study){
                        //合并检查数据
                        ViewerUtils.combineTargetStudyStack(self.viewerManager.studyStacks, study)
                        //获取检查信息
                        let firstImage = ViewerUtils.getFirstImageFromStudyStack(study)
                        if(firstImage){
                            // self.appManager.getStudyDetailByImageId(firstImage.loadUrl, (detailInfo) => {
                            self.appManager.getOriginalStudyDetailByImageId(firstImage.loadUrl, (detailInfo) => {
                                self.$set(study, 'studyDetail', detailInfo)
                                // study.studyDetail = detailInfo
                                console.log(detailInfo)
                            }, (error) => {})
                        }
                        self.showProcessModal = false
                    })
                    self.appManager.continueLoadImages()
                }, function(error){
                    self.showProcessModal = false
                })
            }
        },
        async toggleDCMInfo(){
            this.showDcmInfo = !this.showDcmInfo
            if(this.showDcmInfo && this.dcmDataAll.length == 0){
                this.modalLoading = true;
                await this.loadDCMInfo();
            }
        },
        loadDCMInfo(){
           return new Promise(resolve => {
               setTimeout(() => {
                    const selectedElements = this.viewerManager.getSelectedElements()
                    const filterList = dcmTagsFilter.filter.join('-');
                    if(selectedElements && selectedElements.length > 0){
                        let firstElement = selectedElements[0]
                        let dataset = firstElement.imageDataSet
                        if(dataset && dataset.elements){
                            for(var i in dataset.elements){
                                let item = dataset.elements[i]
                                if(item && item.tag){
                                    let tagGroup = item.tag.substr(1,4)
                                    let tagElement = item.tag.substr(5,4)
                                    let tagCode = tagGroup + ","+ tagElement
                                    if(filterList.indexOf(tagCode) < 0){
                                        let description = tagsData.filter((data) => {
                                            return data.tag == tagCode
                                        })[0];
                                        this.dcmDataAll.push({
                                            group: tagGroup,
                                            element: tagElement,
                                            tagDescription: description ? description.name : '',
                                            vr: item.vr,
                                            length: item.length,
                                            value: dataset.string(item.tag)
                                        })
                                    }
                                    
                                }
                            }
                        }
                    }
                    this.modalLoading = false;
               }, 10);
           }) 
        }
    }
}
</script>






