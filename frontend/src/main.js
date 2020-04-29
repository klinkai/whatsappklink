import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import apiConfig from './apiConfig'
import axios from "axios"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import JsonViewer from 'vue-json-viewer'



const axiosInstance = axios.create({
  baseURL: apiConfig.baseUrl
});

Object.defineProperty(Vue.prototype, "$axios", { value: axiosInstance })
Object.defineProperty(Vue.prototype, "$apiConfig", { value: apiConfig })

Vue.config.productionTip = false


// Install BootstrapVue
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
