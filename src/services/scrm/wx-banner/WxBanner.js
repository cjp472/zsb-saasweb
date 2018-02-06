import qs from 'qs';

//得到活动列表
export async function GetBannerList(params) {
    return requestData(`${BASE_URL}/orgConfigController/queryBanner`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//modal课程外链下拉列表
export async function GetCourseSelectContent(params) {
    return requestData(`${BASE_URL}/orgCourseController/queryCourse`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//modal活动外链下拉列表
export async function GetActivitySelectContent(params) {
    return requestData(`${BASE_URL}/micNetActivityController/getActivityList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//banner改变状态(显示，隐藏，删除)
export async function ChangeWxBannerStatus(params) {
    return requestData(`${BASE_URL}/orgConfigController/changeBanner`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//刚进入新增表单和表单选择校区onChange事件发生时查看当前校区banner数量有没有到限制数(5个)
export async function CheckOrgBannersNum(params) {
    return requestData(`${BASE_URL}/orgConfigController/queryOrgNumBanner`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//新增编辑banner
export async function AddOrEditBanner(params) {
    return requestData(`${BASE_URL}/orgConfigController/createBanner`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
