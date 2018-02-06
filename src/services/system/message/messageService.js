import qs from 'qs';

export async function getMessageList(params) {
  return requestData(`${BASE_URL}/smsQuery/getSendHistory`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
