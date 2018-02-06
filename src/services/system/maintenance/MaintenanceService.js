import qs from 'qs';

export async function onLoginService(params) {
  return requestData(`${BASE_URL}/saas/login`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function onMainService(params) {
  return requestData(`${BASE_URL}/saas/main`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
