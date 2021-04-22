import request from '@/utils/request'


// 加载列表
export function getTable(params) {
    return request({
        method: 'get',
        url: '/re/role/page',
        params: params
    })
}

// 角色新增
export function roleAdd(params) {
    return request({
        url: 're/role/save',
        method: 'post',
        data: params
    })
}

// 菜单权限列表
export function roleAddMenuList(params) {
    return request({
        url: 're/menu/allDept',
        method: 'get',
    })
}

// 角色修改
export function roleModify(params) {
    return request({
        url: 're/role/update',
        method: 'post',
        data: params
    })
}
// 获取角色信息
export function getRoleInfo(params) {
    return request({
        url: `re/role/roleInfo/${params}`,
        method: 'get',
    })
}

// 角色删除
export function roleDelete(params) {
    return request({
        url: 're/role/delete',
        method: 'post',
        params: params
    })
}
