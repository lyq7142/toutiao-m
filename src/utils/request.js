// 请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
// 非组件模块中获取store必须通过这种方式 单独加载store
import store from '@/store/index'
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

export default request
