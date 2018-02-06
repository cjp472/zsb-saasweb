import qs from 'qs';

/*获取机构图片*/
export async function queryCurrentOrgLogo(params) {
    return requestData(`${BASE_URL}/organController/getTenant`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取机构图片*/
export async function queryApplicationList(params) {
    return requestData(`${BASE_URL}/appService/queryAppInfo`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
