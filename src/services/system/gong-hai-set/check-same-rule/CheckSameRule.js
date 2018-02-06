import qs from 'qs';

//获取学员查重规则
export async function GetStusCheckSameRule(params) {
    return requestData(`${BASE_URL}/confController/stuDupCheckInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取名单查重规则
export async function GetLeadsCheckSameRule(params) {
    return requestData(`${BASE_URL}/confController/clueDupCheckInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//提交保存
export async function Submit(params) {
    return requestData(`${BASE_URL}/confController/saveDupCheckInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
