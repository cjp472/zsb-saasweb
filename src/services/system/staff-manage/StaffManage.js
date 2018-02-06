import qs from 'qs';

/*请求左边组织架构列表数据*/
export async function SearchAllOrganList(params) {
    return requestData(`${BASE_URL}/depatService/formatList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增部门*/
export async function AddSector(params) {
    return requestData(`${BASE_URL}/depatService/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*编辑部门*/
export async function EditSector(params) {
    return requestData(`${BASE_URL}/depatService/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*删除部门*/
export async function DeleteSector(params) {
    return requestData(`${BASE_URL}/depatService/delete`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*员工列表展示*/
export async function ShowStaffTable(params) {
    return requestData(`${BASE_URL}/tenantUserController/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*获取搜索栏角色下拉列表数据*/
export async function GetRoleSelect(params) {
    return requestData(`${BASE_URL}/tenantRoleController/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*员工列表点击编辑获取详情*/
export async function GetStaffDetail(params) {
    return requestData(`${BASE_URL}/tenantUserController/detailById`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*点击编辑后查询当前机构下的汇报对象下拉列表内容*/
export async function GetLeaderSelect(params) {
    return requestData(`${BASE_URL}/tenantUserController/chiefUsers`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增员工表单提交*/
export async function CreateStaff(params) {
    return requestData(`${BASE_URL}/tenantUserController/create`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*新增表单提交*/
export async function UpdateStaff(params) {
    return requestData(`${BASE_URL}/tenantUserController/update`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*停用或删除员工*/
export async function EnableOrFireOrDeleteStaff(params) {
    return requestData(`${BASE_URL}/tenantUserController/deleteOrFired`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*修改员工职能提交*/
export async function ChangeStaffFunc(params) {
    return requestData(`${BASE_URL}/tenantUserController/modifyFunctions`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
