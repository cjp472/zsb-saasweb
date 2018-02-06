import qs from 'qs';

/*请求左边角色总览列表数据*/
export async function searchAllRoleList(params) {
    return requestData(`${BASE_URL}/tenantRoleController/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*请求右边所有功能列表数据*/
export async function searchAllFunction(params) {
    return requestData(`${BASE_URL}/tenantRoleController/getResourceTree`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表重命名角色*/
export async function RenameRole(params) {
    return requestData(`${BASE_URL}/tenantRoleController/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表复制角色*/
export async function CopyRole(params) {
    return requestData(`${BASE_URL}/tenantRoleController/copy`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表删除角色*/
export async function DeleteRole(params) {
    return requestData(`${BASE_URL}/tenantRoleController/delete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*左边角色列表新增角色*/
export async function CreateRole(params) {
    return requestData(`${BASE_URL}/tenantRoleController/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*权限保存*/
export async function SaveRoleFunction(params) {
    return requestData(`${BASE_URL}/tenantRoleController/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

