import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // 当前用户登录状态，token...
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，要把数据放到本地存储中，持久化数据
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
