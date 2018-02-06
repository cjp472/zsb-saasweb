import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Checkbox, Upload, Icon, Radio } from 'antd';
import style from './OrgManage.less';
import ChinaDivision from './CascaderAddressOptions';
import MapViewComponent from '../org-map/OrgMap';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const Dragger = Upload.Dragger;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: { span: 2 } ,
    wrapperCol: { span: 14 },
};

const formItemLayoutWithoutLabel = {
    wrapperCol : {
        span   : 14,
        offset : 2,
    }
}

/*新增编辑校区modal*/
const OrgManageAddOrEditOrg = ({
    addOrEditOrgModalType,                  //新增编辑校区类型('add'/'edit')
    addOrEditOrgModalVisible,               //新增编辑校区modal是否显示
    addOrEditOrgModalButtonLoading,         //新增编辑校区modal按钮是否在加载状态
    addOrEditOrgModalSelectData,            //新增编辑校区三个checkbox的选项
    addOrEditOrgModaDisplayImg,             //用于显示回填的图片数组(包括uid,url,name,thumbUrl)
    addOrEditOrgModalData,                  //编辑校区时回填数据

    PushNewPic,                             //批量上传图片onChange方法将url放到addOrEditOrgModalPicArray数组中
    RemovePic,                              //移除已上传图片事件
    AddOrEditOrgModalSubmit,                //新增编辑校区提交
    AddOrEditOrgModalCancel,                //新增编辑校区modal关闭

	selectProvincesCityArea,
	selectdetailAddress,
	updateProvincesCityArea,				//更新省市区属性
	updateAddress,							//更新详细地址
	updateLocationFun,						//更新按钮

    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
        setFieldsValue,
    },
  }) => {

    function handleComplete(e) {
		/*不严谨,请求失败的时候回出现问题*/
		_mapNoChange = true;
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();

            //处理师资力量
            let teacherDetail = data.teachers;
            let teachers = [];
            teacherDetail && teacherDetail.map(function(item, index){
                let teacherImg = getFieldValue([ 'teachImg_' + item.key ]);
                let teacher = '';
                if ( teacherImg && teacherImg.length > 0 ){
                    let teacher_cover_item = teacherImg[0];
                    let teacher_cover_item_res = teacher_cover_item.response;
                    if ( teacher_cover_item_res && teacher_cover_item_res.errorCode == 9000 ){
                        teacher = teacher_cover_item_res.data.url;
                    } else {
                        teacher = teacher_cover_item.url || '';
                    }
                };
                teachers.push({
                    teacherName : getFieldValue([ 'teachName_' + item.key ]),
                    teacherIntro : getFieldValue([ 'teachIntro_' + item.key ]),
                    teacherImg   : teacher
                })
				delete data['teachName_'+item.key];
				delete data['teachIntro_'+item.key];
				delete data['teachImg_'+item.key];
            });
            data.teachers = JSON.stringify( teachers );

            //处理编辑时id传递
            if( addOrEditOrgModalType == 'edit' ){
                data.id = addOrEditOrgModalData.id;
            }

            //处理省市区
            if(data.addrColumn[0] == '' || data.addrColumn[0] == null || data.addrColumn[0] == undefined){
                message.warn('请填写所在地址');
                return;
            }
            if((data.addrColumn[1] == '' || data.addrColumn[1] == null || data.addrColumn[1] == undefined) && (data.addrColumn[2] != '' || data.addrColumn[2] != null || data.addrColumn[2] != undefined)){
                message.warn('请填写所在地址');
                return;
            }

            data.privince = data.addrColumn[0];
            if(data.addrColumn[1] != null && data.addrColumn[1] != undefined && data.addrColumn[1] != ''){
                if(data.addrColumn[1] == '市辖区' || data.addrColumn[1] == '县'){
                    data.city = data.addrColumn[0];
                }else{
                    data.city = data.addrColumn[1];
                }
            }else{
                data.city = '';
            }
            if(data.addrColumn[2] != null && data.addrColumn[2] != undefined && data.addrColumn[2] != ''){
                if(data.addrColumn[2] == '市辖区' || data.addrColumn[2] == '县'){
                    data.area = data.addrColumn[1];
                }else{
                    data.area = data.addrColumn[2];
                }
            }else{
                data.area = '';
            }
            data.addrColumn = JSON.stringify(getFieldValue('addrColumn'));

			if(_mapNewLng>0&&_mapNewLat>0) {
			   	data.log = _mapNewLng;
				data.lat = _mapNewLat;
			}
            //处理机构种类
            data.categoryTag = (data.categoryTag).join(',');

            //处理适合年龄
            //data.ageTag = (data.ageTag).join(',');

            //处理配套设施
            data.utilityTag = (data.utilityTag).join(',');

			let imgUrl = '';
			if( !!data.schoolLogo && data.schoolLogo.length > 0){
				if( data.schoolLogo[0].url ){
					imgUrl = data.schoolLogo[0].url;
				}else if(data.schoolLogo[0].response.data.url){
					imgUrl = data.schoolLogo[0].response.data.url;
				}
			}
			data.schoolLogo = imgUrl;

			//处理经纬度
            AddOrEditOrgModalSubmit(data);

			clearInterval( window.wActivityTimer );
        });
    }

    function handleCancel(e) {
		_mapNoChange = true;
        e.preventDefault();
        resetFields();
        AddOrEditOrgModalCancel();
		clearInterval( window.wActivityTimer );
    }

    //模态框的属性
    let modalOpts = {
        title: addOrEditOrgModalType == 'add'? '新增校区' : '编辑校区',
        maskClosable : false,
        visible : addOrEditOrgModalVisible,
        closable : true,
        width : 900,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}> 取 消 </Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={addOrEditOrgModalButtonLoading}
                    loading={addOrEditOrgModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_org_manage_modal',
    };

    let addrColumn = [];
    if(addOrEditOrgModalData && addOrEditOrgModalData.addrColumn){
        addrColumn = JSON.parse(addOrEditOrgModalData.addrColumn)
    }

    let imgurlUploadProps = {
        name: 'file',
        multiple: true,
        action: `${BASE_URL}/uploadController/upload`,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange:PushNewPic,
        onRemove:RemovePic,
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不大于2M!');
                return false;
            }
            return true;
        },
        defaultFileList : addOrEditOrgModalType == 'edit' ? addOrEditOrgModaDisplayImg : null,
    };


    /*检验联系方式*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^\d+$/.test(value))){
            callback(new Error('请输入数字'));
        }else{
            callback();
        }
    }

    /*检验是否只输入了空格*/
    function checkWetherSpace(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('输入不能为空'));
        }else{
            callback();
        }
    }

	let logoUploadProps = {
        name: 'file',
        action: `${BASE_URL}/uploadController/upload`,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                return message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('imgUrl');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张logo图');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不大于2M!');
                return false;
            }
            return true;
        },
    };

    function imgMaxSize( file , fileList , size , title){
        let fileSize = file.size;
        if ( fileSize > 1048576 * size ){
            message.error( title + '大小不能超过' + size + 'M')
            return false;
        }
    };

    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div className = { style.upload_picture_btn } >选择图片</div>
    	</div>
    );

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    //增加老师
    function addTeacher(){
        let teacherDetail = getFieldValue('teachers') || [];
        if( teacherDetail && teacherDetail.length > 0 ){
            let maxItem = teacherDetail[ teacherDetail.length - 1] || {};
            let maxKey = maxItem.key;
            teacherDetail.push({
                key  : maxKey + 1,
                item : {},
            })
        }else {
            teacherDetail.push({
                key  : 0,
                item : {}
            })
        };
        setFieldsValue({ 'teachers' : teacherDetail });
    }

    //删除老师
    function deleteTeacher( removeKey ){
        let teacherDetail = getFieldValue('teachers') || [];
        let newTeacherDetail = [];
        teacherDetail && teacherDetail.length > 0 && teacherDetail.map(function( item, index ){
            if( item.key != removeKey ){
                newTeacherDetail.push( item )
            }
        });
        setFieldsValue({ 'teachers' : newTeacherDetail })
    };

    //师资力量
    let objTeacherDetail = [];
    if( addOrEditOrgModalData && addOrEditOrgModalData.teachers ){
        let initTeacherDetail = JSON.parse( addOrEditOrgModalData.teachers ) || [{}];
        initTeacherDetail && initTeacherDetail.length > 0 && initTeacherDetail.map(function( item, index ){
            objTeacherDetail.push({
                key   : index,
                item  : item
            })
        })
    }else {
        objTeacherDetail.push({
            key   : 0,
            item  : {},
        })
    };
    getFieldDecorator('teachers',{
        initialValue : objTeacherDetail,
        rule : []
    });

    let teacherDetail = getFieldValue('teachers');
    let teacherDetailComponents = [];
    teacherDetail && teacherDetail.length > 0 && teacherDetail.map(function( item, index ){
        let canRemove = teacherDetail.length !== 1;
        //老师图片
        let initTeacherImg = [];
        if( item && item.item && item.item.teacherImg ){
            initTeacherImg.push({
                uid    : -1,
                url    : item.item.teacherImg,
                status : 'done'
            })
        };
        teacherDetailComponents.push(
            <div key ={ 'teacherDetail_' + item.key }>
                <FormItem
                    label = "师资力量"
                    { ...formItemLayout }
                >
                    {
                        getFieldDecorator([ 'teachName_' + item.key ], {
                            initialValue : item.item.teacherName || '',
                            rules: [
                                { required: true, message: '请填写老师姓名' },
                            ],
                        })(
                            <Input size = 'default' placeholder = '请填写老师姓名' />
                        )}
                    {
                       !!canRemove &&
                       <Icon
                            onClick = { () => deleteTeacher ( item.key )}
                            style = {{ marginLeft : '10px' , cursor : 'pointer', fontSize : '20px' }}
                            type  = "minus-circle-o"
                        />
                   }
                </FormItem>
                <FormItem
                    label = ''
                    { ...formItemLayoutWithoutLabel }
                >
                    {
                        getFieldDecorator([ 'teachIntro_' + item.key ], {
                            initialValue :  item.item.teacherIntro || undefined,
                            rules: [
                                { required: true, message: '请填写老师简介' },
                            ],
                        })(
                            <Input size = 'default' placeholder = '请填写老师简介' />
                        )}
                </FormItem>
                <FormItem
                    { ...formItemLayoutWithoutLabel }
                    label = ""
                    help = "上传老师图片, 支持png、jpeg、gif格式的图片,图片大小不大于2M!"
                >
                    { getFieldDecorator([ 'teachImg_' + item.key ], {
                        initialValue : initTeacherImg || [],
                        valuePropName: 'fileList',
                        action : `${BASE_URL}/uploadController/upload`,
                        normalize: normFile,
                        rules : [
                            { type : 'array' , message : '请上传头像' }
                        ]
                    })(
                        <Upload
                            action = { BASE_URL + '/uploadController/upload' }
                            listType = "picture-card"
                            beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '老师头像')}
                        >
                            { getFieldValue([ 'teachImg_' + item.key ]) && getFieldValue([ 'teachImg_' + item.key ]).length >= 1 ?  null : uploadButton }
                        </Upload>
                    )}
                </FormItem>
            </div>
        )
    })

	//获取省市区地址
	function onChangeProvincesCityArea(value, selectedOptions) {
		updateProvincesCityArea(value.join(''));
	}

	//获取详细地址
	function getAddress(v) {
		_mapNoChange = true;
		updateAddress(v.target.value);
	}

	//点击定位当前地址位置
	function updateLocation() {
		_mapNoChange = true;
		updateLocationFun();
	}

	//设置地图需要属性
	let props = {
		selectProvincesCityArea,
		selectdetailAddress,
	}

	function changeMark() {
		_mapNoChange = false;
	}

    return (
        <div style = {{ width : 1100 }}>
			<Form className='zj_org_manage_form'>
				<div className={style.org_add_title}>
					<div></div>
					<div>基本信息</div>
				</div>
				<FormItem
					label="校区名称"
					{...formItemLayout}
				>
					{getFieldDecorator('orgName', {
						initialValue:addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.orgName ? addOrEditOrgModalData.orgName : undefined,
						rules: [
							{ required: true, message: '请填写校区名称' },{validator: checkWetherSpace},
						],
					})(
						<Input placeholder='请填写机构名称' disabled = { true } size = 'default' />
					)}
				</FormItem>
                {/*<FormItem
					label="营业类型"
					{...formItemLayout}
				>
					{getFieldDecorator('orgType', {
						initialValue:addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.orgType ? addOrEditOrgModalData.orgType : undefined,
						rules: [
							{ required: true, message: '请选择机构类型' },
						],
					})(
						<RadioGroup onChange={() => changeMark()}>
							<Radio value='1'>直营</Radio>
							<Radio value='2'>加盟</Radio>
						</RadioGroup>
					)}
				</FormItem>*/}
				<FormItem
					label="校区类型"
					style={{ display : 'none' }}
					{...formItemLayout}
				>
					{getFieldDecorator('orgKind', {
						initialValue:addOrEditOrgModalType == 'edit' ? (addOrEditOrgModalData && addOrEditOrgModalData.orgKind != null ? addOrEditOrgModalData.orgKind : '2') : undefined,
						rules: [
							{ required: true, message: '请选择机构类型' },
						],
					})(
						<RadioGroup disabled = { true } onChange={() => changeMark()}>
							<Radio value='1'>早教类</Radio>
							<Radio value='2'>培训类</Radio>
						</RadioGroup>
					)}
				</FormItem>
				<FormItem
					label="联系人"
					{ ...formItemLayout }
					style = {{ lineHeight : '12px' }}
				>
					{getFieldDecorator('contacts', {
						initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.contacts ? addOrEditOrgModalData.contacts : undefined,
						rules: [
							{ required : true, message : '请输入联系人姓名' }
						],
					})(
						<Input placeholder = '请输入联系人姓名' size = 'default' />
					)}
				</FormItem>
				<FormItem
					className = 'zj_org_logo'
					label = '校区logo'
					{ ...formItemLayout }
				>
					{ getFieldDecorator('schoolLogo', {
						initialValue: !!addOrEditOrgModalData && !!addOrEditOrgModalData.schoolLogo ? [{ uid : -1, url : addOrEditOrgModalData.schoolLogo , name : 'orgLogo' , thumbUrl : addOrEditOrgModalData.schoolLogo}] : [],
						valuePropName: 'fileList',
						normalize: normFile,
					})(
						<Upload {...logoUploadProps} >
							 { getFieldValue('schoolLogo') && getFieldValue('schoolLogo').length >= 1 ?  null : uploadButton }
						</Upload>
					)}
				</FormItem>
				<FormItem
					label="联系方式"
					{...formItemLayout}
					style={{lineHeight:'12px'}}
				>
					{getFieldDecorator('tel', {
						initialValue:addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.tel ? addOrEditOrgModalData.tel : undefined,
						rules: [
							{ required: true, message: '请填写联系方式' },{validator: checkMobile}
						],
					})(
						<Input placeholder='请填写联系方式' size='default' onChange={() => changeMark()}/>
					)}
				</FormItem>
				<FormItem
					label="校区介绍"
					{...formItemLayout}
				>
					{getFieldDecorator('intro', {
						initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.intro ? addOrEditOrgModalData.intro : undefined,
					})(
						<Input type="textarea" rows={4} placeholder='请填写校区介绍' onChange={() => changeMark()}/>
					)}
				</FormItem>
				<div className={style.org_add_title}>
					<div></div>
					<div>校区详情</div>
				</div>
				<FormItem
					label="所在地址"
					{...formItemLayout}
				>
					{getFieldDecorator('addrColumn', {
						initialValue : addOrEditOrgModalType == 'edit' ? addrColumn : [],
						rules: [
							{ type:'array', required: true, message: '请选择所在地址' },
						],
					})(
						<Cascader placeholder='请选择所在地址' options={ChinaDivision} changeOnSelect onChange={onChangeProvincesCityArea} size='default'/>
					)}
				</FormItem>
				<FormItem
					label="详细地址"
					{...formItemLayout}
				>
					{getFieldDecorator('addr', {
						initialValue:addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.addr ? addOrEditOrgModalData.addr : undefined,
						rules: [
							{ required: true, message: '请填写详细地址' },{validator: checkWetherSpace},
						],
					})(
						<Input size='default' placeholder='请填写详细地址' onChange={getAddress}/>
					)}
				</FormItem>

                <div className={style.mapBtn} onClick={() => updateLocation()}>地图定位</div>

				<div className={style.map_text}>移动地图中红色图标可调整机构的实际位置，最终以地图显示的位置为准</div>

				{addOrEditOrgModalVisible ? <MapViewComponent {... props} /> : ''}

				<FormItem
					label="营业时间"
					{...formItemLayout}
				>
					{getFieldDecorator('serverTime', {
						initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.serverTime ? addOrEditOrgModalData.serverTime : undefined,
						rules: [
							{ required: true, message: '请填写营业时间' },{validator: checkWetherSpace},
						],
					})(
						<Input size='default' placeholder='请填写营业时间(可无限制自由填写)' onChange={() => changeMark()}/>
					)}
				</FormItem>
				{   addOrEditOrgModalVisible == true ?
					<div>
						<FormItem
							label="业务范围"
							{...formItemLayout}
						>
							{getFieldDecorator('categoryTag', {
								initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.categoryTag && addOrEditOrgModalData.categoryTag != null ? (addOrEditOrgModalData.categoryTag).split(',') : [],
								rules: [
									{ type: 'array', required: true, message: '请选择机构类型' },
								],
							})(
								<CheckboxGroup options={ addOrEditOrgModalSelectData.organcategory || [] } onChange={() => changeMark()}/>
							)}
						</FormItem>
						<FormItem
							label="适合年龄"
							{...formItemLayout}
						>
							{getFieldDecorator('ageTag', {
								initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.ageTag && addOrEditOrgModalData.ageTag != null ? addOrEditOrgModalData.ageTag : '',
								rules: [
									{ type: 'string', required: true, message: '请填写适合年龄,限40字', whitespace: true, max: 40, },
								],
							})(
								<Input size = 'default' placeholder = '请填写适合年龄,限40字' onChange = {() => changeMark()}/>
							)}
						</FormItem>
						<FormItem
							label="配套设施"
							{...formItemLayout}
						>
							{getFieldDecorator('utilityTag', {
								initialValue : addOrEditOrgModalType == 'edit' && addOrEditOrgModalData.utilityTag && addOrEditOrgModalData.utilityTag != null ? (addOrEditOrgModalData.utilityTag).split(',') : [],
								rules: [
									{ type: 'array', required: true, message: '请选择配套设施' },
								],
							})(
								<CheckboxGroup options={ addOrEditOrgModalSelectData.utilitytag || [] } onChange={() => changeMark()}/>
							)}
						</FormItem>
					</div>
					:
					null
				}
				{ teacherDetailComponents }
				<FormItem
					{ ...formItemLayoutWithoutLabel }
				>
					<Button onClick = { addTeacher } type = 'primary' size = 'default' >新增</Button>
				</FormItem>
				<div className={style.org_add_title}>
					<div></div>
					<div>环境相册</div>
				</div>
				{ addOrEditOrgModalVisible == true ?
					<div style={{margin:'20px 0 20px 69px'}}>
						<Dragger {...imgurlUploadProps}>
							<p className="ant-upload-drag-icon">
								<Icon type="inbox" />
							</p>
							<p className="ant-upload-text">单击或拖动图片到该区域上载</p>
							<p className="ant-upload-hint">支持单个或批量上传</p>
						</Dragger>
					</div>
					:
					null
				}
				<div className = { style.btn_area } >
					<Button key="submit" type="primary"
							onClick={handleComplete}
							disabled={addOrEditOrgModalButtonLoading}
							loading={addOrEditOrgModalButtonLoading}
							style={{marginLeft:'10px'}}>保存</Button>
				</div>
			</Form>
        </div>
    );
};

export default Form.create()(OrgManageAddOrEditOrg);
