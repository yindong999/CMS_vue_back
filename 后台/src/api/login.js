import { axios } from '@/utils/request'
//正式环境
// const baseUrl = 'http://haier-cms-prod.qd-aliyun.haier.net'
// const baseUrl = 'http://nryx.haier.net' //新域名
// //测试环境
const baseUrl = 'http://cms-main3.qd-aliyun.haier.net'
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