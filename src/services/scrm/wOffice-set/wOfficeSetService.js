import qs from 'qs';

//得到微官网设置信息
export async function getWOfficeInfo(params){
  return requestData(`${BASE_URL}/orgConfigController/queryConfig`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//初始化微官网信息
export async function initWOfficeInfo(params){
  return requestData(`${BASE_URL}/orgConfigController/initConfig`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存微官网设置信息
export async function showAndHideItem(params){
  return requestData(`${BASE_URL}/orgConfigController/changeConfig`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//确认更改显示项
export async function confirmChangeTitle(params){
  return requestData(`${BASE_URL}/orgConfigController/updateConfig`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
