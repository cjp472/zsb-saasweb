import React from 'react';
import { Upload , Form , Icon , Input , Button , Popconfirm } from 'antd';
import styles from './DomainNameSettingForth.less';

/*域名设置 第四步 各种设置*/
function DomainNameSettingForth({
    hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    forthStepBackgroundImg,             //用户选择或回填的背景图
    forthStepLogoImg,                   //用户选择或回填的logo图片
    forthStepName,                      //用户输入的商户姓名
    forthStepSubmitButtonLoading,       //保存设置按钮加载状态

    ForthStepImgUploadOnChange,         //图片上传onChange事件
    ForthStepImgUploadOnRemove,         //图片移除事件
    ForthStepImgUploadBeforeUpload,     //图片上传之前事件
    ForthStepNameOnChange,              //输入框onChange事件
    ForthStepSetSubmit,                 //保存设置事件
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}) {

    function Block({
        style,
        content
    }){
        return(
            <div className={styles.domain_block} style = { style }>
                <div className={styles.domain_block_before}></div>
                <div className={styles.domain_block_content}>{ content }</div>
            </div>
        )
    }

    let backgroundImgurlUploadProps = {
        name : 'file',
        action: BASE_UPLOAD_IMAGE,
        listType : 'picture-card',
        headers : {
            authorization: 'authorization-text',
        },
        beforeUpload : (file) => ForthStepImgUploadBeforeUpload(file,5),
        onChange : (info) => ForthStepImgUploadOnChange(info,'bgimg'),
        onRemove : () => ForthStepImgUploadOnRemove('bgimg')

    };

    let logoImgurlUploadProps = {
        name: 'file',
        action: BASE_UPLOAD_IMAGE,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload : (file) => ForthStepImgUploadBeforeUpload(file,1),
        onChange : (info) => ForthStepImgUploadOnChange(info,'logoimg'),
        onRemove : () => ForthStepImgUploadOnRemove('logoimg')
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    function handleComplete(e,type){
        e.preventDefault();
        resetFields();
        if(type == 'restore'){
            ForthStepSetSubmit({
                bgimg : '//img.ishanshan.com/gimg/img/5d8629ed4cbfbc3da826e1233f723ec5',
                logoimg : '//img.ishanshan.com/gimg/img/f204fd8affff8cdb30b68554143ef4f5',
                brandName : '闪闪管家'
            });
        }else{
            validateFieldsAndScroll((errors,values) => {
                if (!!errors) {
                    return;
                }
                values.bgimg = !!values.bgimg[0] && !!values.bgimg[0].url ? values.bgimg[0].url : values.bgimg[0].response.data.url;
                values.logoimg = !!values.logoimg[0] && !!values.logoimg[0].url ? values.logoimg[0].url : values.logoimg[0].response.data.url;
                ForthStepSetSubmit(values);
            })
        }
    }

    function checkBrandName(rule, value, callback) {
        if(typeof(value) == 'string' && value.length > 12){
            callback('1~12字符');
        }else if(!/^[^ ]+$/.test(value)){
            callback('请勿包含空格');
        }else {
            callback();
        }
	}

    return(
        <div className={styles.all}>
            <div className={styles.domain_setting}>
                <Block content = '域名设置'/>
                <div className={styles.domain_setting_name}>
                    <span style = {{ color : '#5d9cec' }}>登录域名：</span>{ hostName + '.saas.ishanshan.com' }
                </div>
            </div>
            <div className={styles.login_background_setting}>
                <Block content = '登录页设置' style = {{ marginBottom : 5 }}/>
                <div className={styles.login_background_setting_name}>*登录页背景图</div>
                <Form.Item
                    extra = "支持png、jpg、jpeg、gif格式的图片，建议尺寸1920*1080，大小不超过5M!"
                    className = 'mainpage_background_img_setting'
                >
                    {getFieldDecorator('bgimg', {
                        initialValue : forthStepBackgroundImg || [],
                        valuePropName : 'fileList',
                        normalize : normFile,
                        rules : [
                            { required : true , message : '请选择登录页背景图' }
                        ],
                    })(
                        <Upload {...backgroundImgurlUploadProps} >
                             { getFieldValue('bgimg') && getFieldValue('bgimg').length  > 0 ?
                                null
                                :
                                <div className='domain_setting_forth_step_upload_button'>
                                    <Icon type = 'plus' />
                                    <div>选择登录页背景图</div>
                                </div>
                             }
                        </Upload>
                    )}
                </Form.Item>
            </div>
            <div className={styles.login_page_setting}>
                <Block content = '登录页LOGO和品牌' style = {{ marginBottom : 5 }}/>
                <div className={styles.login_page}>
                    <div className={styles.login_page_detail}>
                        { forthStepLogoImg && forthStepLogoImg.length > 0 ?
                            <img src = { forthStepLogoImg[0].url ? forthStepLogoImg[0].url : forthStepLogoImg[0].response.data.url } className={styles.login_page_detail_logo}/>
                            :
                            <div className = {styles.login_page_detail_no_logo}>
                                LOGO
                            </div>
                        }
                        <div className = {styles.login_page_detail_brand_name}>
                            { forthStepName != null && forthStepName != undefined && forthStepName != '' && !/^[\s]*$/.test(forthStepName) ? forthStepName.substr(0,12) : '闪闪管家' }
                        </div>
                        <div className = {styles.login_page_detail_brand_small_name}>
                            一站式早教管理云平台
                        </div>
                        <div className = {styles.login_page_detail_account_information}>
                            <div><Icon type = 'user1'/></div>
                            <div><Icon type = 'suo'/></div>
                            <div>登&nbsp;&nbsp;录</div>
                        </div>
                    </div>
                    <div className={styles.login_page_detail_setting}>
                        <Form.Item
                            extra = "支持png、jpg、jpeg、gif格式的图片，建议尺寸120*120，大小不超过1M!"
                            className = 'login_logo_img_setting'
                        >
                            {getFieldDecorator('logoimg', {
                                initialValue : forthStepLogoImg || [],
                                valuePropName : 'fileList',
                                normalize : normFile,
                                rules : [
                                    { required : true , message : '请选择logo图' }
                                ],
                            })(
                                <Upload {...logoImgurlUploadProps} >
                                     { getFieldValue('logoimg') && getFieldValue('logoimg').length > 0 ?
                                        null
                                        :
                                        <div className='domain_setting_forth_step_upload_button'>
                                            <Icon type = 'plus' />
                                            <div>选择LOGO图</div>
                                        </div>
                                     }
                                </Upload>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('brandName',{
                                initialValue : forthStepName || '闪闪管家',
                                rules : [
                                    { required : true , message : '请输入品牌名称' , whitespace : true },
                                    { validator :  checkBrandName }
                                ]
                            })(
                                <Input size = 'default' placeholder = '请输入品牌名称，1~12字符' style = {{ width : 180 }} onChange = { ForthStepNameOnChange }/>
                            )}
                        </Form.Item>
                    </div>
                </div>
            </div>
            <Popconfirm placement="top" title={<span>即将恢复为闪闪背景图，logo图与品牌名称，是否继续</span>} onConfirm = {(e) => handleComplete(e,'restore')} okText="是" cancelText="否">
                <Button type = 'ghost' style = {{ marginRight : 20 }} disabled = { forthStepSubmitButtonLoading } loading = { forthStepSubmitButtonLoading }>还原默认</Button>
            </Popconfirm>
            <Button type = 'primary' onClick = {(e) => handleComplete(e)} disabled = { forthStepSubmitButtonLoading } loading = { forthStepSubmitButtonLoading }>保存</Button>
        </div>
    );
}

export default Form.create()(DomainNameSettingForth);
