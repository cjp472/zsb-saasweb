import qs from 'qs';

export async function getAccountCardList(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function getAccountCardDetail(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function deleteAccountCard(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/delete`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function createAccountCard(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/add`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

export async function updateAccountCard(params) {
  return requestData(`${BASE_URL}/PaymentAcctController/update`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
