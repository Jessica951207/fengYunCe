import request from '@/utils/request'


// 所属机构查询
export function queryOrganization() {
    return request({
        method: 'get',
        url: '/re/institution',
    })
}

// 查询规则组类型
export function queryRuleGroupType() {
    return request({
        url: 're/ruleGroup/type',
        method: 'get',
    })
}

// 规则组内容查询
export function ruleGroupContent(params) {
    return request({
        url: 're/ruleGroup/setrulesall',
        method: 'get',
        params: params
    })
}

// 删除规则组
export function ruleGroupDelete(params) {
    return request({
        url: 're/ruleGroup/deleterulegroup',
        method: 'get',
        params: params
    })
}

// 新增规则组
export function ruleGroupAdd(params) {
    return request({
        url: 're/ruleGroup/save',
        method: 'post',
        data: params
    })
}

// loadFieldCodeSelectByTableName
export function loadField(params) {
    return request({
        url: 're/score/loadFieldCodeSelectByTableName',
        method: 'get',
        params: params
    })
}

// msgtype表查询
export function queryMsgtype() {
    return request({
        url: 're/msgType',
        method: 'get',
    })
}
// msgtype父节点表查询
export function queryMsgtypeParent() {
    return request({
        url: 're/msgType/primary',
        method: 'get',
    })
}
// 符号参数
export function querySymbol() {
    return request({
        url: 're/ruleGroup/getAllTypeFromBaseCodeByBc_Type',
        method: 'get',
    })
}

// form表单 + 提示语信息查询
export function remarkInfoQuery(params) {
    return request({
        url: 're/ruleGroup/looksetrulesupdatedata',
        method: 'get',
        params: params
    })
}

// 规则信息查询
export function ruleGroupIdQuery(params) {
    return request({
        url: 're/ruleGroup/getRulesByRGId',
        method: 'get',
        params: params
    })
}

// 保存所有提示，规则
export function saveInfo(params) {
    return request({
        url: 're/ruleGroup/updatedata',
        method: 'post',
        data: params
    })
}