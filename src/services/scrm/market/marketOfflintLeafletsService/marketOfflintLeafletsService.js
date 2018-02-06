import qs from 'qs';

////c列表
//export async function getActivityList(params) {
//  return requestData(`${BASE_URL}/microActivity/getActivityList`, {
//    method: 'post',
//    headers: {
//        "Content-Type": "application/x-www-form-urlencoded",
//    },
//    body: qs.stringify(params),
//  });
//}

//传单列表
export async function getLeafletsList(params) {
  return requestData(`${BASE_URL}/offlineLeaflet/orgLeafletModelList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}


export async function getInstMsg(params) {
  return requestData(`${BASE_URL}/offlineLeaflet/getInstMsg`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取活动列表
export async function getActivityList(params) {
  return requestData(`${BASE_URL}/offlineLeaflet/markList`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//获取市场人员
export async function getUserLink(params) {

    return requestData(`${BASE_URL}/zsb/market/queryMembers`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取域名
export async function getDataInit(params) {

    return requestData(`${BASE_URL}/zsb/market/dataInit`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取市场人员
export async function saveData(params) {

    return requestData(`${BASE_URL}/offlineLeaflet/orgCreateLeaflet`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取线下传单列表
export async function getInstLeafletsList(params) {

    return requestData(`${BASE_URL}/offlineLeaflet/orgInstList`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

//获取线下传单实例删除和上下架
export async function getInstDelect(params) {

    return requestData(`${BASE_URL}/offlineLeaflet/instUpdateStatus`, {
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(params),
    });
}

/*图片上传*/
export async function uploadImageMethods(params) {

	let value = undefined;

	return new Promise(function(resolve, reject) {

		var formData = new FormData();

		formData.append("file", params);

		var request = new XMLHttpRequest();

        request.open("post", BASE_UPLOAD_IMAGE);

			request.onload = function(oEvent) {

				if(oEvent.currentTarget.status === 200) {

					 value = resolve(JSON.parse(oEvent.currentTarget.response));

				} else {
					reject(new Error('图片上传失败'))
				}
			}

		request.send(formData);
	}).catch(function(err) {
		_(err);
	})
}
