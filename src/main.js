import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from "./router/index.js"

// 生产模式用于关闭部分开发模式警告
// Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
