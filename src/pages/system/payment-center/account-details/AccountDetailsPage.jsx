import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import AccountDetailsComponent from '../../../../components/system/payment-center/account-details/AccountDetailsComponent';

function AccountDetailsPage({ dispatch, accountDetailsModel }){
    let {
        accountBalance,
        availableBalance,
        tableLoading,
		routeChange,
        isChecked,
        isPickOn,
        accountFlowData,
        accountFlowNewColumns,
        accountFlowNewColumns1,
        hasPhoneNum,
        showAlertModal,
        alertModalButtonLoading,
        showXuzhiModal,
        mentionStates,
        mentionWay,
        mentionPhone,
        pageIndex,
        pageSize,
        total,
        changeState,
        tixianjine,
		mentionWayList,
        mentionAcctName,
        mentionAcctNo,
        mentionBank,
        selectValue,
        mentionAlipayAccount,

		hqName,                             //总部名称
		hqSaveMobile,                       //安全认证手机号
		turnInBalance,                      //余额
		turnInUnBalance ,                   //冻结余额
		turnToBaseModalVisible,             //是否显示
		turnToBaseModalLoading,             //modal加载状态
		turnToBaseModalButtonLoading,       //modal提交按钮加载状态

    } = accountDetailsModel;

    //表格的设置
    function accountFlowChangeColumns(accountFlowNewColumns) {
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                accountFlowNewColumns,
                accountFlowNewColumns1 : []
            }
        });
    }
     //表格的设置
    function accountFlowChangeColumns1(accountFlowNewColumns1) {
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                accountFlowNewColumns1,
                accountFlowNewColumns : []
            }
        });
    }

    //账户流水表格
	function accountFlow(){
        dispatch({
            type:'accountDetailsModel/getAccountFlow',
            payload:{
                pageSize : 20,
                pageIndex : 0,

            }
        });
    }

    //提现记录表格
    function withdrawalsRecord(){
        dispatch({
            type:'accountDetailsModel/getWithdrawalsRecord',
            payload:{
                pageSize : 20,
                pageIndex : 0,

            }
        });
    }

	//上缴 弹框显示
	function turnInFunc(){
		dispatch({
			type : 'accountDetailsModel/turnInFunc'
		})
	}

    //提现申请 弹框显示
    function applicationFun(){
        dispatch({
            type:'accountDetailsModel/getApplication',
            payload:{
            }
        })
    }

    //弹框取消
    function AlertModalOnCancelFun(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showAlertModal : false,
            }
        });
    }

    //提现须知 弹框显示
    function remindedFun(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showXuzhiModal : true,
            }
        });
    }

    //提现须知弹框取消
    function CancelXuzhiModal(){
        dispatch({
            type:'accountDetailsModel/updateState',
            payload:{
                showXuzhiModal : false,
            }
        });
    }

    //获取验证码
    function verificationCodeFun(mobile){
		console.log( 'lll' )
//        dispatch({
//            type: 'accountDetailsModel/VerificationCode',
//            payload : {
//                ...params,
//            },
//        });
        dispatch({
            type: 'veryCodeButtonModel/sendVerifyCode',
            payload : {
                mobile,
            },
        });
    }



    //提现申请提交
    function mentionSubmitAction(params){
        dispatch({
            type: 'accountDetailsModel/submitAction',
            payload : {
                ...params,
                mentionWayList,
            },
        });

    }

    //分页
    function pageIndexChange(pageIndex,pageSize){
        if(isChecked){
             dispatch({
                type:'accountDetailsModel/getAccountFlow',
                payload:{
                    pageIndex : pageIndex - 1,
                    pageSize,
                }
            })
        }else{
            dispatch({
                type:'accountDetailsModel/getWithdrawalsRecord',
                payload:{
                    pageIndex : pageIndex - 1,
                    pageSize,
                }
            })
        }
    }

    //马上去设置
    function changeRoute(){
        if( mentionStates == 10000){
            dispatch( routerRedux.push('/sys_scfg_safety') );
            dispatch({
                type:'accountDetailsModel/updateState',
                payload:{
                    showAlertModal : false,
                }
            });
        }else if( mentionStates == 20000 || mentionStates == 30000 ){
            dispatch( routerRedux.push('/sys_scfg_payacct_list') );
            dispatch({
                type:'accountDetailsModel/updateState',
                payload:{
                    showAlertModal : false,
                }
            });
        }
    }

    //切换点击事件
	function onSelectFun(key){
        dispatch({
           type: 'accountDetailsModel/updateCurrentValue',
            payload: {
                selectValue: key,
                mentionWayList,
            }
        });
    }

	//关闭总部转账
	function TurnToBaseModalClose(){
		dispatch({
			type : 'accountDetailsModel/updateState',
			payload : {
				turnToBaseModalVisible : false
			}
		})
	}

	//确认总部转账
	function turnToBaseModalConfirm( values ){
		dispatch({
			type : 'accountDetailsModel/turnToBaseModalConfirm',
			payload : {
				values
			}
		})
	}

    let AccountDetailsProps = {
        accountBalance,
        availableBalance,
        tableLoading,
        routeChange,
        isChecked,
        isPickOn,
        accountFlow,
        withdrawalsRecord,
        accountFlowData,
        accountFlowNewColumns,
        accountFlowChangeColumns,
        accountFlowNewColumns1,
        accountFlowChangeColumns1,
		turnInFunc,
        applicationFun,
        hasPhoneNum,
        showAlertModal,
        AlertModalOnCancelFun,
        alertModalButtonLoading,
        CancelXuzhiModal,
        showXuzhiModal,
        remindedFun,
        mentionStates,
        mentionWay,
        mentionPhone,
        mentionSubmitAction,
        verificationCodeFun,
        pageIndex,
        pageSize,
        total,
        pageIndexChange,
        changeRoute,
        tixianjine,
        mentionWayList,
        mentionAcctName,
        mentionAcctNo,
        mentionBank,
        selectValue,
        mentionAlipayAccount,
        onSelectFun,

		//总部转账
		hqName,                             //总部名称
		hqSaveMobile,                       //安全认证手机号
		turnInBalance,                      //余额
		turnInUnBalance ,                   //冻结余额
		turnToBaseModalVisible,             //是否显示
		turnToBaseModalLoading,             //modal加载状态
		turnToBaseModalButtonLoading,       //modal提交按钮加载状态
		TurnToBaseModalClose,               //关闭modal
		turnToBaseModalConfirm,             //确认转账
		verificationCodeFun,                //点击获取验证码
    };


    return (
        <AccountDetailsComponent { ...AccountDetailsProps } />
    )
};

function mapStateToProps ({ accountDetailsModel }){
	return { accountDetailsModel };
};

export default connect( mapStateToProps )( AccountDetailsPage );
