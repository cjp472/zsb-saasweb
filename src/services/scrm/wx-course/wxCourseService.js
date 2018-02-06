import qs from 'qs';

//得到活动列表
export async function getCourseList(params) {
  return requestData(`${BASE_URL}/orgCourseController/queryCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到课程类型和年龄选择项
export async function getCheckBoxOptions(params) {
  return requestData(`${BASE_URL}/organController/getOrganDict`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//得到单个课程信息
export async function getCourseInfo(params) {
  return requestData(`${BASE_URL}/orgCourseController/courseDetail`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//保存课程信息
export async function confirmAddWxCourse(params) {
  return requestData(`${BASE_URL}/orgCourseController/updateCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//改变课程装填
export async function updateCourseStatus(params) {
  return requestData(`${BASE_URL}/orgCourseController/changeCourse`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}

//查看二维码
export async function showCourseUrl(params) {
  return requestData(`${BASE_URL}/orgCourseController/queryUrl`, {
    method: 'post',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify(params),
  });
}
