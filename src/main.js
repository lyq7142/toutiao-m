import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载vant核心组件库+全局样式
import Vant from 'vant'
import 'vant/lib/index.css'
// 加载动态设置rem基准值
import 'amfe-flexible'
// 加载全局样式，写在vant样式后面可以覆盖
import '@/styles/index.less'

// 注册使用vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
