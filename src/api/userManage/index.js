import request from '@/utils/request'


// 用户查询
export function getUserTable(params) {
    return request({
        method: 'get',
        url: '/re/user/page',
        params: params
    })
}

//  用户新增
export function userAdd(params) {
    return request({
        url: 're/user/register',
        method: 'post',
        data: params
    })
}

// 拥有角色
export function userOwnRole(params) {
    return request({
        url: 're/role/list',
        method: 'get',
    })
}

// 获取用户信息
export function getUserInfo(params) {
    return request({
        url: `re/user/info/${params}`,
        method: 'get',
    })
}

// 用户修改
export function userModify(params) {
    return request({
        url: 're/user/update',
        method: 'post',
        data: params
    })
}

// 检查用户名
export function checkUserName(params) {
    return request({
        url: 're/user/register/checkUserName',
        method: 'post',
        data: params
    })
}

// 重置密码
export function resetPsw(params) {
    return request({
        url: 're/user/login/forget/password',
        method: 'post',
        data: params
    })
}

// 用户删除
export function userDelete(params) {
    return request({
        url: 're/user/delete',
        method: 'delete',
        params: params
    })
}
// 角色权限显示
export function roleAuth(params) {
    return request({
        url: 're/user/delete',
        method: 'post',
        data: params
    })
}
