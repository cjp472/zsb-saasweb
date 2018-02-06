import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import UserAgreementModal from '../../../components/common/user-agreement/UserAgreementModal';

function UserAgreementPage({ dispatch, userAgreementModel }){
    let {
		visible,
		time,
		startTime,
		content,
		disabled

    } = userAgreementModel;

	function clickToCloseUser(){
		dispatch({
			type : 'userAgreementModel/updateState',
			payload : {
				visible : false
			}
		})
	}

	let timer = undefined;
	if( startTime ){
		timer = setInterval( function(){
			if( time === 0 ){
				clearInterval( timer );
				dispatch({
					type : 'userAgreementModel/updateState',
					payload : {
						startTime : false,
						disabled  : false
					}
				})
			}else{
				clearInterval( timer );
				dispatch({
					type : 'userAgreementModel/updateState',
					payload : {
						time : --time
					}
				})
			}
		}, 1000 )
	}else{
		clearInterval( timer )
	}
	let userAgreementModalProps = {
		visible,
		content,
		time,
		disabled,

		clickToCloseUser
	}
    return (
		<UserAgreementModal { ...userAgreementModalProps } />
    )
};

function mapStateToProps ({ userAgreementModel }){
	return { userAgreementModel };
};

export default connect( mapStateToProps )( UserAgreementPage );
