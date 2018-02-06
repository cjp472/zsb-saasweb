import qs from 'qs';

//获取活动列表
export async function getActivity(params) {

    return requestData(`${BASE_URL}/zsb/market/queryList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取域名
export async function getDataInit(params) {

    return requestData(`${BASE_URL}/zsb/market/dataInit`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


//删除单条活动
export async function delectActivityItem(params) {

    return requestData(`${BASE_URL}/zsb/market/updateStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//删除单条活动
export async function batchDelect(params) {

    return requestData(`${BASE_URL}/zsb/market/batch/updateStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}


//表单候选项
export async function defaultFormConfig(params) {

    return requestData(`${BASE_URL}/zsb/market/defaultFormConfig`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取地点列表
export async function getdictkey(params) {

    return requestData(`${BASE_URL}/dictController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取员工列表
export async function summaryQuery(params) {

    return requestData(`${BASE_URL}/tenantUserController/summaryQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//创建活动
export async function createOrUpdate(params) {

    return requestData(`${BASE_URL}/zsb/market/createOrUpdate`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//查询单个活动
export async function queryDetail(params) {

    return requestData(`${BASE_URL}/zsb/market/queryDetail`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//报表头部数据
export async function overviewDataQuery(params) {

    return requestData(`${BASE_URL}/zsb/market/overviewDataQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//报表活动访问量数据
export async function viewDataByDaysQuery(params) {

    return requestData(`${BASE_URL}/zsb/market/viewDataByDaysQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//报表活动有效用户数据 (按天)
export async function countDataByDaysQuery(params) {

    return requestData(`${BASE_URL}/zsb/market/countDataByDaysQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//报表活动有效用户数据 (按照釆单员维度)
export async function countDataByDaysOnMemberQuery(params) {

    return requestData(`${BASE_URL}/zsb/market/countDataByDaysOnMemberQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//报表活动有效用户数据 (按照釆单员维度)
export async function getFormDataQuery(params) {

    return requestData(`${BASE_URL}/zsb/market/formDataQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取二维码数据
export async function getQrLink(params) {

    return requestData(`${BASE_URL}/zsb/market/queryMembers`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//导出用户数据excel
export async function exportUserFormData(params) {

    return requestData(`${BASE_URL}/zsb/market/exportFormData`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}













