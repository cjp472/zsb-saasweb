import qs from 'qs';

/*获取提醒课时数*/
export async function GetCourseNum(params) {
    return requestData(`${BASE_URL}/confController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*点击保存*/
export async function SaveCourseLeastNum(params) {
    return requestData(`${BASE_URL}/confController/save`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
