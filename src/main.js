import Vue from 'vue'
// import 'es6-promise/auto'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from "./router/index.js"
import store from "./store/store.js"
import axios from 'axios'
import { HTTP_STATUS_ERROR_CODE } from './axios/common.js'

// 生产模式用于关闭部分开发模式警告
Vue.config.productionTip = false

Vue.use(ElementUI);

function clearStates(data) {
  // 未登录 清除已登录状态
  store.state.Authorization = ""; // token
  store.state.UserName = "";
  store.state.Permission = "";
  store.state.UserID = "";
  console.log("clear states")
  localStorage.removeItem('Authorization')
  localStorage.removeItem('UserName')
  localStorage.removeItem('Permission')
  localStorage.removeItem('UserID')
  if (router.history.current.name !== 'login') {
      if (data.msg !== null) {
          Message.error(data.msg)
      } else {
          Message.error("未知错误，请重新登录")
      }
      router.push('/login')
  }
}

// 超时设定
axios.defaults.timeout = 15000
// 后端根接口
// `baseURL` will be prepended to `url` unless `url` is absolute.
// It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
// to methods of that instance.
axios.defaults.baseURL = "/unilab/api"

// 发送拦截器
// 发送请求时带header中的token
axios.interceptors.request.use(config => {
  console.log(config);
  if (localStorage.getItem("Authorization")) {
      config.headers.Authorization = localStorage.getItem("Authorization");
  }
  return config;
}, err => {
  Message.error('请求超时')
  return Promise.reject(err)
})

// 接收拦截器
// 接收请求时如果权限出错要求重新登录
axios.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // 这里的return response返回的是一个对象, 内容如下:
  // {
  //      data: { },        // 服务器提供的响应
  //      status: 200,      // 服务器响应的HTTP状态代码
  //      statusText: 'OK', // 服务器响应的HTTP状态消息
  //      headers: {},      // 服务器响应头
  //      config: {}        // axios 的配置
  // }
  console.log("in response interceptors", response)
  return response
}, (err) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // 返回状态码不为200时候的错误处理
  console.log("error", err.response)
  switch (err.response.status) {
      case HTTP_STATUS_ERROR_CODE.UNAUTHORIZED:
          clearStates(err.response.data)
          Message.error("UNAUTHORIZED: 请重新登录")
          break
      case HTTP_STATUS_ERROR_CODE.FORBIDDEN:
          Message.error("FORBIDDEN: 没有权限")
          break
      default:
          Message.error(err.toString())
          break
  }
  return Promise.resolve(err)
})

Date.prototype.format = function(fmt) { 
  var o = { 
     "M+" : this.getMonth()+1,                 //月份 
     "d+" : this.getDate(),                    //日 
     "h+" : this.getHours(),                   //小时 
     "m+" : this.getMinutes(),                 //分 
     "s+" : this.getSeconds(),                 //秒 
     "q+" : Math.floor((this.getMonth()+3)/3), //季度 
     "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
}

new Vue({
  router: router,
  store: store,
  render: h => h(App),
}).$mount('#app')
