import qs from 'qs';

//是否有安全手机号
export async function checkPhoneNum(params) {
    return requestData(`${BASE_URL}/SecurtySettingsController/get/tel`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取验证码
export async function getVerificationCode(params) {
    return requestData(`${BASE_URL}/smsVerifyController/genVerifyCode`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//改绑
export async function getNetStep(params) {
    return requestData(`${BASE_URL}/SecurtySettingsController/set/tel`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
