// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局注册 Element-UI，可配置默认语言/尺寸等
Vue.use(ElementUI, {
  size: 'medium', // 全局组件默认尺寸（small/medium/large）
  zIndex: 3000 // 弹框组件默认 z-index
});
Vue.config.productionTip = false
import $ from 'jquery'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
