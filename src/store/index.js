import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // 当前用户登录状态，token...
    user: getItem(USER_KEY),
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，要把数据放到本地存储中，持久化数据
      setItem(USER_KEY, state.user)
    },
    addCachePages (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    removeCachePages (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
