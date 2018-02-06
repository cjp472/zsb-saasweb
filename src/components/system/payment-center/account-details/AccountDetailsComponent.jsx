import React from 'react';
import { Tabs , Form , Modal , Button , Input , Select , Popover } from 'antd';
import styles from './AccountDetailsComponent.less';
import ClassPackageComponent from '../../../common/new-component/manager-list/ManagerList';
import TurnToBaseModal from './TurnToBaseModal';
import { AlertModal } from '../../../common/new-component/NewComponent';
import VeryCodeButton from '../../../../pages/common/very-code-button/VeryCodeButton';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function AccountDetailsComponent({
    accountBalance,
    availableBalance,
    tableLoading,
    routeChange,
    isChecked,
    isPickOn,
    accountFlow,        //账户流水展示数据
    withdrawalsRecord,  //提现记录展示数据
    accountFlowData,    //账户流水表格数据
    accountFlowChangeColumns,
    accountFlowChangeColumns1,
    accountFlowNewColumns,
    accountFlowNewColumns1,
    applicationFun,        //提现申请
	turnInFunc,            //上缴
    hasPhoneNum,
    showAlertModal,
    AlertModalOnCancelFun,
    alertModalButtonLoading,
    CancelXuzhiModal,
    showXuzhiModal,
    remindedFun,
    mentionStates,
    mentionWay, mentionWayList,mentionAcctName,mentionAcctNo,mentionBank,mentionAlipayAccount,
    mentionPhone,
    mentionSubmitAction,//提交
    verificationCodeFun,
    pageIndex,
    pageSize,
    total,
    pageIndexChange,
    changeRoute,
    tixianjine,
    onSelectFun, //切换显示
    selectValue, //切换支付方式值

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

    form : {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
    },
}) {

    function checkAmount( rule , value, callback ){
	    if(value && value != ''){
	      if((value < 200 || value > 10000)){
	          callback('提现金额须大于等于200，小于等于10000');
	        } else {
	          callback();
	        }
	    } else {
	        callback();
	    }
	  };

    let formItemLayout = {
		labelCol   : { span : 5 },
		wrapperCol : { span : 19 }
	};

    if (routeChange == true) {
        isChecked = true;
        isPickOn = false;
    }

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

    //最多保留两位小数
	function checkIntegerNum(rule, value, callback) {
		if(value && value != '') {
			if(!(/^-?\d+(\.\d{1,2})?$/.test(value))){
	    		callback('最多保留两位小数');
	    	} else {
	    		callback();
	    	}
		} else {
			callback();
		}
	}


    let AccountDetailComProp = {
        rightBars : {
            btns : [
                {
                    label    : '账户流水',
                    handle   : accountFlow,
                    isChecked : isChecked,
                    type     : 'leadsrecord',
                },{
                    label    : '提现记录',
                    handle   : withdrawalsRecord,
                    isPickOn : isPickOn,
                    type     : 'sturecord' ,
                },{
					label    : '上缴',
					handle   : turnInFunc
				},{
                    label    : '提现',
                    handle   : applicationFun,
                },{
                    label    : '提现须知',
                    handle   : remindedFun,
                }
            ],
        },

        table: {
            loading : tableLoading,
            rowKey : 'id',
            dataSource : accountFlowData,
//            newColumns : isChecked == true && isPickOn == false ? accountFlowNewColumns : accountFlowNewColumns1,
//            changeColumns : isChecked == true && isPickOn == false ? accountFlowChangeColumns : accountFlowChangeColumns1,     //右上角的设置
            columns: isChecked == true && isPickOn == false ?
            [
                {
                    key: 'id',
                    title: '编号',
                    dataIndex: 'id',
                    width: 180,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'tradeNo',
                    title: '交易单号',
                    dataIndex: 'tradeNo',
                    width: 250,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'subject',
                    title: '描述',
                    dataIndex: 'subject',
                    width: 250,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'amount',
                    title: '发生金额',
                    dataIndex: 'amount',
                    width: 150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'balance',
                    title: '账户余额',
                    dataIndex: 'balance',
                    width: 150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'trxType',
                    title: '类型',
                    dataIndex: 'trxType',
                    width: 100,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'createTime',
                    title: '提交时间',
                    dataIndex: 'createTime',
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },
            ]
            :
            [
                {
                    key: 'id',
                    title: '编号',
                    dataIndex: 'id',
                    width: 150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'settAmount',
                    title: '提现金额',
                    dataIndex: 'settAmount',
                    width: 80,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'remitAmount',
                    title: '实际到账',
                    dataIndex: 'remitAmount',
                    width: 80,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'settFee',
                    title: '手续费',
                    dataIndex: 'settFee',
                    width: 80,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'payeeRealName',
                    title: '户名',
                    dataIndex: 'payeeRealName',
                    width: 80,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'payeeAccount',
                    title: '账号',
                    dataIndex: 'payeeAccount',
                    width:150,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'bankAddress',
                    title: '开户行',
                    dataIndex: 'bankAddress',
                    width:120,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'operator',
                    title: '操作人',
                    dataIndex: 'operator',
                    width:80,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'createTime',
                    title: '提交时间',
                    dataIndex: 'createTime',
                    width:180,
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },{
                    key: 'settStatus',
                    title: '状态',
                    dataIndex: 'settStatus',
                    render : (text,record) => (
                        <Popover placement="top" content={text} trigger="hover">
                            { text }
                        </Popover>
                    )
                },
            ],
        },

        pagination : {
            total:!isNaN(parseInt(total))?total:0,
            pageIndex : pageIndex,
            pageSize : pageSize,
            showTotal        : total => `总共 ${total} 条`,
            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : pageIndexChange,
            onChange         : pageIndexChange,
        }

    }

	//上缴功能 props
	let turnToBaseModalProps = {
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
	}

    //取消
    function AlertModalOnCancel(){
        resetFields();
        AlertModalOnCancelFun();

    }
    //提现申请 弹框
    let AlertModalProps = {
        visible : showAlertModal,                //提示框是否显示
        title : '提现申请',                    //提示框标题
        content : mentionStates == 10000 ? '没有绑定安全手机号码' :  mentionStates == 20000 ? '没有设置银行卡' : '银行卡信息不完整',                //提示框内容
        onCancel : AlertModalOnCancel,              //提示框点击取消
        buttonLoading : alertModalButtonLoading,    //提示框按钮是否加载状态
        footerEnsure : '马上去设置',
        onOk : changeRoute,
    }

    //申请提现 提交
    function mentionSubmit(){
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
     		mentionSubmitAction(values);
        });
    }

    let AlertModalProps1 = {
        visible : showAlertModal,                //提示框是否显示
        title : '提现申请',                    //提示框标题
        footer : [
            <Button key="cancel" type="ghost" onClick={AlertModalOnCancel}> 取 消 </Button>,
            <Button key="submit" type="primary"
                    style={{marginLeft:'10px'}}
                    onClick={mentionSubmit}
            >提交</Button>
        ],
        onCancel : AlertModalOnCancel,
        className : 'online_account_cash_application'
    }

    //提现须知的弹框
    let AlertModalNotice = {
        visible : showXuzhiModal,
        title : '提现须知',
        content : (
                <div style={{textAlign:'left'}}>
                    <p>1、闪闪提供支付代收服务，用户通过线上微信支付金额直接进入闪闪微信支付的代收账号中。</p>
                    <p>2、用户成功支付订单时，微信会收取占交易金额一定比例的手续费。此手续费由微信官方统一扣费。</p>
                    <p>3、提现手续费统一为交易额的2%。</p>
                    <p>4、申请提现请在营销模板的支付中心进行操作，在每月15日进行结算服务，遇到周末或者法定节假日的时候顺延。</p>
                    <p>5、单次提现最高不超过1万。</p>
                    <p>6、到账时间<br/>银行卡：1-5个工作日到账</p>
                </div>
            ),
        onCancel : CancelXuzhiModal,
        onOk : CancelXuzhiModal,
    }

    //手机号码截取
    let mentionPhone1 = mentionPhone.substr(0, 3) + '****' + mentionPhone.substr(7);

    //获取验证码
    function verificationCodeFunction(){
        let value = mentionPhone;
        verificationCodeFun(value)
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.accountTitle }>
                <p>账户余额:<span>{ accountBalance}</span>元</p>
                <p>可用余额:<span>{ (accountBalance - availableBalance).toFixed(2) }</span>元</p>
            </div>
            <ClassPackageComponent {...AccountDetailComProp} />
            <TurnToBaseModal { ...turnToBaseModalProps } />
            { (mentionStates == 10000 || mentionStates == 20000 || mentionStates == 30000) ?
                <AlertModal {...AlertModalProps}/>
                :
                mentionStates == 9000 ?
                <Modal {...AlertModalProps1}>
                    <Form>
                        {!!showAlertModal &&
                        <FormItem
                            { ...formItemLayout }
                            label = "提现方式"
                        >
                            { getFieldDecorator('mentionWay' , {
                                initialValue : selectValue,
                                rules : [
                                    { required : true , message : '请选择提现方式' },
                                ],
                            })(
                                <Select
                                    notFoundContent = "未找到"
                                    showSearch
                                    allowClear
                                    size = 'default'
                                    placeholder = '请选择提现方式'
                                    optionFilterProp = "children"
                                    onSelect = {onSelectFun}
                                    >
                                    { mentionWayList && mentionWayList.map((item, index) =>
                                       <Option key={'mention_way_opt_'+index} value={`${index}`}>{item.name}</Option>
                                	)}
                                </Select>
                            )}
                        </FormItem>
                            }

                         {
                            mentionWay == 'alipay' ? <FormItem
                                { ...formItemLayout }
                                label =  "账号名称"
                            >
                                { getFieldDecorator('accountName' , {
                                    initialValue : mentionAlipayAccount,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写账户名称！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem> : ''

						}
                        {
                             mentionWay == 'bank' ? <FormItem
                                { ...formItemLayout }
                                label =  "户名"
                            >
                                { getFieldDecorator('accountName' , {
                                    initialValue : mentionAcctName,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写户名！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem> : ''

						}

						{
                        	(mentionWay == 'alipay' || mentionWay == 'bank')?
                        	<FormItem
                                { ...formItemLayout }
                                label = "账号/卡号"
                            >
                                { getFieldDecorator('acctNo' , {
                                    initialValue : mentionAcctNo,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写账号/卡号！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem>
                        	: ''
                        }

						{
                        	mentionWay == 'bank'?
                        	<FormItem
                                { ...formItemLayout }
                                label = "开户行"
                            >
                                { getFieldDecorator('ourBank' , {
                                    initialValue : mentionBank,
                                    rules : [
                                        { required : true,  },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem>
                        	: ''
                        }

                        {
                            showAlertModal == true ?
                            <FormItem
                                { ...formItemLayout }
                                label = "提现金额"
                            >
                                { getFieldDecorator('mentionShow' , {
                                    initialValue : tixianjine,
                                    rules : [
                                        { required : true , message : '请输入提现金额!' ,  },
                                        { validator: checkAmount },
                                        { validator: checkIntegerNum },
                                    ],
                                })(
                                    <Input size = 'default' placeholder = "请输入提现金额" style = {{ width : '100%' }}/>
                                )}
                            </FormItem>
                            :
                            ''
                        }
                        <FormItem
                            { ...formItemLayout }
                            label = "实际到账"
                            extra={<div>
                                  将收取2%的提现手续费
                                </div>}
                            >
                            { getFieldDecorator('mentionReal' , {
                                initialValue : '',

                            })(
                                <span className={styles.mentionReal}>{ parseInt(getFieldValue('mentionShow')) * ( 1 - 0.02) || 0}</span>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "安全认证手机"
                        >
                            { getFieldDecorator('mentionPhone' , {
                                initialValue : mentionPhone1,
                            })(
                                <Input disabled size = 'default' style = {{ width : '100%' }} />
                            )}
                        </FormItem>
                        {
                            showAlertModal == true ?
                            <FormItem
                                { ...formItemLayout }
                                label = "验证码"
                            >
                                { getFieldDecorator('mentionPhoneVal' , {
                                    initialValue : undefined,
                                    rules : [
                                        { required : true , message : '请输入验证码' },
                                        { validator: checkNum },
                                    ],
                                })(
                                    <div>
                                        <Input size = 'default' style = {{ width : 140 }}/>
                                        <VeryCodeButton onClick={verificationCodeFunction}/>
                                    </div>
                                )}
                            </FormItem>
                            :
                            ''
                        }

                    </Form>
                </Modal>
                :
                ''
            }

            <AlertModal {...AlertModalNotice}/>
        </div>
    );
}

export default Form.create({})(AccountDetailsComponent);
