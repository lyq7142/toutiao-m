// 请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
// 非组件模块中获取store必须通过这种方式 单独加载store
import store from '@/store/'
import router from '@/router/'

const refreshTokenReq = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})
const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao.itheima.net/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  // 如果用户已登录，统一设置token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后，一定要把config返回，否则请求停在这
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status
  if (status === 400) {
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token无效
    // 如果没有user或user.token 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      return redirectLogin()
    }
    // 如果有refresh_token 则请求新token，更新到容器，把失败的请求重新发出去
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      user.token = data.data.token
      store.commit('setUser', user)
      return request(error.config)
    } catch (err) {
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    Toast.fail('服务端异常')
  }
  return Promise.reject(error)
})
function redirectLogin () {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
