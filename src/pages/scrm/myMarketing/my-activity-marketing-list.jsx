/*
 * 活动列表
 */
import React from 'react';
import {Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import MicroActivityTemplate from '../microActivity-template/template-instance-form';  //修改微活动界面
import CodeModalActivity from '../microActivity-template/codeModal';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';

import { connect } from 'dva';
import MicroModuleForm from '../micro-module/MicroModuleForm';//自定义的微模板 机构配置界面

import MicroLeafletTemplate from '../microLeaflet-template/template-microLeaflet-instance-form';
import CodeModalLeaflet from '../microLeaflet-template/codeModal';

import styles from './changeModalsRightX.less';

const WxActivityList = React.createClass({

	getInitialState() {
	    return {
	    	value						: '', 	  //设置输入框的值
	    	showReviewActivityAdd		: false,  //查看游戏二维码
	    	showReviewStatistical		: false,  //查看统计
	    	gameQrUrl					: '', 	  //记录当前点击的游戏url
	    	statisticalDataSource 		: [], 	  //存放统计数据
	    	statisticalData				: {},	  //存放统计分页
	    	statisticalId				: '', 	  //记录当前点击的统计id
	    	isShowSearch				: false,  //是否显示搜索组件
	    	orgList						: [], 	  //存储机构列表
	    	activityFormVisible         : false,  //创建微活动实例
			leafletFormVisible          : false,  //创建微传单实例
	    	activityId                  : "",     //获取当前点击的微活动ID
	    	activityTypeId              : "",     //获得模板id
	    	activityCode                : "",     //微活动实例编码
	    	codeModalVisible            : false,  //二维码模态框
	    	currentSelectCampus         : '',     //校区
			categoryId					:'',      //模板类型
	    	validnum					: '',     //记录上一界面传入的有效用户
	    	pageIndex                   : 0,
			statisticalPageIndex		: 0,
			selectedRowKeys             : [],
			selectedRows                : [],
			loading                     : false,

			filter: {						//过滤条件
				status: '1',				//过滤条件-状态 ''-全部状态  '1'-已上架   '2'-已下架
			},
			filterVisible: {
				status: false,
			},

			dataViewOrgId: '',//数据详情的orgid
	    };
	},

	componentDidMount() {
		this.searchButton();
	},

	//数据请求(status= 1:（包含首页列表数据和搜索列表数据） 2:上下架 3:删除 4:统计  5: 退款)
    requestData( parameter, url, status ) {
		let self = this;

		serviceRequest(
			url,
			parameter,
			function(res) {
				switch(status){
					case 1:
						break;
					case 2:
						self.searchButton();
						if(parameter.status == '1'){
							message.success('上架成功')
						}else if ( parameter.status == '2'){
							message.success('下架成功')
						}
						self.setState({
							loading : false,
							selectedRows    : [],
							selectedRowKeys : [],
						})
						break;
					case 3:
						self.searchButton();
						self.setState({
							loading : false,
							selectedRows    : [],
							selectedRowKeys : [],
						})
						break;
					case 4:
						self.changeStatus({
							statisticalData 		: res.data,
							statisticalDataSource	: res.results,
							loading                 : false
						});
						break;
					case 5:
						Modal.success({
							title: '退款成功'
						});
						//重新查询数据详情
						self.requestOperation(self.state.statisticalId, self.state.statisticalPageIndex || 0);
						break;
					default:
				}
			},

    		function(fai) {
				message.error(fai.errorMessage);
    		});
    },

    //封装统计详情请求
    requestOperation(record, pageIndex) {
		this.requestData(
				{
					orgId		: window._current_user_info && window._current_user_info.orgId,
					id 			: record || '',
					pageIndex  	: pageIndex,
					pageSize 	: 6,
				},
				BASE_URL + '/microActivity/findDetail',
				4)
    },

    changeStatus(changeObj) {
    	this.setState(
    		changeObj
    	);
    },

    //重置搜索条件
	resetButton() {
		this.props.form.resetFields();
		this.props.refreList();
	},
	//搜索游戏
	searchButton(status) {

		status = status == undefined ? this.state.filter.status : status;

		this.props.form.validateFields((err, values) => {
			if(values.search_activity_id != undefined
					|| values.search_activity_name != undefined
					|| values.search_activity_type_name != undefined
					|| values.search_activity_campus != undefined
					|| status != undefined
					) {
						this.props.search({
							type 		: '1',
							id 			: values.search_activity_id,
							name		: values.search_activity_name,
							title		: values.search_activity_type_name,
							status,
							pageSize	: 10,
							pageIndex	: 0,
							organId		: values.search_activity_campus}
						);
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除数据警告提示
	popConfirm( selectedRows ) {
		this.setState({
			loading : true
		})
		this.requestData(
			{
				type 		: '1',
				status 		: '0',
				ids 		: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			3
		);
	},
	//取消数据警告
	popCancel(record) {

	},
	//上下架操作
	activityShelvesUp( selectedRows ) {
		this.setState({
			loading : true
		});
		this.requestData(
			{
				type 	: '1',
				status	: '1',
				ids 	: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
	},
	activityShelvesDown( selectedRows ) {
		this.setState({
			loading : true,
		});
		this.requestData(
			{
				type 	: '1',
				status	: '2',
				ids 	: selectedRows[0].id,
			},
			BASE_URL + '/microActivity/updateStatus',
			2
		);
	},

	//修改操作
	activityModify(record) {
        let {id, type, orgId, orgName, activityId, } = record;
        window.wActivityTimer = setInterval(function(){
            serviceRequest(
                BASE_URL + '/organController/getTenant', {}
            )
        }, 600000 );

        //打开 高级模板的创建窗口
		if(record.categoryId == '1'){
			if(type == undefined || type == '') {
				let me = this;
				this.changeStatus({activityFormVisible : true, activityId : record.id , currentSelectCampus : record.orgName });

				if( this.state.activityId ){
					serviceRequest( BASE_URL+"/microActivity/getActivity", { id : record.id }, function(res) {
						let activityTypeId = res.data.activityData.activityId;
						me.setState({
							activityTypeId : activityTypeId,
							activityFormVisible :true,
						});
					});
				}
			} else {
				this.props.dispatch && this.props.dispatch({
					type: 'microModuleFormModel/handleShow',
					payload: {
						moduleId: activityId,
						moduleInstId: id,
						orgId: orgId,
						orgName: orgName,
						afterFormSubmit: ()=> {
							clearInterval( window.wActivityTimer );
							window.wActivityTimer = null;
						}
					}
				});
			}
		}
		if(record.categoryId == '2'){
			 if(type == undefined || type == '') {
				let me = this;
				this.changeStatus({leafletsFormVisible   : true,   leafletsId : record.id , currentSelectCampus : record.orgName});
				if( this.state.leafletsId){
					serviceRequest( BASE_URL + "/microActivity/getActivity", { id : record.id }, function(res) {
						let leafletsTypeId = res.data.activityData.activityId;
						me.setState({
							activityId: record.id,
							leafletsTypeId : leafletsTypeId,
							leafletFormVisible :true,
						});
					});
				}
			} else {
				this.props.dispatch && this.props.dispatch({
					type: 'microModuleFormModel/handleShow',
					payload: {
						moduleId: activityId,
						moduleInstId: id,
						orgId: orgId,
						orgName: orgName,
						afterFormSubmit: ()=> {
							clearInterval( window.wActivityTimer );
							window.wActivityTimer = null;
						}
					}
				});
			}

		}
		this.setState({
             categoryId : record.categoryId,
        });
	},

	//主页分页改变
	pageChange(pagination, filters, sorter) {
		let status = this.state.filter.status;

		this.props.form.validateFields((err, values) => {
			if(values.search_activity_id != undefined
					|| values.search_activity_name != undefined
					|| values.search_activity_status != undefined
					|| values.search_activity_type_name != undefined
					|| values.search_activity_campus != undefined
			) {
			let searchConditions =	{
										type 		: '1',
										id 			: values.search_activity_id,
										name		: values.search_activity_name,
										title		: values.search_activity_type_name,
										status,
										pageSize	: 10,
										pageIndex	: pagination.current - 1,
										organId		: values.search_activity_campus
									}
			this.props.pageSizeChangeCallBack(pagination.current - 1, searchConditions);
			this.setState({
				pageIndex : pagination.current-1
			})
			} else {
				this.props.pageSizeChangeCallBack(pagination.current - 1, {status, pageIndex: pagination.current - 1});
				this.setState({
					pageIndex : pagination.current-1
				})
			}
		});

	},
	//搜索输入操作
	inputgameIdChange(e) {
		this.changeStatus({ value : e.target.value });
	},
	//点击统计详情
	gameReviewDetail(record) {
		this.changeStatus({
			showReviewStatistical : !this.state.showReviewStatistical,
			statisticalId : record.id,
			validnum : record.validnum,
			dataViewOrgId: record.orgId,
		});
		this.requestOperation(record.id, this.state.pageIndexDefault || 0);
	},
	//点击统计详情取消
	changeGameStatisticalCancel() {
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical, dataViewOrgId: ''});
	},
	//点击统计详情确定
	changeStatisticalOK() {
		this.changeStatus({showReviewStatistical : !this.state.showReviewStatistical});
	},
	//选中多条数据
	onSelectChange( selectedRowKeys, selectedRows ) {
		this.setState({
			selectedRowKeys,
			selectedRows
		});
	},
	//点击活动地址
	activityAddress(record) {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd,gameQrUrl : record.activityUrl});
	},
	//查看活动二维码地址取消
	activityAddQrCodeCancel() {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd});
	},
	//查看活动二维码地址确定
	activityAddQrCodeOk() {
		this.changeStatus({showReviewActivityAdd : !this.state.showReviewActivityAdd});
	},
	//统计页面分页改变
	statisticalChangePage(pagination, filters, sorter) {
		this.changeStatus({ statisticalPageIndex: pagination.current - 1 });
		this.requestOperation(this.state.statisticalId, pagination.current - 1);
	},
	//进行刷新数据
	tableListRefresh() {

	},
	//筛选
	screening() {
		this.changeStatus({isShowSearch : !this.state.isShowSearch});
	},
	//导出表格
	exportData(record) {
		window.open(BASE_URL +'/microActivity/zsbexport?id='+record);
	},
	inputgameNameChange(e) {
		this.changeStatus({value: e.target.value});
	},
	inputgameTypeNameChange(e) {
		this.changeStatus({value: e.target.value});
	},
	inputgameIdChange(e) {
		this.changeStatus({value: e.target.value});
	},
	//关闭创建微活动
	changeTempletInstanceFormVisible(){
		this.setState({
			activityFormVisible : false,
			leafletFormVisible : false
		});
		clearInterval( window.wActivityTimer );
		window.wActivityTimer = null;
	},

	//二维码模态框
	changeCodeModalVisible(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible
		});
	},

	//确认二维码,关闭窗口
	onConfirmCodeModal(){
		this.setState({
			codeModalVisible : !this.state.codeModalVisible,
			activityFormVisible : false,
			leafletFormVisible : false
		})
		this.props.getActivityListRefresh(this.state.pageIndex)
	},

	//传递二维码地址
	diliverCode( url ){
        this.setState({
            codeUrl : url
        })
	},

    //复制地址
    copyLink(){
        var copyobject=document.getElementById("copy-content");
        copyobject.select();
        document.execCommand("Copy");
        message.success('复制成功');
    },

	filterVIsibleChange(type) {
		let filterVisible = this.state.filterVisible;
		filterVisible[type] = true;
		this.setState({
			filterVisible,
		});
	},

	filterListByStatus(status) {

		let filter = this.state.filter;
		let filterVisible = this.state.filterVisible;
		filter.status = status;
		filterVisible.status = false;
		this.setState({
			filter,filterVisible,
		});

		this.searchButton(status)
	},

	//退款操作
	giveBackMoney(record) {
		this.requestData(
			{
				dataId 		: record.id || '',
				orgId		: this.state.dataViewOrgId,
			},
			BASE_URL + '/microActivity/refund',
		5);
	},

	//渲染
	render() {
		const {getFieldValue, getFieldProps, isFieldValidating, getFieldError, getFieldDecorator} = this.props.form;
		const formItemLayout = {labelCol: { span: 5 }, wrapperCol: { span: 19 },};
		const { loading, selectedRowKeys, selectedRows,filter} = this.state;

		let statusTitleCont = (
			<span style={{cursor: 'pointer'}} onClick={()=>this.filterVIsibleChange('status')}>
				{filter.status == '' ? '全部状态' : filter.status == '1' ? '已上架' : filter.status == '2' ? '已下架' : '其他状态'}
			</span>
		);

		let me = this;

		const statisticalColumns =
					[{
			    	title  : '编号',
			    	width  : 50,
			    	render : (text, record, index) => (
						<p>{ index + 1 + 6 * this.state.statisticalData.pageIndex }</p>
			    	)
					},{
						title     : '提交时间',
						dataIndex : 'createTime',
					},{
						title     : '学员姓名',
						dataIndex : 'nickname',
					},{
						title     : '学员生日',
						dataIndex : 'birthday'
					},{
						title     : '手机号',
						dataIndex : 'mobile',
					},{
						title     : '备注',
						dataIndex : 'note',
					},{
						title	  : '支付金额',
						dataIndex : 'payAmount',
					},{
						title     : '支付状态',
						dataIndex : 'payStatus',
						render: function(text, record) {

							let payStatus = record.payStatus;
							return (
								<div key={'handle_' + record.id} className={styles.table_handle_cont}>
									{!!(payStatus == '1') &&
										<span key="tuikuan">已支付</span> }
									{!!(payStatus == '2') && <span key="yituikuan" >已退款</span> }
								</div>
							)
						}
					},{
						title     : '操作',
						dataIndex : 'handle',
						render: function(text, record) {

							let payStatus = record.payStatus;
							return (
								<div key={'handle_' + record.id} className={styles.table_handle_cont}>
									{!!(payStatus == '1') &&
									<Popconfirm key="tuikuan" title="确定要退款吗?" onConfirm={()=>me.giveBackMoney(record)}>
										<a key="tuikuan" className={styles.table_handle_a} >退款</a>
									</Popconfirm>}
								</div>
							)
						}
					}];

		const columns = [
				{
	           	    title     : '活动名称',
	           	    dataIndex : 'gamename',
	           	    width     : 180,
	           	    render    : (text, record) => (
						<div>
							<div style = {{ width : '80%', display : 'inline-block', verticalAlign : 'middle' }}>
								<a onClick = { this.activityModify.bind(this,record) } >{ record.name }</a>
							</div>
							<div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick={ this.activityAddress.bind(this,record) }  type = 'erweima' />
							</div>
						</div>
	           	    )
	           	},{
					title: statusTitleCont,
	           	    dataIndex : 'status',
	           	    width     : 100,
					filterIcon: (
						<Icon type="caret-down" />
					),
					filterDropdownVisible: this.state.filterVisible.status,
					onFilterDropdownVisibleChange: ()=>{this.filterVIsibleChange('status')},
					filterDropdown: (
						<div className={styles.list_filter_cont}>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('')}>全部状态</div>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('1')}>已上架</div>
							<div className={styles.list_filter_item} onClick={()=>this.filterListByStatus('2')}>已下架</div>
						</div>
					),
	           	    render    : (text, record) => (
	           		    <div>
	           		    	<p>{record.status == 1 ? '已上架' : record.status == 2 ? '已下架' : '已删除'}</p>
	           		    </div>
	           	    )
	           	},{
	           	    title     : '数据统计',
	           	    dataIndex : 'validUser',
	           	    width     : 120,
	           	    render    : (text, record) => (
	           		    <div>
	           		    	<p>有效用户:{record.validnum}</p>
								  <a className={styles.game_address_a} onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a>
	           		    </div>
	           	    )
	           	},{
	           	    title     :'活动名称类型',
	           	    dataIndex : 'gameTitle',
                    width     : 150,
	           	    render    : (text, record) => (
	           		    <span>
	           		      	<p>{record.title}</p>
	           		    </span>
	           	    )
	           	},{
	           	    title     : '校区',
	           	    dataIndex : 'orgName',
					width     : 180,
					render: (text, record) => (
						<span>
							<p>{window._current_user_info.orgName || record.orgName}</p>
						</span>
					)
	           	},{
	           	    title     : '创建时间',
	           	    dataIndex : 'createTime',
                    width     : 180,
	           	}];

		let selectOptions = [];
		if(this.state.orgList&&this.state.orgList.length>0) {
			selectOptions = this.state.orgList.map(function (item, index) {
		    	let name = item.name;
		    	return <Option value={ item.id } id={item.id}>{name}</Option>
		    });
		};

		let modalActOpts = {
            title : '修改微活动',
            formVisible : this.state.activityFormVisible ,
            changeTempletInstanceFormVisible : this.changeTempletInstanceFormVisible,
			activityId : this.state.activityId,
            activityTypeId : this.state.activityTypeId,
            activityCode : this.state.activityCode ,
            callbackRefresh : this.tableListRefresh,
            changeCodeModalVisible : this.changeCodeModalVisible,
            diliverCode : this.diliverCode,
            currentSelectCampus : this.state.currentSelectCampus
        }

        let modalLeaOpts = {
            title : '修改微传单',
            formVisible : this.state.leafletFormVisible ,
            changeTempletInstanceFormVisible : this.changeTempletInstanceFormVisible,
			activityId : this.state.activityId,
            activityTypeId : this.state.activityTypeId,
            activityCode : this.state.activityCode ,
            callbackRefresh : this.tableListRefresh ,
            changeCodeModalVisible : this.changeCodeModalVisible,
            diliverCode : this.diliverCode,
            currentSelectCampus : this.state.currentSelectCampus
        }
    	return (
    			<div className={styles.game_base_list_div}>
    				<div className={styles.game_base_list_search_div}>
    				<QueueAnim
						type={['top', 'top']}
    					ease={['easeOutQuart', 'easeInOutQuart']}
						className="common-search-queue" >
	    				{
							this.state.isShowSearch ? [
								<div className={styles.game_base_list_search_ani_div} key="common-search-queue-key-search">
								<Form horizontal className="ant-advanced-search-form">
									{/*
									<FormItem style={{ float:'left', marginRight:'30px' }} >
										{getFieldDecorator('search_activity_campus') (
										<TenantOrgSelect
											style = {{ width : '100%' }} />
										)}
									</FormItem>
									*/}
                                    <FormItem style={{ float:'left',marginRight:'30px' }}>
										{getFieldDecorator('search_activity_id') (
                                        <Input 	placeholder='编号'
                                                onChange={this.inputgameIdChange}
                                                id='search_activity_id'
                                                type="number"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_activity_name') (
                                        <Input 	placeholder='活动名称'
                                                onChange={this.inputgameNameChange}
                                                id='search_activity_name'
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_activity_type_name') (
                                        <Input 	placeholder='活动类型名称'
                                                onChange={this.inputgameTypeNameChange}
                                                id="search_activity_type_name"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                <Button type="ghost" onClick={this.resetButton} style={{float:'right',backgroundColor:'#fff',marginTop:'10px',marginLeft:'10px'}}>清除条件</Button>
                                <Button type="primary" onClick={()=>this.searchButton()} style={{float:'right',marginTop:'10px'}}>搜索</Button>
								</Form>
							</div>]:null}
    					</QueueAnim>
		    	        <div className={styles.game_base_list_search_div_button_creategame}>
							<div className = {styles.yhwu_operation_left}>
								<span>操作 : </span>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >上架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >上架</a> }
								</Popconfirm>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >下架</a> }
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.activityShelvesDown.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >下架</a> }
								</Popconfirm>
							</div>
							<div className = {styles.yhwu_operation_right} >
		    					<Button type = "primary" onClick = { this.screening } style = {{ marginTop : '20px' }}><Icon type = "filter" />筛选</Button>
							</div>
		    			</div>
	    	        </div>

	    	        <div className="game_base_list_search_div_table">
		    	        <Table bordered
							size = 'small'
				    		columns = { columns }
							//rowSelection = { rowSelection }
							rowSelection = {{
								selectedRowKeys  : selectedRowKeys,
								onChange: this.onSelectChange,
								getCheckboxProps: record => ({
									disabled: record.isHq === 1
								})
							}}

							rowKey="id"
				    		dataSource = { this.props.dataSource.length > 0 ? this.props.dataSource : [] }
							locale = {{ emptyText:'暂无数据' }}
							scroll = {{ x : 910 }}
				    		pagination = {{
								size : 'default',
				    			pageSize: 10,
				    			total: this.props.dataPage&&this.props.dataPage.resultCount,
				    			current:this.props.dataPage&&this.props.dataPage.pageIndex + 1,
                                showTotal:total => `共 ${total} 条` ,
                            }}
			 				onChange={this.pageChange}
		    	        />
	    	        </div>
		    	    <div>
	    				<Modal
	    					visible = { this.state.showReviewActivityAdd }
	    					width = "335"
	    					maskClosable = { false }
	    					onCancel = { this.activityAddQrCodeCancel }
	    					footer = { null }
                            className = 'zj_changeModalsRightX'>
                                <div style = {{ marginTop : '24px'}} className={styles.game_search_base_create_ui_div_po_qr_code_div}>
                                    <QRCode value = { this.state.gameQrUrl } size = { 300 } />
                                    <p style = {{ marginBottom : '5px' }} className={styles.game_search_base_create_ui_div_po_qr_code_div_wx_title}>请用微信扫一扫</p>
                                    <Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.state.gameQrUrl } />
                                    <Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
			                    </div>
	    				</Modal>
    				</div>

    				<Modal
	    				visible={this.state.showReviewStatistical}
						key='showReviewStatistical'
	        			title="数据统计"
	        			width='700'
	        			onCancel={this.changeGameStatisticalCancel}
	        			footer={[<Button size = 'default' key="save" type="primary" onClick={this.changeStatisticalOK}>确定</Button>]}>
	    					<div className="game_search_base_create_ui_div_statistical">
	    						<Button type="primary" disabled={this.state.statisticalDataSource.length > 0 ? false : true} onClick={this.exportData.bind(this,this.state.statisticalId)}>导出数据</Button>
		    					<div className={styles.game_search_base_create_ui_div_statistical_p_div}>
		    				 		<p className={styles.game_search_base_create_ui_div_statistical_p_div_left_p_activity}>
		    				 			有效用户：{this.state.validnum}
		    				 		</p>
		    				 	</div>
		    				 	<Table
									className = 'dataModal'
		    				 		size="small"
		    				 		columns={statisticalColumns}
		    				 		dataSource={this.state.statisticalDataSource}
		    						locale={{emptyText:'暂无数据'}}
		    				 		pagination={{
		    				 			pageSize: 6,
		    				 			total: this.state.statisticalData.resultCount,
		    				 			current:this.state.statisticalData&&this.state.statisticalData.pageIndex + 1,
                                        showTotal:total => `共 ${total} 条`
                                    }}
		    				 	    onChange={this.statisticalChangePage}
		    				 	/>
	    				 	</div>
    				 </Modal>
    				<MicroActivityTemplate {...modalActOpts}/>
					<MicroLeafletTemplate {...modalLeaOpts}/>
					{this.state.categoryId == '1' ? <CodeModalActivity url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
                                    onConfirmCodeModal = { this.onConfirmCodeModal } /> : ''}

					{this.state.categoryId == '2' ? <CodeModalLeaflet url = { this.state.codeUrl } codeModalVisible = { this.state.codeModalVisible }
                                    onConfirmCodeModal = { this.onConfirmCodeModal } /> : ''}
                    <MicroModuleForm />
    			</div>
    		);
		}
});
//{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >删除</a> }
//<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.popConfirm.bind( this, selectedRows ) } >
//	{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >删除</a> }
//</Popconfirm>
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Form.create()(WxActivityList));
