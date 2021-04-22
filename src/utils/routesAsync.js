import store from '@/store'
import { getMenuAdmin, getMenuOrdinary } from '@/api/menu'
import { resetRouter } from '@/router'
import { getSession } from "./storage";

// 处理后端返回的 `component` 路径，拼装实现懒加载
export function loadView(path) {
    return () => import(`@/views/${path}`);
}

// 递归处理每一项 `component` 中的路径
export function dynamicRouter(view) {
    if (view.component) view.component = loadView(view.component)
    if (view.children) view.children.map(item => dynamicRouter(item))
    return view
}

// 添加动态路由，`{ path: '*', redirect: '/404' }` 防止页面刷新，静态路由丢失问题
// next({ ...to, replace: true }) 动态路由 addRoutes 完毕后才放行，防止刷新时 NProgress 进度条加载2次
// store.commit('setPrimeMenuData', JSON.parse(JSON.stringify(res))) 设置不处理 `component` 路径的原始值，用于菜单管理中显示(页面路径：用户/菜单管理)
export function adminUser(router, to, next) {
    let userName = Object.assign({"userName":getSession('userInfo').username});
    console.log("userName********",userName);
    getMenuAdmin(userName).then(res => {
        store.commit('setPrimeMenuData', JSON.parse(JSON.stringify(res.data)))
        resetRouter()
        store.commit('setMenuData', res.data)
        router.addRoutes([dynamicRouter(res.data), { path: '*', redirect: '/404' }])
        next({ ...to, replace: true })
    }).catch(() => { })
}

//目前不需要下面这个
// 添加动态路由，`{ path: '*', redirect: '/404' }` 防止页面刷新，静态路由丢失问题
export function ordinaryUser(router, to, next) {
    getMenuOrdinary().then(res => {
        store.commit('setPrimeMenuData', JSON.parse(JSON.stringify(res.data)))
        resetRouter()
        store.commit('setMenuData', res.data)
        router.addRoutes([dynamicRouter(res.data), { path: '*', redirect: '/404' }])
        next({ ...to, replace: true })
    }).catch(() => { })
}