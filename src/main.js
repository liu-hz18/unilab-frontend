import Vue from 'vue'
import App from './App.vue'
import 'es6-promise/auto'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from "./router/index.js"
import store from "./store/store.js"

// 生产模式用于关闭部分开发模式警告
// Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router: router,
  store: store,
  render: h => h(App),
}).$mount('#app')
