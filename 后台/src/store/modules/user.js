import Vue from 'vue'
import { login } from "@/api/login"
import { ACCESS_TOKEN,USER_NAME,USER_INFO,USER_AUTH,SYS_BUTTON_AUTH,MENU_DATA,AVATAR } from "@/store/mutation-types"
import { welcome } from "@/utils/util"

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {},
    buttonAuth: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, welcome }) => {
      state.username = username
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_BUTTON: (state, auth) => {
      state.buttonAuth = auth
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if(response.code =='200'){
            const result = response.data;
            const userInfo = result.loginResult.userInfo;
            const authData = result.permissionResult.hasOwnProperty('btn')?result.permissionResult.btn:{};
            // const allAuthData = result.permissionResult.allAuth.concat();
            // const menuData = [
            //   {
            //     redirect: null,
            //     path: "/dashboard/analysis",
            //     component: "dashboard/Analysis",
            //     route: "1",  //判断是否生成路由 一定要返回
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "首页"
            //     },
            //     name: "dashboard-Analysis",
            //     id: "xxx"   //唯一标识
            //   },
            //   {
            //     redirect: null,
            //     path: "/messageList/Index",
            //     component: "messageList/Index",
            //     route: "1",  //判断是否生成路由 一定要返回
            //     hidden: true,
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "消息列表"
            //     },
            //     name: "messageList-Index",
            //     id: "xxx"   //唯一标识
            //   },
            //   {
            //     redirect: null,
            //     path: "/personCenter/Index",
            //     component: "personCenter/Index",
            //     route: "1",  //判断是否生成路由 一定要返回
            //     hidden: true,
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "个人中心"
            //     },
            //     name: "personCenter-Index",
            //     id: "xxx"   //唯一标识
            //   },
            //   {
            //     redirect: null,
            //     path: "/system",
            //     component: "system/index",
            //     route: "1",
            //     children:[
            //       {
            //         path: "log",
            //         component: "system/log",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "系统日志"
            //         },
            //         name: "system-log",
            //         id: "xxx"
            //       }
            //     ],
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "系统管理"
            //     },
            //     name: "system",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/evaluation",
            //     component: "evaluation/index",
            //     route: "1",
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "评价管理"
            //     },
            //     name: "evaluation",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/content",
            //     component: "content/index",
            //     route: "1",
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "内容管理"
            //     },
            //     name: "content",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/operating",
            //     component: "operating/index",
            //     route: "1",
            //     children:[
            //       {
            //         path: "department",
            //         component: "operating/department",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "部门管理"
            //         },
            //         name: "operating-department",
            //         id: "xxx"
            //       },
            //       {
            //         path: "proprietary",
            //         component: "operating/proprietary",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "自有发布渠道管理"
            //         },
            //         name: "operating-proprietary",
            //         id: "xxx"
            //       },
            //       {
            //         path: "third",
            //         component: "operating/third",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "第三方发布渠道管理"
            //         },
            //         name: "operating-third",
            //         id: "xxx"
            //       }
            //     ],
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "运营管理"
            //     },
            //     name: "operating",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/audit",
            //     component: "audit/index",
            //     route: "1",
            //     children:[
            //       {
            //         path: "content",
            //         component: "audit/content",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "内容审核"
            //         },
            //         name: "audit-content",
            //         id: "xxx"
            //       }
            //     ],
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "审核管理"
            //     },
            //     name: "audit",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/permissions",
            //     component: "permissions/index",
            //     route: "1",
            //     children:[
            //       {
            //         path: "user",
            //         component: "permissions/user",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "用户管理"
            //         },
            //         name: "permissions-user",
            //         id: "xxx"
            //       },
            //       {
            //         path: "role",
            //         component: "permissions/role",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "角色管理"
            //         },
            //         name: "permissions-role",
            //         id: "xxx"
            //       },
            //       {
            //         path: "configuration",
            //         component: "permissions/configuration",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "流程配置"
            //         },
            //         name: "permissions-configuration",
            //         id: "xxx"
            //       }
            //     ],
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "权限管理"
            //     },
            //     name: "permissions",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/label",
            //     component: "label/index",
            //     route: "1",
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "标签管理"
            //     },
            //     name: "label",
            //     id: "xxx"
            //   },
            //   {
            //     redirect: null,
            //     path: "/table",
            //     component: "table/index",
            //     route: "1",
            //     children:[
            //       {
            //         path: "detail",
            //         component: "table/detail",
            //         route: "1",
            //         meta:{
            //           keepAlive: false,
            //           internalOrExternal: false,
            //           title: "报备统计明细"
            //         },
            //         name: "table-detail",
            //         id: "xxx"
            //       },
            //     ],
            //     meta:{
            //       keepAlive: false,
            //       internalOrExternal: false,
            //       icon: "home",
            //       title: "数据报表"
            //     },
            //     name: "table",
            //     id: "xxx"
            //   },
            // ]
            const menuData = result.permissionResult.menu.concat();
            Vue.ls.set(ACCESS_TOKEN, result.loginResult.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_NAME, userInfo.userName, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(AVATAR, 1?require('@/assets/default.png'):'', 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_AUTH,authData);
            Vue.ls.set(MENU_DATA, menuData, 7 * 24 * 60 * 60 * 1000)
            // sessionStorage.setItem(USER_AUTH,JSON.stringify(authData));
            // sessionStorage.setItem(SYS_BUTTON_AUTH,JSON.stringify(allAuthData));
            commit('SET_TOKEN', result.loginResult.token)
            commit('SET_INFO', userInfo)
            commit('SET_NAME', { username: userInfo.userName, welcome: welcome() })
            commit('SET_AVATAR', 1?require('@/assets/default.png'):'')
            commit('SET_BUTTON', authData)
            if (menuData && menuData.length > 0) {
              commit('SET_PERMISSIONLIST', menuData)
            } else {
              reject({message:'您没有该系统的任何权限，请联系管理员设置'})
            }
            resolve(response)
          }else{
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        commit('SET_BUTTON', {})
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(MENU_DATA)
        Vue.ls.remove(USER_AUTH)
        resolve();
      })
    },
    //设置路由列表
    SetPermissionList({ commit },data) {
      commit('SET_PERMISSIONLIST', data)
    },
  }
}

export default user