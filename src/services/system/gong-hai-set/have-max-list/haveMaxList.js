import qs from 'qs';

//获取最大拥有名单数
export async function getMaxList(params) {
    return requestData(`${BASE_URL}/confController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
//修改最大拥有名单数
export async function SaveMaxList(params) {
    return requestData(`${BASE_URL}/confController/save`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
