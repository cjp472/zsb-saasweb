import qs from 'qs';

/*查看微模板的模板配置*/
export async function moduleFormDetail(params) {
    return requestData(`${BASE_URL}/microActivity/moduleDetail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*查看微模板的模板配置*/
export async function moduleFormSubmit(params) {
    return requestData(`${BASE_URL}/microActivity/saveTenantMicroActivity`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
