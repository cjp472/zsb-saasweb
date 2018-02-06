import qs from 'qs';

/*获取当前租户申请状态*/
export async function GetApplyStatus(params) {
    return requestData(`${BASE_URL}/tenantHost/queryStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*第一步申请使用点击提交*/
export async function FirstStepApplyForSubmit(params) {
    return requestData(`${BASE_URL}/tenantHost/applyHost`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*第四步保存设置事件*/
export async function ForthStepSetSubmit(params) {
    return requestData(`${BASE_URL}/tenantHost/loginPageSet`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
