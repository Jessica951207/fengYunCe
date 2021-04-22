import request from '@/utils/request'


// 用户登录
export function login(params) {
    return request({
        method: 'post',
        url: '/re/user/login',
        data: params
    })
}

// 用户退出登录
export function signOut(params) {
    return request({
        url: 're/user/login/exit',
        method: 'delete',
        data: params
    })
}