import qs from 'qs';

//获取
export async function GetLeadRecordRule(params) {
    return requestData(`${BASE_URL}/confController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}



//保存设置选项
export async function SaveLeadRecordRule(params) {
    return requestData(`${BASE_URL}/confController/save`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
