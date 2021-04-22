/**
 * 权限： 数字->文字
 * */
let perValue = []
let permission = {
    "1":"客户经理",
    "2":"内控",
    "3":"我司审批",
    "4":"银行审批",
    "5":"面签",
    "6":"放款"
}
export function changePermissionToText(arr) {
    perValue = [];
    arr.map(cur => {
        perValue.push(permission[cur])
    })

    return perValue.toString()
}

/**
 *权限： 文字->数字
 */


let perNum = []
let permissionNum = {
    "客户经理":"1",
    "内控":"2",
    "我司审批":"3",
    "银行审批":"4",
    "面签":"5",
    "放款":"6"
}
export function changePermissionToNum(arr) {
    perNum = [];
    arr.map(cur => {
        perNum.push(permissionNum[cur])
    })

    return perNum
}


/**
 * 关系：value -> 文字
 * */
