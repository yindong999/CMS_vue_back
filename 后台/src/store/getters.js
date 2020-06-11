import Vue from 'vue'
import { USER_INFO,AVATAR,USER_AUTH } from "@/store/mutation-types"
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  addRouters: state => state.permission.addRouters,
  userInfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  username: state => {state.user.username = Vue.ls.get(USER_INFO).userName; return state.user.username},
  avatar: state => {state.user.avatar = Vue.ls.get(AVATAR); return state.user.avatar},
  buttonAuth: state => {state.user.buttonAuth = Vue.ls.get(USER_AUTH); return state.user.buttonAuth},
}

export default getters