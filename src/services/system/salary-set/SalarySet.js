import qs from 'qs';

//搜索栏获取角色下拉列表内容,之后查询列表
export async function GetRoleSelectContent(params) {
    return requestData(`${BASE_URL}/tenantRoleController/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//打开工资设置modal时获取课程下拉列表内容
export async function GetCourseSummary(params) {
    return requestData(`${BASE_URL}/cerpCourse/summaryQuery`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
