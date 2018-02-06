import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Icon, Upload, Radio } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';
import style from './StaffManageAddOrEditStaff.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 19 },
};


/*员工管理新增员工modal*/
const StaffManageAddOrEditStaff = ({
    wetherSystemMgr,                    //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

    allOrganList,                       //左边组织架构数据,用来带出所属校区和所属部门
    staffManageRoleSelectContent,       //角色下拉数据

    addOrEditStaffModalType,            //新增编辑表单类型('add'/'edit'/'modifyFunction')
    addOrEditStaffModalVisible,         //新增编辑员工modal是否显示
    addOrEditStaffModalButtonLoading,   //新增编辑员工modal按钮是否在加载状态
    addOrEditStaffModalData,            //编辑员工时回填数据
    addOrEditStaffModalLeaderSelect,    //通过摘要查询获取汇报对象下拉列表
    addOrEditStaffModalHeadId,          //总部ID，选择所属部门时保存，选择管辖校区时用
    addOrEditStaffModalChooseOrgId,     //所属部门选中的校区ID
    addOrEditStaffModalWetherHead,      //所属部门如果是总部(true),用来判断管辖校区的显示内容

    AddOrEditStaffModalSubmit,          //新增编辑员工提交
    AddOrEditStaffModalCancel,          //新增编辑员工modal关闭

    StaffManageAddOrEditChooseOrg,      //选择所属部门的onChange事件，用来发送请求，获取汇报对象下拉列表
    selectCampusModalVisible,           //选择校区modal是否显示
    selectCampus,                       //默认添加的校区选项

    OpenSelectCampusModal,              //添加校区modal打开
    CloseSelectCampusModal,             //添加校区modal关闭
    AfterSelectCampusModalSubmit,       //添加校区选择完毕点击保存
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    /*角色下拉列表*/
    let role = [];
    if(staffManageRoleSelectContent && staffManageRoleSelectContent.length > 0){
        role = staffManageRoleSelectContent.map((item) => {
            if(item.roleKey != 'admin'){
                return(
                    <Option key={item.id+''} value={item.id+''}>{item.name}</Option>
                );
            }else{
                return (
                    <Option key={item.id+''} value={item.id+''} disabled>{item.name}(系统管理员)</Option>
                );
            }
        })
    }
    /*编辑时获取所属部门默认值*/
    let arrayOne;
    let arrayTwo = [];
    if(addOrEditStaffModalData.deptPids && addOrEditStaffModalData.deptPids != '' && addOrEditStaffModalData.deptPids != null && addOrEditStaffModalData.deptPids != undefined){
        arrayOne = addOrEditStaffModalData.deptPids;
        arrayOne = arrayOne.split(',');
        for(let i in arrayOne){
            arrayTwo.push(parseInt(arrayOne[i]));
        }
        arrayTwo.push(addOrEditStaffModalData.deptId);
    }

    /*汇报对象下拉列表*/
    let leader = [];
    if(addOrEditStaffModalLeaderSelect && addOrEditStaffModalLeaderSelect.length > 0){
        leader = addOrEditStaffModalLeaderSelect.map((item) => {
            return(
                <Option value={item.id+''} key={item.id+''}>{item.name}</Option>
            );
        });
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,data) => {
            if (!!errors) {
                return;
            }

            //处理员工id(新增时不传，编辑和修改职能时时才传)
            if(addOrEditStaffModalType != 'add'){
               data.id = addOrEditStaffModalData.id;
            }

            //修改职能时 不需要传头像，姓名，联系方式，性别，密码，备注(头像和密码在后面)
            if(addOrEditStaffModalType == 'modifyFunction'){
                delete data.name;
                delete data.mobile;
                delete data.sex;
                delete data.intro;
            }

            //不是系统管理员时提示必须选择校区
//            if(wetherSystemMgr == false){
//                if(addOrEditStaffModalChooseOrgId[0] == addOrEditStaffModalHeadId[0]){
//                    if(selectCampus == '' || selectCampus == null || selectCampus == undefined || selectCampus.length <= 0 ){
//                        message.warning('请选择管辖校区');
//                        return;
//                    }
//                }
//            }

            //处理图片显示(新增和编辑时需要上传，修改职能时不需要)
            if(addOrEditStaffModalType != 'modifyFunction'){
                if(data.IMG == '' || data.IMG == null || data.IMG == undefined){
                    data.headimgurl = '';
                }else{
                    data.headimgurl = !!data.IMG[0] && !!data.IMG[0].url ? data.IMG[0].url : data.IMG[0].response.data.url
                }
            }

            delete data.IMG;

            //处理密码(新增时默认密码为123456，编辑时不传密码)
            if(addOrEditStaffModalType == 'add'){
                data.password = '123456';
            }
            delete data.readPass;

            //获取校区id和部门id(编辑时不传，新增和修改职能上传)
            if(addOrEditStaffModalType != 'edit'){
                if(data.AccountContent && data.AccountContent.length > 0){
//                    data.orgId = (data.AccountContent)[0];          //校区ID
//                    if((data.AccountContent).length == 1){          //部门ID
//                        data.deptId = '';
//                    }else{
//                        data.deptId = (data.AccountContent)[(data.AccountContent).length-1];
//                    }
                    data.deptId = data.AccountContent[data.AccountContent.length-1] || undefined
                }else{
                    data.deptId = undefined
                }
            }

            /*如果所属部门是总部，则可以选择管辖校区；如果所属部门是校区，那么管辖校区只能是自身(编辑时不上传，新增和修改职能时上传)*/
//            if(addOrEditStaffModalType != 'edit'){
//                if(addOrEditStaffModalChooseOrgId[0] == addOrEditStaffModalHeadId[0]){
//                    if(addOrEditStaffModalType == 'edit'){
//                        //如果是系统管理员，则管辖校区传'*'
//                        if(addOrEditStaffModalData.roles[0].role_key == 'admin'){
//                            data.mgrOrgIds = '*';
//                        }else{
//                            data.mgrOrgIds = selectCampus.join(',');
//                        }
//                    }else{
//                        data.mgrOrgIds = selectCampus.join(',');
//                    }
//                }else{
//                    data.mgrOrgIds = (data.AccountContent)[0];          //校区ID
//                }
//            }

            delete data.AccountContent;
            AddOrEditStaffModalSubmit(data);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        AddOrEditStaffModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: addOrEditStaffModalType == 'add'?'新增员工':'编辑员工',
        maskClosable : false,
        visible : addOrEditStaffModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : !!wetherSystemMgr ? [<Button key="cancel" type="primary" onClick={handleCancel}>我知道了</Button>] : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={addOrEditStaffModalButtonLoading}
                    loading={addOrEditStaffModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_staff_add_or_edit_modal'
    };

    let imgurlUploadProps = {
        name: 'file',
        action: `${BASE_URL}/uploadController/upload`,
        //action: `${BASE_URL}/upload/uploadExcel`,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if (info.file.status === 'done' && info.file.response.errorCode == 9000) {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('IMG');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张主图');
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


    let url = addOrEditStaffModalData && addOrEditStaffModalData.headimgurl && addOrEditStaffModalData.headimgurl !='' && addOrEditStaffModalData.headimgurl != undefined || addOrEditStaffModalData.headimgurl != null ? addOrEditStaffModalData.headimgurl : null;
    let displayImg = [{
        uid : -1,
        url : url,
        name : addOrEditStaffModalData.name,
        thumbUrl : url,
    }];

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div>选择头像</div>
    	</div>
    );

    /*校区选择框属性*/
    let tenantOrgSelectProps = {
        visible: selectCampusModalVisible,
        onClose: CloseSelectCampusModal,
        afterSubmit: AfterSelectCampusModalSubmit,                  /*校区选中后的回调*/
        init_org_select: selectCampus,
    };


    /*检验手机号码*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^1[0-9]{10}$/.test(value))){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }

    /*所属部门内容改变时(为了清空角色下拉列表)*/
    let AccountContentOnChange = function(data){
        setFieldsValue({
            leaderId: undefined,
        });
        StaffManageAddOrEditChooseOrg(data);        //选择所属部门的onChange事件，用来发送请求，获取汇报对象下拉列表
    }

    /*新增编辑时所属部门确认后判断是否是总部，如果是，则显示全部校区；如果不是，则默认当前选中校区*/
//    let campus;
//    //未选择所属部门的时候要清空管辖校区
//    if(!!getFieldValue('AccountContent')){
//        /*不是总部*/
//        if(!addOrEditStaffModalWetherHead){
//            let campusName = '';
//            if(addOrEditStaffModalType != 'add'){
//                for(let i in allOrganList){
//                    if(allOrganList[i].value == addOrEditStaffModalChooseOrgId[0]){
//                        campusName = allOrganList[i].label;
//                    }
//                }
//            }
//            campus = (
//                <FormItem
//                    {...formItemLayout}
//                    label = "管辖校区"
//                    key = 'addOrEditStaffModalWetherHeadFalse'
//                    style = {{ lineHeight : '30px' }}
//                >
//                    <span style={{color:'#5d9cec',lineHeight:'24px'}}>
//                        { addOrEditStaffModalData.orgName || campusName}
//                    </span>
//                </FormItem>
//            );
//        }else{
//            campus = (
//                <FormItem
//                    {...formItemLayout}
//                    label = "管辖校区"
//                    key = 'addOrEditStaffModalWetherHeadtrue'
//                    style = {{ lineHeight : '30px' }}
//                >
//                    <span style={{color:'#5d9cec',marginRight:'10px'}}>{selectCampus && selectCampus.length || '0'}个</span>
//                    {getFieldDecorator('mgrOrgIds',{
//                        initialValue : 'expend',
//                    })(
//                        <Button type='primary' size='small' onClick={OpenSelectCampusModal} disabled={wetherSystemMgr}>选择校区</Button>
//                    )}
//                </FormItem>
//            );
//        }
//    }else{
//        campus =
//            <FormItem
//                {...formItemLayout}
//                label = "管辖校区"
//                key = 'addOrEditStaffModalWetherHeadtrue'
//                style = {{ lineHeight : '30px' }}
//            >
//            </FormItem>
//    }

    /*校验员工姓名*/
    function checkName(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('员工姓名不能为空'));
        }else{
            callback();
        }
    }

    return (
        <Modal {...modalOpts}>
            { addOrEditStaffModalType != 'modifyFunction' ?
                <div>
                    <BlockTitle content = '基本信息'/>
                    <FormItem
                        label="头像"
                        help = "支持png、jpg、jpeg、gif格式的图片,图片大小不大于2M!"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('IMG', {
                            initialValue: addOrEditStaffModalType=='edit'?(displayImg[0].url!=''?displayImg:null):null,
                            valuePropName: 'fileList',
                            normalize: normFile,
                        })(
                            <Upload {...imgurlUploadProps} >
                                 { getFieldValue('IMG') && getFieldValue('IMG').length >= 1 ?  null : uploadButton }
                            </Upload>
                        )}
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label = "员工姓名"
                    >
                        { getFieldDecorator('name',{
                            initialValue : addOrEditStaffModalType=='edit' && addOrEditStaffModalData.name ? addOrEditStaffModalData.name + '' : undefined,
                            rules : [
                                { required : true , message : '请输入员工姓名' },{validator: checkName},
                            ]
                        })(
                            <Input placeholder = "请输入员工姓名" size='default' />
                        )}
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label = "员工手机"
                    >
                        { getFieldDecorator('mobile',{
                            initialValue : addOrEditStaffModalType=='edit' && addOrEditStaffModalData.mobile ? addOrEditStaffModalData.mobile + '' : undefined,
                            rules : [
                                { required : true , message : '请输入员工手机' },{validator: checkMobile},
                            ]
                        })(
                            <Input placeholder = "请输入员工手机" size='default' />
                        )}
                    </FormItem>

                    <FormItem
                        { ...formItemLayout }
                        label = "初始密码"
                        style = {{ lineHeight : '32px' }}
                    >
                        { getFieldDecorator('readPass')(
                            <span style={{color:'#5d9cec'}}>123456</span>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="性别"
                        style = {{ lineHeight : '30px' }}
                    >
                        {getFieldDecorator('sex',{
                            initialValue : addOrEditStaffModalType=='edit' && addOrEditStaffModalData.sex ? addOrEditStaffModalData.sex + '' : undefined,
                            rules : [
                                { required : true , message : '请选择员工性别' }
                            ]
                        })(
                            <RadioGroup>
                                <Radio value='1'>男</Radio>
                                <Radio value='2'>女</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        label="简介"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('intro', {
                            initialValue : addOrEditStaffModalType=='edit' && addOrEditStaffModalData.intro ? addOrEditStaffModalData.intro + '' : undefined,
                        })(
                            <Input type="textarea" placeholder='请填写简介' autosize={{ minRows: 3, maxRows: 4 }}/>
                        )}
                    </FormItem>
                </div>
                :
                null
            }

            { addOrEditStaffModalType != 'edit' ?
                <div>
                    <BlockTitle
                            content = {
                                <div>职能信息{ !!wetherSystemMgr ? <span style = {{ color : 'red' }}>（该员工为系统管理员，仅供参考，禁止修改）</span> : null }</div>
                            }
                            style = {{ marginBottom : 5 }}
                        />
                    { wetherSystemMgr == false ?
                        (<FormItem
                            {...formItemLayout}
                            label="角色"
                        >
                            {getFieldDecorator('roleIds',{
                                initialValue : addOrEditStaffModalType == 'modifyFunction' && addOrEditStaffModalData.roles && addOrEditStaffModalData.roles.length > 0 && addOrEditStaffModalData.roles[0].role_id ? addOrEditStaffModalData.roles[0].role_id + '' : undefined,
                                rules : [
                                    { required : true , message : '请选择角色' }
                                ]
                            })(
                                <Select
                                    placeholder="请选择角色"
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    style = {{ width : 160 }}>
                                    { role || [] }
                                </Select>
                            )}
                        </FormItem>)
                        :
                        (<FormItem
                            {...formItemLayout}
                            label="角色"
                        >
                            {getFieldDecorator('roleIds',{
                                initialValue : addOrEditStaffModalType=='modifyFunction' && (addOrEditStaffModalData.roles)[0].role_id ? (addOrEditStaffModalData.roles)[0].role_id + '' : undefined,
                            })(
                                <Select
                                    placeholder = "请选择角色"
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    disabled = { wetherSystemMgr }
                                    style = {{ width : 160 }}>
                                    { role || [] }
                                </Select>
                            )}
                        </FormItem>)
                    }

                    { wetherSystemMgr == false ?
                        (<FormItem
                            {...formItemLayout}
                            label="所属部门"
                            help="请先选择所属部门再选择汇报对象，否则汇报对象可能无选项"
                        >
                            {getFieldDecorator('AccountContent',{
                                initialValue : addOrEditStaffModalType == 'modifyFunction' ? arrayTwo : [],
                            })(
                                <Cascader
                                    placeholder='请选择所属部门'
                                    options={allOrganList}
                                    changeOnSelect
                                    size='default'
                                    onChange={AccountContentOnChange}
                                    style = {{ width : '100%' }}/>
                            )}
                        </FormItem>)
                        :
                        (<FormItem
                            {...formItemLayout}
                            label="所属部门"
                            help="请先选择所属部门再选择汇报对象，否则汇报对象可能无选项"
                        >
                            {getFieldDecorator('AccountContent',{
                                initialValue : addOrEditStaffModalType == 'modifyFunction' ? arrayTwo : [],
                            })(
                                <Cascader
                                    placeholder='请选择所属部门'
                                    options={allOrganList}
                                    changeOnSelect
                                    size='default'
                                    disabled={wetherSystemMgr}
                                    onChange={AccountContentOnChange}
                                    style = {{ width : '100%' }}/>
                            )}
                        </FormItem>)
                    }
                    <FormItem
                        {...formItemLayout}
                        label="汇报对象"
                    >
                        {getFieldDecorator('leaderId',{
                            initialValue : addOrEditStaffModalType=='modifyFunction' ? (addOrEditStaffModalData.leaderId == null || addOrEditStaffModalData.leaderId == 0 ? undefined : addOrEditStaffModalData.leaderId + '') : undefined,
                        })(
                            <Select
                                placeholder="请选择汇报对象"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                notFoundContent="未找到"
                                disabled = { wetherSystemMgr }
                                style = {{ width : 160 }}>
                                { leader || [] }
                            </Select>
                        )}
                    </FormItem>
                    {/*<QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        className="common-search-queue" >
                        { campus || [] }
                    </QueueAnim>*/}
                </div>
                :
                null
            }
            {/*<TenantOrgSelect { ...tenantOrgSelectProps } style={{ width:'120px' }}/>*/}
        </Modal>
    );
};

export default Form.create()(StaffManageAddOrEditStaff);
