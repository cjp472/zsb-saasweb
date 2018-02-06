import qs from 'qs';

/*获取列表数据*/
export async function GetTenantPic(params) {
    return requestData(`${BASE_URL}/organController/getTenant`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*保存图片*/
export async function SaveOrgPic(params) {
    return requestData(`${BASE_URL}/organController/saveTenantImg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
