import qs from 'qs';

/*获取列表数据*/
export async function ShowOrgManageTable(params) {
    return requestData(`${BASE_URL}/organController/list`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*修改机构状态(删除，停用，启用)*/
export async function UpdateOrganStatus(params) {
    return requestData(`${BASE_URL}/organController/updateOrganStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*表格点击新增校区获取表单中复选框的选项*/
export async function OpenAddOrgModalGetCheckBox(params) {
    return requestData(`${BASE_URL}/organController/getOrganDict`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*点击编辑获取校区回填数据*/
export async function GetOrgDetail(params) {
    return requestData(`${BASE_URL}/organController/getOrgan`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增编辑校区提交*/
export async function AddNewOrg(params) {
    return requestData(`${BASE_URL}/organController/addOrgan`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*编辑校区提交*/
export async function EditExistOrg(params) {
    return requestData(`${BASE_URL}/organController/updateOrgan`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*更改校区logo*/
export async function saveOrgImg(params) {
    return requestData(`${BASE_URL}/organController/saveTenantImg`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

