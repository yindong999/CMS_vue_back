import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { ACCESS_TOKEN,MENU_DATA } from '@/store/mutation-types'
import { generateIndexRouter } from "@/utils/util"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result','/user/alteration'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (store.getters.permissionList.length === 0 && to.path != '/user/login'){
      let menuData = Vue.ls.get(MENU_DATA)
      store.dispatch('SetPermissionList',menuData);
      let constRoutes = [];
      constRoutes = generateIndexRouter(menuData);
      // 添加主界面路由
      store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
        // 根据roles权限生成可访问的路由表
        // 动态添加可访问路由表
        router.addRoutes(store.getters.addRouters)
      })
    }
    NProgress.done()
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
      NProgress.done()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
