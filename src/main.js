import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { post, get, patch, put } from './apis/http'
import 'amfe-flexible'
let VueTouch = require('vue-touch')

import vantConfig from './untils/vant-config'
import elementConfig from './untils/element-config'

Vue.config.productionTip = false
Vue.use(VueTouch, { name: 'v-touch' })

Vue.use(vantConfig)
Vue.use(elementConfig)

//定义全局变量
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$patch = patch
Vue.prototype.$put = put

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
