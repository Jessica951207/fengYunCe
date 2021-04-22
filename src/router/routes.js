// 定义静态路由，动态路由(后端接口返回)及处理在 `utils/routesFilter.js` 中

export const staticRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/error',
    component: () => import('@/views/layout/errors'),
    meta: {
      title: 'error',
    },
    redirect: '/404',
    children: [
      {
        path: '/404',
        component: () => import('@/views/error/404'),
        meta: {
          title: '404',
        },
      },
      {
        path: '/401',
        component: () => import('@/views/error/401'),
        meta: {
          title: '401',
        },
      },
    ],
  },
  {
    path: '/big-data',
    component: () => import('@/views/demo/bigData/index.vue')
  }
]
