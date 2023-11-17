import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vantConfig from './untils/vant-config'
import elementConfig from './untils/element-config'

Vue.config.productionTip = false

Vue.use(vantConfig)
Vue.use(elementConfig)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
