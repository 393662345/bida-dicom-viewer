import Vue from 'vue'
import AppManager from './appManager.js'
export default new Vue({
    data: {
        seriesBox: [],
        seriesConfig: {
            initSeries: true,
            oneToMoreSeries: false,
            seriesDefaultRow: 2,
            seriesDefaultCol: 2
        },
        seriesBoxParams: {
            images: [],
            series: {
                row: null,
                col: null
            },
            seriesActive: -1,
            imagesActive: -1,
        },
        appManager: new AppManager('viewerAppManager'),
        studyStacks: [],
        studyMocks: [],
        studyInfo: null,
    }
});