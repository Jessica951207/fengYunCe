import request from '@/utils/request'


// 产品列表
export function getProducts() {
    return request({
        url: '/re/product',
        method: 'get',
    })
}

//  机构列表
export function getInstitutions() {
    return request({
        url: '/re/institution',
        method: 'get',
    })
}

//  处理规则组列表
export function getRuleGroups(params) {
    return request({
        url: '/re/ruleGroup/map',
        method: 'get',
    })
}

//  处理决策变量列表
export function getDecisionParams(params) {
    return request({
        url: '/re/msgType/map',
        method: 'get',
    })
}
//  获取决策流列表
export function getDecisionFlow(params) {
    return request({
        url: '/re/decision/page',
        method: 'post',
        data: params
    })
}

//删除决策流
export function delDecisionFlow(params) {
    return request({
        url: '/re/decision/page',
        method: 'post',
        data: params
    })
}

//保存决策流
export function saveDecisionFlow(params) {
    return request({
        url: 're/decision',
        method: 'post',
        data: params
    })
}

//获取决策流详情
export function getDecisionInfo(params) {
    return request({
        url: 're/decision',
        method: 'get',
        param: params
    })
}

//获取决策树
export function getDecisionTree(params) {
    return request({
        url: 're/decision/tree',
        method: 'get',
    })
}

//获取决策树
export function getInterface(params) {
    return request({
        url: 're/interfaceInfo',
        method: 'get',
    })
}

//保存决策树
export function saveDecisionTree(params) {
    return request({
        url: 're/interfaceInfo',
        method: 'post',
        data:params
    })
}

//从数据库根据fcID查找变量信息
export function queryVarWithFcId(params) {
    return request({
        url: 're/',
        method: 'get',
        param:params
    })
}

//获取决策树的信息
export function getDecisonInfo() {
    return request({
        url: '../../flare.json',
        method: 'get',
    })
}



