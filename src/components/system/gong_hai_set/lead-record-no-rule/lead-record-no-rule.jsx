import React from 'react';
import { Checkbox , Input , Form, InputNumber, Button , Spin ,Radio } from 'antd';
import styles from './lead-record-no-rule.less';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
/*考勤小票预览*/
function LeadRecordNoRule({
    loading,                    //是否加载状态
    Status,                     //是否停用
    SaveLeadRecordNoRule,         //保存按钮事件
    dataKey,
    checkedstatus,
    stopStatus,
    form : {
		getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
	},
}) {

    //表单布局
	let formItemLayout = {
		labelCol : { span : 20 },
		wrapperCol : { span : 40 },
	};


    //点击保存
    let arr=[];
    function SaveLeadRecordNoRuleFunction(){

        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            let arr = [];
            let obj = {};
            obj.status = '1';
            obj.value = '退回线索池的天数';
            if(checkedstatus == '1'){
                obj.key = values.num;
            }else if(checkedstatus == '-1'){
                obj.key = '-1';
            }
            arr.push(obj);
            SaveLeadRecordNoRule(JSON.stringify(arr))
        });
    }
    //是否停用

    function stopStatusFunction(e){
       let data=e.target.value;
       stopStatus(data);
    }
    function validator(rule, value, callback) {
		if (!/^(0|[1-9][0-9]*)$/.test(value)) {
            callback(new Error('请填写≥0的整数'));
        }else {
            callback();
        }
	}
    return(
        <div className={styles.small_ticket_all_content}>
            <Spin spinning={loading}>
                <div className={styles.small_ticket_preview}>
                    <div className={styles.small_ticket_title}>
                        <div className={styles.small_ticket_title_block}></div>
                        <div className={styles.small_ticket_title_content}>设置规则</div>
                    </div>
                    <div className={styles.lead_record_content}>

                        <Form className={styles.lead_record_form} >
                            <RadioGroup onChange={stopStatusFunction} value={checkedstatus} className={styles.lead_record_form_radio}>
                                <Radio value='1'>使用</Radio>
                                <Radio value='-1'>停用</Radio>
                            </RadioGroup>
                             { checkedstatus == '1' &&
                                <FormItem
                                  {...formItemLayout}
                                >
                                  超过&nbsp;&nbsp;
                                  {getFieldDecorator('num', {
                                   rules: [
                                            { required:checkedstatus == '1' ? true : false , message: '请填写天数' },
                                            { validator : validator },
                                        ],
                                    initialValue:dataKey=='-1'?30 : dataKey,
                                  })(
                                       <InputNumber
                                            size="default"
                                            min={0}
                                            max={30}
                                            step={1}
                                            disabled={checkedstatus == '1' ? false : true}
                                        />
                                  )}&nbsp;&nbsp;天未有跟进记录，该名单自动退回公海
                                </FormItem>
                            }
                        </Form>
                        <Button type="primary" onClick={SaveLeadRecordNoRuleFunction}>保存</Button>
                    </div>
                </div>

            </Spin>
        </div>
    );
}

export default Form.create()(LeadRecordNoRule);
