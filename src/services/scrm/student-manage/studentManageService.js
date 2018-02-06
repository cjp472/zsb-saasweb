import qs from 'qs';

//得到学员列表
export async function getStudentList(params) {
  return requestData(`${BASE_URL}/stu/queryCRMStuList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到学员类型下拉列表
export async function getStudentTypeList(params) {
  return requestData(`${BASE_URL}/dictController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到负责人下拉列表
export async function getSellerIdList(params) {
  return requestData(`${BASE_URL}/tenantUserController/queryMyUsers`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获得单个学员信息
export async function getStudentInfo(params) {
  return requestData(`${BASE_URL}/stu/crmSingleStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//新增学员
export async function confirmCreateForm(params) {
  return requestData(`${BASE_URL}/stu/createStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认转移学员
export async function confirmTranslate(params) {
  return requestData(`${BASE_URL}/stu/moveStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//删除学员
export async function deleteStudent(params) {
  return requestData(`${BASE_URL}/stu/deleteStu`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
