import Vue from 'vue'
import Router from 'vue-router'

import Viewer from '@/views/viewer'
import Bridger from '@/views/bridger'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'viewer',
      component: Viewer
    },
    {
      path: '/bridger',
      name: 'bridger',
      component: Bridger
    }
  ]
})
