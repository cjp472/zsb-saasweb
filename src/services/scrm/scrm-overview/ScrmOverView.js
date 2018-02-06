import qs from 'qs';

/*获取banner图*/
export async function GetBanner(params) {
    return requestData(`${BASE_URL}/marketingHome/bannerList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取统计报表数据*/
export async function GetReportData(params) {
    return requestData(`${BASE_URL}/marketingHome/newTemplateApplyNum`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*热门招生方案*/
export async function GetHotMethod(params) {
    return requestData(`${BASE_URL}/marketingHome/hotRecruitStuSchemaList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*免费申请试用招生方案*/
export async function GetFreeTrailMethod(params) {
    return requestData(`${BASE_URL}/marketingHome/freeApplyRecruSchema`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


/*机构使用案例*/
export async function GetOrgUseing(params) {
    return requestData(`${BASE_URL}/marketingHome/sucCaseList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取营销资讯*/
export async function GetScrmMessage(params) {
    return requestData(`${BASE_URL}/marketingHome/marketingInfoList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
