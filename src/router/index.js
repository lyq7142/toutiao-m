import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'), // 懒加载
    meta: { requiredAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '', // 默认子路由，只有一个
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiredAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiredAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiredAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiredAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiredAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的props，方便访问维护
    props: true,
    meta: { requiredAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile/'),
    meta: { requiredAuth: false }
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat/'),
    meta: { requiredAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    if (store.state.user) {
      return next()
    }
    // 未登录 提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，是否确认登录'
    })
      .then(() => {
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        next(false)
      })
  } else {
    next()
  }
})

export default router
