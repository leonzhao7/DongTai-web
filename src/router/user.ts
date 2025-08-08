import { RouteConfig } from "vue-router";

export const userRoutes: Array<RouteConfig> = [
  {
    path: '/userCenter',
    name: 'userCenter',
    meta: {
      isMenu: true,
      i18n: 'menu.userCenter',
      name: 'userCenter'
    },
    component: () => import('@/views/user/Index.vue'),
    children: [
      {
        path: 'manage',
        component: () => import('@/views/user/UserManage.vue')
      },
      {
        path: 'tenant',
        component: () => import('@/views/user/UserTenant.vue')
      },
      {
        path: 'department',
        component: () => import('@/views/user/UserDepartment.vue')
      },
      {
        path: 'empty',
        component: () => import('@/views/user/UserEmpty.vue')
      },
    ]
  }
]