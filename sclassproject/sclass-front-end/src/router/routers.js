import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/student_archive',
    name: 'student_archive',
    meta: {
      icon: 'md-menu',
      title: '学生档案',
      access:['student']
    },
    component: Main,
    children: [
      {
        path: 'new_archive',
        name: 'new_archive',
        meta: {
          icon: 'md-funnel',
          title: '新建档案'
        },
        component: () => import('@/view/student/new-archives/new_archives_wrapper.vue')
      },
      {
        path: 'prereview_archive',
        name: 'prereview_archive',
        meta: {
          icon: 'md-funnel',
          // showAlways: true,
          title: '查看待审核档案'
        },
        component: () => import('@/view/student/prereview-archives/prereview_archives.vue'),
      },
      {
        path: 'persisted_archive',
        name: 'persisted_archive',
        meta: {
          icon: 'md-funnel',
          title: '查看已审核档案'
        },
        component: () => import('@/view/student/persisted-archives/persisted_archives.vue')
      }
    ]
  },
  // {
  //   path: '/admin_manage',
  //   name: 'admin_manage',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '管理员',
  //     // access:['student']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'dynamic_form_gen',
  //       name: 'dynamic_form_gen',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '动态表单生成'
  //       },
  //       component: () => import('@/view/admin/dynamic_form_gen/dynamic_form_gen.vue')
  //     },
  //     {
  //       path: 'role_manage',
  //       name: 'role_manage',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '权限管理'
  //       },
  //       component: () => import('@/view/admin/role_manage/role_manage.vue')
  //     }
  //   ]
  // },
  {
    path: '/reviewer_operation',
    name: 'reviewer_operation',
    meta: {
      icon: 'md-menu',
      title: '审核员',
      access:['reviewer']
    },
    component: Main,
    children: [
      {
        path: 'review_archive',
        name: 'review_archive',
        meta: {
          icon: 'md-funnel',
          title: '审核档案'
        },
        component: () => import('@/view/reviewer/review_archives.vue')
      },
      {
        path: 'reviewed_archive',
        name: 'reviewed_archive',
        meta: {
          // access: ['super_admin'],
          icon: 'md-funnel',
          title: '查看已审核档案'
        },
        component: () => import('@/view/reviewer/reviewed_archives.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
