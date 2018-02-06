import qs from 'qs';

export async function GetTimeData(params) {
    return requestData(`${BASE_URL}/confController/get`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

export async function FormSubmit(params) {
    return requestData(`${BASE_URL}/confController/save`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}
