import {
  axios
} from '@/utils/request'
//正式环境
// const baseUrl = 'http://haier-cms-prod.qd-aliyun.haier.net'
// const baseUrl = 'http://nryx.haier.net' //新域名
//测试环境
const baseUrl = 'http://cms-main3.qd-aliyun.haier.net'

const api = {
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager'
}
export default api

//post
export function postAction(url, parameter) {
  return axios({
    url: baseUrl + url,
    method: 'post',
    data: parameter
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method) {
  return axios({
    url: baseUrl + url,
    method: method,
    data: parameter
  })
}

//put
export function putAction(url, parameter) {
  return axios({
    url: baseUrl + url,
    method: 'put',
    data: parameter
  })
}

//get
export function getAction(url, parameter) {
  return axios({
    url: baseUrl + url,
    method: 'get',
    params: parameter
  })
}

//deleteAction
export function deleteAction(url, parameter) {
  return axios({
    url: baseUrl + url,
    method: 'delete',
    params: parameter
  })
}

export function getUserList(parameter) {
  return axios({
    url: baseUrl + api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: baseUrl + api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return axios({
    url: baseUrl + api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: baseUrl + api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: baseUrl + api.service,
    method: parameter.id == 0 ? 'post' : 'put',
    data: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {
  return axios({
    url: baseUrl + url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

export {baseUrl}