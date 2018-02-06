import qs from 'qs';

//得到活动列表
export async function getActivityList(params) {
  return requestData(`${BASE_URL}/micNetActivityController/getActivityList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//报名成功的列表
export async function applySuccessList(params) {
  return requestData(`${BASE_URL}/micNetApplyController/getJoinerList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取所有标签列表
export async function getProductLabel(params) {
  return requestData(`${BASE_URL}/productLabel/alllabel/query`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到活动信息
export async function getActivityInfo(params) {
  return requestData(`${BASE_URL}/micNetActivityController/singleActivityMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存活动信息
export async function confirmAddWxActivity(params) {
  return requestData(`${BASE_URL}/micNetActivityController/createActivity`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//上下架、删除
export async function updateActivityStatus(params) {
  return requestData(`${BASE_URL}/micNetActivityController/updateStatus`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//取消报名
export async function cancelApply(params) {
  return requestData(`${BASE_URL}/micNetApplyController/cancelJoin`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//查看二维码
export async function showActivityUrl(params) {
  return requestData(`${BASE_URL}/micNetActivityController/getActivityAddress`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//优先等位
export async function toBeNumberOne(params) {
  return requestData(`${BASE_URL}/micNetApplyController/precedenceWait`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认添加备注
export async function confirmAddRemark(params) {
  return requestData(`${BASE_URL}/micNetApplyController/addRemark`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

