import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import apiConfig from './apiConfig'
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: apiConfig.baseUrl
});

Object.defineProperty(Vue.prototype, "$axios", { value: axiosInstance })
Object.defineProperty(Vue.prototype, "$apiConfig", { value: apiConfig })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
