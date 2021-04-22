import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { staticRoutes } from '@/router/routes'
import { getSession, clearSession } from '@/utils/storage'
import { adminUser, ordinaryUser } from '@/utils/routesAsync'

// 解决 `element ui` 导航栏重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

// 加载静态路由
const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRoutes
})
const router = createRouter()


// 路由加载前
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'vue-admin-wonderful'
  NProgress.configure({ showSpinner: false })
  NProgress.start()
  keepAliveSplice(to)
  let token = getSession('token');
  console.log("token===",token)
  if (to.fullPath === '/login' && !token) {
    next()
    nProgressDone()
  } else {
    if (!token) {
      next('/login')
      clearSession()
      nProgressDone()
    } else if (token && to.fullPath === '/login') {
      next('/home')
      nProgressDone()
    } else {
      // 动态加载后端返回路由路由(模拟数据)
      if (!getSession('userInfo')) return false
      if (Object.keys(store.state.menuData).length <= 0) {
        // if (getSession('userInfo').userName === 'zlhjadmin'){
            adminUser(router, to, next)
        // }
        // else if (getSession('userInfo').userName === 'test') ordinaryUser(router, to, next)
      } else {
        next()
      }
    }
  }
})

// 路由加载后
router.afterEach(() => {
  nProgressDone()
})

// 递归处理多余的 layout : <router-view>，让需要访问的组件保持在第一层 layout 层。
// 因为 `keep-alive` 只能缓存二级路由
// 默认初始化时就执行
export function keepAliveSplice(to) {
  if (to.matched && to.matched.length > 2) {
    to.matched.map((v, k) => {
      if (v.components.default instanceof Function) {
        v.components.default().then(components => {
          if (components.default.name === 'publics') {
            to.matched.splice(k, 1)
            router.push({ path: to.path, query: to.query })
            keepAliveSplice(to)
          }
        })
      } else {
        if (v.components.default.name === 'publics') {
          to.matched.splice(k, 1)
          keepAliveSplice(to)
        }
      }
    })
  }
}

// NProgress 加载完毕
export function nProgressDone() {
  NProgress.configure({ showSpinner: false })
  NProgress.done()
}

// 重置路由
export function resetRouter() {
  router.matcher = createRouter().matcher
}

// 导出路由
export default router
