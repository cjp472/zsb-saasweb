import {
    GetLeadRecordRule,          //保存设置选项
    SaveLeadRecordRule,
} from '../../../../services/system/gong-hai-set/lead-record-no-rule/leadRecordNoRule';
import { parse } from 'qs';
import { message } from 'antd';

/*校区logo*/
export default {

    namespace: 'leadRecordNoRule',

    state: {
        loading : false,                //是否加载状态
        id : '',                        //id
        dataKey : '',                   //初始最大销售名单量
        Status : false,
        checkedstatus : '1',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_sea_follow') {
                    dispatch({
                        type:'GetLeadRecordRule',
                        payload:{
                           confKey:'BACKTOCLUEPOOLDAY'
                        }
                    });
                }
            });
        },
    },

    effects: {

         *'GetLeadRecordRule'({ payload },{ put , call , select }){
            const { ret } = yield call(GetLeadRecordRule,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let selectType='';
                if(ret.list[0].key=='-1'){
                    selectType='-1'
                }else{
                    selectType='1'
                }
                yield put({
                    type:'updateState',
                    payload:{
                       dataKey:ret.list[0].key,
                       checkedstatus:selectType
                    }
                });

            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
        },

        *'SaveLeadRecordRule'({ payload },{ put , call , select }){
            const { ret } = yield call(SaveLeadRecordRule,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage || '保存成功');
                yield put({
                    type:'GetLeadRecordRule',
                    payload:{
                       confKey:'BACKTOCLUEPOOLDAY'
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('获取配置信息出错');
            }
        },


    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLoading(state, action) {
            return { ...state, ...action.payload , loading : true};
        },
        closeLoading(state, action) {
            return { ...state, ...action.payload , loading : false};
        },
    },
};
