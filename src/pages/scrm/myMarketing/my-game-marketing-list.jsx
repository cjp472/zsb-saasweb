/*
 *  游戏列表
 */
import React from 'react';
import {Form, Input, Col, Row, Select, Button, Popconfirm, Table, message, Modal, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';
import QRCode from 'qrcode.react';
import TenantOrgSelect from '../../common/tenant-org-filter/TenantOrgFilter';
import styles from './changeModalsRightX.less';

const WxGamePageList = React.createClass({

	getInitialState() {
	    return {
	    	orgList						: [], 	//存储机构列表
	    	gameTypeList                : [],   //游戏名称类型列表
	    	isShowSearch				: false,//是否显示搜索组件
	    	gameModifyUrl               : '',   //修改URL
	    	addressUrl                  : '',   //游戏二位码
	    	modifyGameModalVisible      : false,//是否显示修改模态框
	    	dataDetailModalVisible      : false,//是否显示统计模态框
	    	addressUrlModalVisible      : false,//是否显示游戏二维码模态框

	    	pageIndex                   : 0,
			selectedRows                : [],
			selectedRowKeys             : [],

			filter: {						//过滤条件
				status: '1',				//过滤条件-状态 ''-全部状态  '1'-已上架   '2'-已下架
			},
			filterVisible: {
				status: false,
			}
	    };
	},

    componentDidMount() {
    	let self = this;

		//获取机构列表接口
    	serviceRequest( BASE_URL + '/microGame/getOrgNameList', { type : 1 },
			function(res) {
				self.setState({
					orgList : res.results,
				});
			},

			function(fai) {
				message.error( fai.errorMessage );
			}
    	);

		//获取游戏类型列表
		serviceRequest( BASE_URL + '/pmgame/query/infos/list' , { pageIndex : 0 , pageSize : 10000, status: '1' } ,
			function (res){
				self.setState({
					gameTypeList : res.results
				})
			}
		)

		self.searchButton('1');

		window.addEventListener('message', function(e){
			if( e.data == 'close' ){
				self.modifyGameCancel();
			}else if( e.data == 'closeAndLink' ){
				self.modifyGameOk();
			}
        }, false );

    },

    //筛选框是否可见
	screening() {
		this.setState({
			isShowSearch : !this.state.isShowSearch
		});
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
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
					|| status != undefined
					) {
						this.props.search({
							pageIndex : 0,
						    pageSize : 10,
						    orgId    : values.search_game_campus,
						    gameCode : values.search_game_type_name,
						    status   : status,
						    dataId   : values.search_game_id,
						    dataTitle : values.search_game_name,
						})
			} else {
				this.props.refreList(this.state.pageIndex);
			}
		});
	},

	//删除操作
	popConfirm( selectedRows ) {
		let self = this;
		let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameId = selectedRows[0].gameId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'delete', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
			 function(res){
				self.searchButton();
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		);
	},

	//上下架操作
	gameShelvesUp( selectedRows ) {
		let self = this;
		let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'update_status', tenantId : tenantId, orgId : orgId, gameCode: gameCode, dataId : dataId ,status : '1' } ,
			function(res){
				self.searchButton();
				message.success('上架成功');
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		)
	},

	gameShelvesDown( selectedRows ) {
		let self = this;
		let provider = selectedRows[0].provider;
		let tenantId = selectedRows[0].tenantId;
		let orgId = selectedRows[0].orgId;
		let gameCode = selectedRows[0].gameCode;
		let dataId = selectedRows[0].dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'update_status', tenantId : tenantId, orgId : orgId, gameCode: gameCode, dataId : dataId ,status : '2' } ,
			function(res){
				self.searchButton();
				message.success('下架成功');
				self.setState({
					selectedRows    : [],
					selectedRowKeys : [],
				})
			}
		)
	},

	//点击查看游戏地址
	gameAddress( record ) {
		let self = this;

		let provider = record.provider;
		let tenantId = record.tenantId;
		let gameCode = record.gameCode;
		let gameId = record.gameId;
		let orgId = record.orgId;
		let dataId = record.dataId;
		serviceRequest ( BASE_URL+'/pmgame/query/dispatch/action' , { service : provider+'/action', m : 'h5', tenantId : tenantId, orgId : orgId, gameId : gameId, gameCode: gameCode, dataId : dataId } ,
			function(res){
				self.setState({
					addressUrlModalVisible : !self.state.addressUrlModalVisible,
					addressUrl : res.data.url
				})
			}
		)
	},

	//关闭查看地址
	addressUrlClose(){
		this.setState({
			addressUrlModalVisible : !this.state.addressUrlModalVisible
		})
	},

	//修改操作,打开新增框
	gameModify(record) {

		let self = this;

		let provider = record.provider;
		let dataId = record.dataId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let orgName = this.mapOrgTypeList(orgId);
		let gameId = record.gameId;
		let expireTime = record.expireTime;
		let gameCode = record.gameCode;

		let gameModifyUrl = provider+'/page?m=create&tenantId='+tenantId+'&orgId='+orgId+'&gameCode='+gameCode+'&gameId='+gameId+'&dataId='+dataId;
		this.setState({
			gameModifyUrl : gameModifyUrl,
			modifyGameModalVisible : !this.state.modifyGameModalVisible
		});

		window.wActivityTimer = setInterval(function(){
			serviceRequest(
				BASE_URL + '/organController/getTenant', {}
			)
		}, 600000 )
	},

	//确认修改游戏
	modifyGameOk(){
		this.setState({
			modifyGameModalVisible : !this.state.modifyGameModalVisible,
			gameModifyUrl  : ''
		});
		clearInterval( window.wActivityTimer );
		this.searchButton();
	},

	//取消修改游戏
	modifyGameCancel(){
		this.setState({
			modifyGameModalVisible : !this.state.modifyGameModalVisible,
			gameModifyUrl  : ''
		});
		clearInterval( window.wActivityTimer );
	},


	//查看统计详情
	gameReviewDetail( record ){

		let provider = record.provider;
		let dataId = record.dataId;
		let gameId = record.gameId;
		let tenantId = record.tenantId;
		let orgId = record.orgId;
		let gameCode = record.gameCode;
		let dataDetailUrl = provider+'/page?m=data&dataId='+dataId+'&tenantId='+tenantId+'&orgId='+orgId+'&gameCode='+gameCode+'&gameId='+gameId;
		this.setState({
			dataDetailModalVisible : !this.state.dataDetailModalVisible,
			dataDetailUrl          : dataDetailUrl
		})
	},

	//关闭统计详情
	dataDetailClose(){
		this.setState({
			dataDetailModalVisible : !this.state.dataDetailModalVisible
		})
	},

	//主页分页改变
	pageChange( pagination, filters, sorter ) {

		let status = this.state.filter.status;

		this.props.form.validateFields((err, values) => {
			if(values.search_game_id != undefined
					|| values.search_game_name != undefined
					|| values.search_game_type_name != undefined
					|| values.search_game_campus != undefined
			) {
			let searchConditions = {
										pageIndex : pagination.current - 1,
									    pageSize : 10,
									    orgId    : values.search_game_campus,
									    gameCode : values.search_game_type_name,
									    status,
									    dataId   : values.search_game_id,
									    dataTitle : values.search_game_name
								    }
				this.props.pageSizeChangeCallBack( pagination.current - 1, searchConditions );
				this.setState({
					pageIndex : pagination.current-1
				})
			} else {
				this.props.pageSizeChangeCallBack( pagination.current - 1, {status, pageIndex: pagination.current - 1});
				this.setState({
					pageIndex : pagination.current-1
				})
			}
		});

	},

	//遍历游戏类型列表
	mapGameTypeList( gameCode ){
		if( this.state.gameTypeList && this.state.gameTypeList.length > 0 ){
			for ( let i = 0 ; i < this.state.gameTypeList.length; i++){
				if(  gameCode === this.state.gameTypeList[i].gameCode ){
					return this.state.gameTypeList[i].gameTitle;
				}
			}
		}
	},
	//遍历机构列表
	mapOrgTypeList ( orgId ){
		if( this.state.orgList && this.state.orgList.length > 0 ){
			for ( let i = 0 ; i < this.state.orgList.length; i++){
				if(  orgId === this.state.orgList[i].id ){
					return this.state.orgList[i].name;
				}
			}
		}
	},

	//选中多条数据
	onSelectChange( selectedRowKeys, selectedRows ) {
		this.setState({
			selectedRowKeys,
			selectedRows
		});
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

    render() {
		const { getFieldValue, getFieldProps, isFieldValidating, getFieldError, getFieldDecorator, } = this.props.form;
		const formItemLayout = {labelCol: { span: 4 }, wrapperCol: { span: 18 },};
		const { loading, selectedRowKeys, selectedRows,filter } = this.state;

		let statusTitleCont = (
			<span style={{cursor: 'pointer'}} onClick={()=>this.filterVIsibleChange('status')}>
				{filter.status == '' ? '全部状态' : filter.status == '1' ? '已上架' : filter.status == '2' ? '已下架' : '其他状态'}
			</span>
		);

		const columns = [
				{
	           	    title: '游戏名称' ,
	           	    dataIndex: 'dataTitle',
	           	    width: 200,
	           	    render: (text, record) => (
	           		    <div>
							<div style = {{ width : '80%', display : 'inline-block', verticalAlign : 'middle' }}>
								<a onClick = { this.gameModify.bind(this,record) } >{ record.dataTitle }</a>
							</div>
							<div style = {{ width : '20%', display : 'inline-block', textAlign : 'right', verticalAlign : 'middle' }}>
								<Icon style = {{ cursor : 'pointer' }} onClick = { this.gameAddress.bind(this,record) }  type = 'erweima' />
							</div>
						</div>
	           	    )
	           	},{
	           	    title: '游戏名称类型',
	           	    dataIndex: 'gameCode',
					width    : 120,
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{ this.mapGameTypeList(record.gameCode) || "" }</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: statusTitleCont,
	           	    width : 90,
	           	    dataIndex: 'status',
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
	           	    render: (text, record) => (
	           		    <div>
	           		    	<p>{record.status == 1 ? '已上架' : record.status == 2 ? '已下架' : '已删除'}</p>
	           		    </div>
	           	    )
	           	},{
	           	    title: '数据统计',
	           	    dataIndex: 'validUser',
	           	    width: 120,
	           	    render: (text, record) => (
	           		    <div>
	           		    	 <p>有效用户:{ record.amount }</p>
	           		    	 <p>浏览数:{ record.views }</p>
	           		    	 <a className={styles.game_address_a} onClick={this.gameReviewDetail.bind(this,record)}>查看详情</a>
	           		    </div>
	           	    )
	           	},{
	           	    title: '校区',
	           	    dataIndex: 'orgId',
					width    : 180,
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{ this.mapOrgTypeList( record.orgId ) || "" }</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '游戏时间',
	           	    dataIndex: 'startTime',
					width     : 160,
	           	    render: (text, record) => (
	           		    <span>
	           		      	<p>{record.startTime + ' ~ ' + record.endTime}</p>
	           		    </span>
	           	    )
	           	},{
	           	    title: '创建时间',
					width : 180,
	           	    dataIndex: 'createTime',
	           	}];

		let selectOptions = [];
		if(this.state.orgList&&this.state.orgList.length>0) {
			selectOptions = this.state.orgList.map(function (item, index) {
		    	let name = item.name;
		    	return <Option key={'opt_org_'+index} value={item.id + ''} id={item.id}>{name}</Option>
		    });
		};

		//游戏类型列表
		let gameTypeListOptions = [];
		if( this.state.gameTypeList && this.state.gameTypeList.length>0 ){
			gameTypeListOptions = this.state.gameTypeList.map(function( item , index ){
				let name = item.gameTitle;
				return <Option key={'opt_game_type_'+index} value = { item.gameCode + '' }>{ name }</Option>
			})
		};

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
								<Form className="ant-advanced-search-form">
									{/*
									<FormItem style={{ float : 'left', marginRight : '30px' }} >
										{getFieldDecorator('search_game_campus') (
											<TenantOrgSelect
												style = {{ width : '100%' }}  />
										)}
									</FormItem>
									*/}
                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_id') (
                                        <Input 	placeholder='编号'
                                                id='search_game_id'
                                                type="number"
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_name') (
                                        <Input 	placeholder={'游戏名称'}
                                                id='search_game_name'
                                                style={{width:120}} />
										)}
                                    </FormItem>

                                    <FormItem style={{float:'left',marginRight:'30px'}}>
										{getFieldDecorator('search_game_type_name') (
                                        <Select placeholder={ '游戏类型名称' }
                                                size="default"
                                                id="search_game_type_name"
                                                style={{width:120}} >
                                                    { gameTypeListOptions }
                                        </Select>
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
								<Popconfirm title = "确认要上架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesUp.bind( this, selectedRows ) } >
									{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >上架</a> }
								</Popconfirm>
								{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >下架</a> }
								<Popconfirm title = "确认要下架么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.gameShelvesDown.bind( this, selectedRows ) } >
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
						    rowKey="instId"
				    		columns={ columns }
				    		rowSelection={{
								selectedRowKeys: selectedRowKeys,
								onChange: this.onSelectChange,
								getCheckboxProps: record => ({
									disabled: record.isHq === 1
								})
							 }}
				    		dataSource={ this.props.dataSource.length > 0 ? this.props.dataSource : [] }
							locale={{ emptyText:'暂无数据' }}
							scroll={{ x : 1050 }}
				    		pagination={{
								size : 'default',
				    			pageSize: 10,
				    			total: this.props.dataPage && this.props.dataPage.resultCount,
				    			current:this.props.dataPage && this.props.dataPage.pageIndex + 1,
                                showTotal:total => `共 ${total} 条` ,
                            }}
			 					onChange={this.pageChange} />
	    	        </div>
    				<Modal
    					visible = { this.state.modifyGameModalVisible }
    					title = "修改微游戏"
    					width = "940"
    					onCancel = { this.modifyGameCancel }
    					maskClosable = { false }
                        className='micro_game_form_modal'
        				footer = { null } >
    						<iframe src = { this.state.gameModifyUrl } frameBorder="0" width="917" height="100%" marginHeight="0" marginWidth="0" scrolling="auto"></iframe>
    				</Modal>
    				<Modal
    					visible = { this.state.addressUrlModalVisible }
    					width = "335"
    					maskClosable = { false }
    					onCancel = { this.addressUrlClose }
    					footer = { null }
                        className = 'zj_changeModalsRightX'>
                            <div style = {{ marginTop : '24px'}} className={styles.game_search_base_create_ui_div_po_qr_code_div}>
                                <QRCode value = { this.state.addressUrl } size = { 300 } />
                                <p style = {{ marginBottom : '5px' }} className={styles.game_search_base_create_ui_div_po_qr_code_div_wx_title}>请用微信扫一扫</p>
                                <Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.state.addressUrl } />
                                <Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
                            </div>
    				</Modal>
    				<Modal
    					visible = { this.state.dataDetailModalVisible }
    					title = "数据统计"
    					width = "940"
    					maskClosable = { false }
    					onCancel = { this.dataDetailClose }
    					footer = {[
    						<Button key = "dataDetailClose" type = "ghost" size = "large" onClick = { this.dataDetailClose }>关闭</Button>
    					]} >
    						<iframe src = { this.state.dataDetailUrl } frameBorder="0" width="917" height="600" marginHeight="0" marginWidth="0" scrolling="auto" ></iframe>
    				</Modal>
    			</div>
    		);
		}
})

/*
 *	游戏二维码
 */
const ReviewGameAddressQr = React.createClass({

    getInitialState() {
		return {
		    qrcodeIsInit: false
		};
    },

    getQr(url) {
    	let element = document.getElementById('gameQrCode');
    	element.innerHTML = "";
    	if(!this.state.qrcodeIsInit) {
			var qrcode_modal = new QRCode(document.getElementById('gameQrCode'), {
			    width 	: 300,
			    height 	: 300
			});
			qrcode_modal.makeCode(url);
			this.setState({
				qrcodeIsInit : false
			});
		}
    },

    copyLink(){
    	var copyobject=document.getElementById("copy-content");
	    copyobject.select();
	    document.execCommand("Copy");
	    message.success('复制成功');
    },
    componentDidMount() {
		this.getQr(this.props.url);
    },

    componentWillReceiveProps(nextProps) {
		this.getQr(nextProps.url);
    },

    render() {
		return (
			 <div style = {{ marginTop : '24px'}} className={styles.game_search_base_create_ui_div_po_qr_code_div}>
			        <div className={styles.qrcode-image} id = "gameQrCode" ></div>
			  	<p style = {{ marginBottom : '5px' }} className={styles.game_search_base_create_ui_div_po_qr_code_div_wx_title}>请用微信扫一扫</p>
			  	<Input  style = {{ width : '72%' }} type = 'text' id = 'copy-content' value = { this.props.url } />
			  	<Button type = 'primary' style = {{ width : '26%' ,marginLeft : '2%' }} id = "copyLink" onClick = { this.copyLink }>复制地址</Button>
			 </div>
		 )
    }
});
//{ selectedRowKeys && selectedRowKeys.length != 1 && <a disabled style = {{ marginLeft : '10px' }} >删除</a> }
//<Popconfirm title = "确认要删除么?" placement = "top" okText = "确认" cancelText = "取消" onConfirm = { this.popConfirm.bind( this, selectedRows ) } >
//	{ selectedRowKeys && selectedRowKeys.length == 1 && <a style = {{ marginLeft : '10px' }} >删除</a> }
//</Popconfirm>
export default Form.create()(WxGamePageList);
