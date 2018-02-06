
import { parse } from 'qs';
import { message } from 'antd';
import { showAccountFlow , showBalance , showWithdrawalsRecord , checkApplication , addSetSubmit , getVerificationCode , getHQInfo, getHqMobileInfo, turnToBaseModalConfirm } from '../../../../services/system/payment-center/account-details/AccountDetailsService'
export default {

    namespace: 'accountDetailsModel',

    state: {
        //账户余额
        accountBalance  :'',        //账户余额
        availableBalance:'',        //可用余额

        //账户流水，提现记录表格
        tableLoading    :false,
        routeChange     :false,     //tab切换
        isChecked       :true,      //账户流水 是否被选中
        isPickOn        :false,     //提现记录 是否被中
        accountFlowData : [],       //账户流水表格数据
        accountFlowNewColumns:[],   //账户流水表格>设置
        accountFlowNewColumns1: [],
        pageIndex       : 0,
        pageSize        : 20,
        total           : '',
        changeState     : '',

        //提现申请
        showAlertModal  : false,    //弹框是否显示
        alertModalButtonLoading : false, //弹框加载
        mentionStates : '',         //提现申请返回的状态
        mentionWay : '',            //提现方式
        mentionPhone : '',          //提现手机号
        mentionAcctName : '',       //提现账户名
        mentionAcctNo : '',			//提现卡号、账号
        mentionBank : '',           //开户行
        mentionAlipayAccount : '',    //支付宝账号名称

        mentionWayList: [],			//提现方式

        //提现须知
        showXuzhiModal  : false,    //提现须知弹框显示


        tixianjine : '',
        selectValue: '',

		hqName                     : undefined,         //总部名称
		hqSaveMobile               : undefined,         //安全认证手机号
		turnInBalance              : undefined,         //余额
		turnInUnBalance            : undefined,         //冻结余额
		turnToBaseModalVisible     : false,             //是否显示
		turnToBaseModalLoading     : false,             //modal加载状态
		turnToBaseModalButtonLoading : false,           //modal提交按钮加载状态
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_pay_account') {

                    dispatch({
                        type : 'getBalance',
                        payload : {
                        }
                    });

                    dispatch({
                        type : 'getAccountFlow',
                        payload : {
                            pageSize :20,
                            pageIndex:0,
                        }
                    });

                }
            });
        },
    },

    effects: {

        //账户余额
        *getBalance({ payload }, { call, put, select }) {
            let { ret } = yield call(showBalance, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        accountBalance      : ret.results.balance,
                        availableBalance    : ret.results.unbalance,
                    }
                })
            } else {
                ret && message.error(ret.errorMessage || '查询账户信息出错啦');
            }
        },

        //账户流水
        *getAccountFlow({ payload }, { call, put, select }) {
            yield put ({ type : 'showTableLoading' });
            let accountDetailsModel = yield select(state => state.accountDetailsModel);
            let { ret } = yield call(showAccountFlow, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        accountFlowData : ret.results,
                        isChecked : true,
                        isPickOn : false,
                        routeChange : false,
                        pageIndex : payload.pageIndex,
                        pageSize : payload.pageSize,
                        total : ret.data.resultCount,

                    }
                })

            } else {
                ret && message.error(ret.errorMessage || '查询账户流水出错啦');
            }
            yield put ({ type : 'closeTableLoading' });
        },

        //提现记录
        *getWithdrawalsRecord({ payload }, { call, put, select }) {
            yield put ({ type : 'showTableLoading' });
            let accountDetailsModel = yield select(state => state.accountDetailsModel);
            let { ret } = yield call(showWithdrawalsRecord, parse(payload));
            if (ret && ret.errorCode == 9000) {
                yield put({
                    type : 'updateState',
                    payload : {
                        accountFlowData : ret.results,
                        isChecked : false,
                        isPickOn : true,
                        routeChange : false,
                        pageIndex : payload.pageIndex,
                        pageSize : payload.pageSize,
                        total : ret.data.resultCount,

                    }
                })

            } else {
                ret && message.error(ret.errorMessage || '查询提现记录出错啦');
            }
            yield put ({ type : 'closeTableLoading' });
        },

		//上缴至总部
		*turnInFunc({ payload },{ call, put, select }){
			let orgId = window._init_data.cerp_orgId;
			//获取总部信息
			let { ret } = yield call( getHQInfo, ({ orgId }) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						hqName : ret.orgName
					}
				})
			}else {
				message.error( ret && ret.errorMessage || '获取总部信息失败' );
			}
			//获取安全验证手机号
			let mobile = yield call( getHqMobileInfo );
			if(mobile && mobile.ret && mobile.ret.errorCode === 9000){
                let { ret } = mobile;
				yield put({
					type : 'updateState',
					payload : {
						hqSaveMobile : ret.results.tel || undefined,
						turnToBaseModalVisible : true
					}
				})
			}else if(mobile && mobile.ret && mobile.ret.errorCode === 10000){
                let { ret } = mobile;
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            }else{
				message.error( mobile && mobile.ret && mobile.ret.errorMessage || '获取安全验证手机失败' )
			}

			//获取账户余额
			let balance = yield call( showBalance );
			if( balance && balance.ret && balance.ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						turnInBalance : balance.ret.results.balance,
						turnInUnBalance : balance.ret.results.unbalance
					}
				})
			}else {
				message.error( balance && balance.ret && balance.ret.errorMessage || '获取账户余额失败' )
			}

		},

		//确认 转账至总部
		*turnToBaseModalConfirm({ payload },{ call, put, select } ){
			let { values } = payload;
			let { ret } = yield call( turnToBaseModalConfirm, ( values ) );
			if( ret && ret.errorCode == 9000 ){
				yield put({
					type : 'updateState',
					payload : {
						turnToBaseModalVisible : false
					}
				})
			}
		},

        //提现申请
        *getApplication({ payload }, { call, put, select }) {
            let { ret } = yield call(checkApplication, parse(payload));
            if(ret && ret.errorCode == 10000){
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            }else if(ret && ret.errorCode == 20000){
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            }else if (ret && ret.errorCode == 9000) {
            	let mentionWayList = ret.results || [];
            	let mentionWay = '', mentionPhone = '' ,mentionAcctName = '',mentionAcctNo = '',mentionBank='',mentionAlipayAccount='';
            	if(mentionWayList[0]){
                    mentionWay = mentionWayList[0].paymentKey;
                    mentionPhone = mentionWayList[0].tel;
                    mentionAcctName =  mentionWayList[0].accountName;
                    mentionAcctNo = mentionWayList[0].acctNo;
                    mentionBank = mentionWayList[0].ourBank;
                    mentionAlipayAccount =mentionWayList[0].mPayAccount;
                }

               yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        mentionWay, mentionWayList, mentionPhone,mentionAcctName,mentionBank,mentionAcctNo,mentionAlipayAccount,
                        selectValue : "0",
                        showAlertModal : true,
                    }
                })


            }else if( ret && ret.errorCode == 30000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        mentionStates : ret.errorCode,
                        showAlertModal : true,
                    }
                })
            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },

        //提现申请 提交
        *submitAction({ payload }, { call, put, select }) {
            let accountDetailsModel = yield select( state => state.accountDetailsModel );
            let paymentKey = payload.mentionWayList[payload.mentionWay].paymentKey;
            let parameter = {
                amount : payload.mentionShow,
                tel : accountDetailsModel.mentionPhone,
                vCode : payload.mentionPhoneVal || payload.mentionPhone,
                paymentKey,
            }
           	if(paymentKey == 'bank'){
           			parameter.acctBankName = payload.accountName,
           			parameter.openBankName = payload.ourBank,
           			parameter.acctNo = payload.acctNo
           	}else if(paymentKey == 'alipay'){

           			parameter.accountName = payload.accountName,
           			parameter.acctNo = payload.acctNo

           	}
            let { ret } = yield call(addSetSubmit, parse(parameter));
            if (ret && ret.errorCode == 9000) {
               yield put({
                    type : 'updateState',
                    payload : {
                        showAlertModal : false,
                    }
                })
               //更新展示余额
               yield put({
                    type : 'getBalance',
                    payload : {
                        accountBalance      : ret.results.balance,
                        availableBalance    : ret.results.unbalance,
                    }
                });
                //更新提现记录表格
                yield put({
                    type:'getWithdrawalsRecord',
                    payload:{
                        pageSize : 20,
                        pageIndex : 0,

                    }
                });
                ret && message.success('提现成功！');
            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },

        //获取验证码
        *VerificationCode({ payload }, { call, put, select }) {

            let accountDetailsModel = yield select( state => state.accountDetailsModel );

            let params = {
                mobile : accountDetailsModel.mentionPhone,
            }
            let { ret } = yield call(getVerificationCode, parse(params));
            if (ret && ret.errorCode == 9000) {
               yield put({
                    type : 'updateState',
                    payload : {

                    }
                })
            } else {
                ret && message.error(ret.errorMessage || '查询信息出错！');
            }
        },
         //切换菜单状态改变
        *updateCurrentValue({payload},{put}){

            let {selectValue,mentionWayList} = payload;
            let mentionWay = '', mentionPhone = '' ,mentionAcctName = '',mentionAcctNo = '',mentionBank='',mentionAlipayAccount='';
            if(mentionWayList[selectValue]){
                mentionWay = mentionWayList[selectValue].paymentKey;
                mentionPhone = mentionWayList[selectValue].tel;
                mentionAcctName =  mentionWayList[selectValue].accountName;
                mentionAcctNo = mentionWayList[selectValue].acctNo;
                mentionBank = mentionWayList[selectValue].ourBank;
                mentionAlipayAccount = mentionWayList[selectValue].mPayAccount
            }
            yield put({
                 type : 'updateState',
                 payload : {mentionWay, mentionPhone,mentionAcctName ,mentionAcctNo,selectValue,mentionWayList,mentionBank,mentionAlipayAccount}
            })
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showTableLoading(state,action){
            return { ...state , tableLoading : true };
        },
        closeTableLoading(state,action){
            return { ...state , tableLoading : false };
        },

    },
};
