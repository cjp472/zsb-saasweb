import qs from 'qs';

//获取全部口碑门店数据
export async function GetCheckBoxAndChoose(params) {
    return requestData(`${BASE_URL}/confController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//保存设置选项
export async function SaveSmallTicketSet(params) {
    return requestData(`${BASE_URL}/confController/save`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
