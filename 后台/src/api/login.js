import { axios } from '@/utils/request'
//正式环境
//const baseUrl = 'http://haier-cms-prod.qd-aliyun.haier.net'
// //测试环境
const baseUrl = 'http://cms-main2.qd-aliyun.haier.net'
// const baseUrl = 'http://192.168.101.85'
// const baseUrl = 'http://192.168.43.195'
// const baseUrl = 'http://192.168.101.46'
// const baseUrl = 'http://10.189.34.32'
/**
 * @param parameter
 * @returns {*}
*/

export function login(parameter) {
  return axios({
    url: baseUrl+'/cms/user/login',
    method: 'post',
    data: parameter
  })
}

export function logout(logoutToken) {
  return axios({
    url: baseUrl+'/sys/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'authorization':  logoutToken
    }
  })
}