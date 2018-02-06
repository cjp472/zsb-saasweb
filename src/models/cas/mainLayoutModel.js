import {
    queryCurrentOrgLogo,
    queryApplicationList
} from '../../services/common/GetOrgInfoService';
import { message } from 'antd';
/*
 *cas首页的布局model
 */
export default {

    namespace: 'casMainLayoutModel',

    state: {

        orgInfo : {},                      //机构信息
        currentApplication : 'zsb',        //当前选中的应用编号
        applicationList : [],              //应用列表
        currentOrgLogoImg : '',			   //当前登陆用户所属机构的logo地址
        currentUserInfo : {
            headerImg : '',
            nickname : '',
        },                                 //当前登陆用户的信息
    },

    effects: {

//		/*获取机构图片*/
//        *'queryCurrentOrgLogo'({ payload }, { call, put, select }){
//            const { ret } = yield call(queryCurrentOrgLogo);
//            if( ret && ret.errorCode === 9000){
//                if(ret.imgUrl == '' || ret.imgUrl == undefined || ret.imgUrl == null){
//                    yield put({
//                        type:'updateState',
//                        payload:{
//                            currentOrgLogoImg : '//img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223'
//                        }
//                    })
//                }else{
//                    yield put({
//                        type:'updateState',
//                        payload:{
//                            currentOrgLogoImg : ret.imgUrl
//                        }
//                    })
//                }
//            }else{
//                ret && ret.errorMessage && message.error(ret.errorMessage);
//            }
//        },

        /*查询应用列表*/
        *'queryApplicationList'({ payload }, { call, put, select }){
            const { ret } = yield call(queryApplicationList);
            if( ret && ret.errorCode === 9000){
                yield put({
                	type: 'updateState',
                	payload: {
                		applicationList: ret.results
                	}
                });
            }else{
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }
        }
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
2
