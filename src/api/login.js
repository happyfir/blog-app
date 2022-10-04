import request from '@/request'

export function login(account, password) {
  const data = {
    account,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    headers: {'Authorization': token},
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    headers: {'Authorization': token},
    url: '/users/currentUser',
    method: 'get'
  })
}

export function register(account, nickname, password) {
  const data = {
    account,
    nickname,
    password
  }
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
//修改密码
export function change(account, nickname, password,oldPassword) {
  const data = {
    account,
    nickname,
    password,
    oldPassword
  }
  return request({
    url: '/users/changePassword',
    method: 'post',
    data
  })
}
//修改用户信息
export function changeUserInfo(account, nickname, token) {
  const data = {
    account,
    nickname,
  }
  return request({
    headers: {'Authorization': token},
    url: '/users/changeUserInfo',
    method: 'post',
    data
  })
}
