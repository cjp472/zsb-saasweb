import qs from 'qs';

/*查询微游戏列表*/
export async function queryMicroGame(params) {
    return requestData(`${BASE_URL}/pmgame/query/tenantGame/list`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

