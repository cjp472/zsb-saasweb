import {
    GetTenantPic,           /*获取当前校区图片*/
    SaveOrgPic,             /*保存图片*/
} from '../../../services/system/org-set/OrgLogo';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*校区logo*/
export default {

    namespace: 'orgLogo',

    state: {
        componentsExist : true,             //组件是否挂载
        imgUrl: '//img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223',                        //图片地址
        saveButtonLoading : false,          //保存按钮加载状态
        useDefaultButtonLoading : false,    //使用默认图按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_org_logo_set') {
                    dispatch({
                        type:'GetTenantPic'
                    });
                }
            });
        },
    },

    effects: {
        /*获取当前校区图片*/
        *'GetTenantPic'({ payload },{ put , call , select }){
            const { ret } = yield call(GetTenantPic);
            if( ret && ret.errorCode === 9000){
                if(ret.imgUrl == '' || ret.imgUrl == undefined || ret.imgUrl == null){
                    yield put({
                        type :'updateState',
                        payload : {
                            imgUrl: '//img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223'
                        }
                    });
                }else{
                    yield put({
                        type : 'updateState',
                        payload : {
                            imgUrl : ret.imgUrl
                        }
                    })
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*保存图片*/
        *'SaveOrgPic'({ payload },{ put , call , select }){
            yield put ({ type : 'showSaveButtonLoading' });
            const { ret } = yield call (SaveOrgPic,parse(payload));
            if( ret && ret.errorCode === 9000){
                message.success(ret.errorMessage);
                yield put({
                    type : 'updateState',
                    payload : {
                        componentsExist : false
                    }
                });
                yield put({
                    type : 'GetTenantPic'
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        componentsExist : true
                    }
                })
                /*修改header中的logo图*/
                yield put({
                    type : 'headerOrgInfoModel/updateState',
                    payload:{
                        imgUrl : payload.imgurl
                    }
                });
                //location.reload()
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put ({ type : 'closeSaveButtonLoading' });
        },

        /*使用默认图*/
        *'UseDefaultPic'({ payload },{ put , call , select }){
            yield put ({ type : 'showUseDeafultButtonLoading' });
            yield put ({
                type : 'updateState',
                payload : {
                    componentsExist : false
                }
            });
            yield put ({
                type : 'updateState',
                payload : {
                    imgUrl : ''
                }
            });
            yield put ({
                type : 'updateState',
                payload : {
                    componentsExist : true
                }
            });
            yield put ({ type : 'closeUseDeafultButtonLoading' });
        }
    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        /*保存按钮加载中*/
        showSaveButtonLoading(state,action){
            return { ...state , ...action.payload , saveButtonLoading : true}
        },
        /*保存按钮取消加载*/
        closeSaveButtonLoading(state,action){
            return { ...state , ...action.payload , saveButtonLoading : false}
        },
        /*使用默认按钮加载中*/
        showUseDeafultButtonLoading(state,action){
            return { ...state , ...action.payload , useDefaultButtonLoading : true}
        },
        /*使用默认按钮取消加载*/
        closeUseDeafultButtonLoading(state,action){
            return { ...state , ...action.payload , useDefaultButtonLoading : false}
        },
    },
};
