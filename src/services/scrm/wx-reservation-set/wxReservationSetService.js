import qs from 'qs';

//得到预约设置信息
export async function getReservationInfo(params) {
  return requestData(`${BASE_URL}/reservationConfig/get`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存预约设置
export async function saveWxReservation(params) {
  return requestData(`${BASE_URL}/reservationConfig/save`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
