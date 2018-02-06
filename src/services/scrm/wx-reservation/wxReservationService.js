import qs from 'qs';

/*查询口碑商品-课程*/
export async function queryWxReservation(params) {
  return requestData(`${BASE_URL}/reservationController/list`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

/*查询口碑商品-课程*/
export async function batchDeal(params) {
  return requestData(`${BASE_URL}/reservationController/batchDeal`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}


/*查询口碑商品-课程*/
export async function updateRemark(params) {
  return requestData(`${BASE_URL}/reservationController/updateRemark`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
