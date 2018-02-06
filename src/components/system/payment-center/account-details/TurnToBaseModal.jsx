import React from 'react';
import { Modal, Form, Spin, Button, Input, message } from 'antd';
import VeryCodeButton from '../../../../pages/common/very-code-button/VeryCodeButton';
import styles from './TurnToBaseModal.less';
const FormItem = Form.Item;

const formItemLayout = {
   labelCol : { span: 4 },
   wrapperCol: { span: 20 },
};

/*转给总部modal*/
function TurnToBaseModal({
	hqName,                             //总部名称
	hqSaveMobile,                       //安全认证手机号
	turnInBalance,                      //余额
	turnInUnBalance,                    //冻结余额
    turnToBaseModalVisible,             //是否显示
    turnToBaseModalLoading,             //modal加载状态
    turnToBaseModalButtonLoading,       //modal提交按钮加载状态
    TurnToBaseModalClose,               //关闭modal
	turnToBaseModalConfirm,             //确认转账
    verificationCodeFun,                //点击获取验证码

    form : {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
		setFieldsValue,
    },
}){
	let hqSaveMobile1 = !!hqSaveMobile && (hqSaveMobile.substr(0, 3) + '****' + hqSaveMobile.substr(7)) || undefined;
	let balance = parseFloat( turnInBalance ) - parseFloat( turnInUnBalance );

    function handleComplete( e ) {
        e.preventDefault();
        validateFieldsAndScroll(( errors, values ) => {
            if ( !!errors ) {
                return;
            }
			if( getFieldValue('amount') > balance ){
				message.error( '所填金额超过可转金额' );
				return;
			}
			let params = {
				amount : values.amount,
				tel    : hqSaveMobile,
				code   : values.code
			}
			turnToBaseModalConfirm( params )
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        TurnToBaseModalClose();
    }

	function afterClose(){
		resetFields();
	}

	//获取验证码
	function verificationCodeFunAction(){
		verificationCodeFun( hqSaveMobile )
	}

    //模态框的属性
    let modalOpts = {
		title        : '上缴至总部',
		maskClosable : false,
		visible      : turnToBaseModalVisible,
		closable     : true,
		width        : 550,
		onOk         : handleComplete,
		onCancel     : handleCancel,
		afterColse   : afterClose,
		footer : [
			<Button key = "cancel" type = "ghost" onClick = { handleCancel }>取消</Button>,
			<Button key = "submit" type = "primary"
					onClick = { handleComplete }
					disabled = { turnToBaseModalButtonLoading }
					loading = { turnToBaseModalButtonLoading }
					style = {{ marginLeft : 10 }}>确认</Button>
		],
		className : 'online_account_turn_to_base'
	};

    //整数
    function checkNum(rule, value, callback){
        if(value && value != '') {
	      if(!(/^[0-9]\d*$/.test(value))){
	          callback('请填写整数');
	        } else {
	          callback();
	        }
	    } else {
	      callback();
	    }
    }

	//全部转进
	function allTurnIn(){
		setFieldsValue({ 'amount' : balance.toFixed( 2 ) })
	}

    return (
        <Modal {...modalOpts}>
            <Spin spinning = { turnToBaseModalLoading }>
               <Form>
                    <FormItem
                        { ...formItemLayout }
                        label = "总部名称"
                    >
                        <div style = {{ marginTop : '7px' }}>{ hqName || '' }</div>
                    </FormItem>
                    <div className = { styles.money }>
                        <FormItem
                            label="金额"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('amount', {
                                initialValue : ''
                            })(
                                <Input style = {{ width : 350 }} placeholder = '请输入金额' size = 'default'/>
                            )}
                            <a style = {{ marginLeft : 10 }} onClick = { allTurnIn } >全部转进</a>
                        </FormItem>
                    </div>
                    <FormItem
                        { ...formItemLayout }
                        label = "安全认证手机"
                    >
                        { getFieldDecorator('tel', {
                            initialValue : hqSaveMobile1
                        })(
                            <Input style = {{ width : 350 }} placeholder = '请输入安全认证手机' disabled size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label = "验证码"
                    >
                        { getFieldDecorator('code', {
                            rules : [
                                { required : true, message : '请输入验证码' },
                                { validator: checkNum },
                            ],
                        })(
                            <Input size = 'default' style = {{ width : 140 }} placeholder = '请输入验证码' />
                        )}
                            <VeryCodeButton onClick = { verificationCodeFunAction } />
                    </FormItem>
               </Form>
            </Spin>
        </Modal>
    );
}

export default Form.create()(TurnToBaseModal);
