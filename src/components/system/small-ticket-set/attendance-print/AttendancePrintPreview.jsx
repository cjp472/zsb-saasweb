import React from 'react';
import { Checkbox , Input , Button , Spin , Popconfirm } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import styles from './AttendancePrintPreview.less';
const CheckboxGroup = Checkbox.Group;

/*考勤小票预览*/
function AttendancePrintPreview({
    loading,                    //是否加载状态
    checkOptions,               //可以选择的checkbox
    initCheckedBox,             //初始选中的数组
    initTicketBottomContent,    //初始小票底部内容
    ticketBottomContent,        //小票底部内容

    CheckBoxOnChange,           //checkbox的onChange事件
    InputContentOnChange,       //textarea的onChange事件
    SaveSmallTicketReSet,       //还原默认选项
    SaveSmallTicketSet,         //保存选项
}) {
    return(
        <div className={styles.small_ticket_all_content}>
            <Spin spinning={loading}>
                <div className={styles.small_ticket_preview}>
                    <div className={styles.small_ticket_title}>
                        <div className={styles.small_ticket_title_block}></div>
                        <div className={styles.small_ticket_title_content}>小票预览（示例）</div>
                    </div>
                    <div className={styles.small_ticket_preview_content}>
                        { initCheckedBox && initCheckedBox.length > 0 ?
                            <div>
                                { initCheckedBox.indexOf('orgName') > -1 ?
                                  <div className={styles.small_ticket_preview_content_orgName}>
                                    闪闪早教中心
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('stuName') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    学员姓名：闪小喵
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('courseName') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    课程名称：幼儿益智一阶
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('attendTime') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    上课时间：2017-12-12 16:00-17:00
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('expendPeriod') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    消耗课时：1课时
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('mainTeacher') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    主教：李雷雷
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('assTeacher') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    助教：韩梅梅
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('classRoom') > -1 ?
                                  <div className={styles.small_ticket_preview_content_common}>
                                    教室：蓝房子101
                                  </div>
                                  :
                                  null}
                                { initCheckedBox.indexOf('recBottom') > -1 ?
                                  <div className={styles.small_ticket_preview_content_recBottom}>
                                    <pre style={{width:'260px',wordWrap:'break-word'}}>{ ticketBottomContent }</pre>
                                  </div>
                                  :
                                  null}
                            </div>
                            :
                            <NullData height = '350px' content = '暂无内容'/>
                        }
                    </div>
                </div>
                <div className={styles.small_ticket_set}>
                    <div className={styles.small_ticket_title}>
                        <div className={styles.small_ticket_title_block}></div>
                        <div className={styles.small_ticket_title_content}>请勾选需要打印的信息</div>
                    </div>
                    <div className='small_ticket_set_checkbox'>
                        <CheckboxGroup options={checkOptions} onChange={CheckBoxOnChange} value={initCheckedBox}/>
                    </div>
                    <Input
                        type = 'textarea'
                        autosize = {{ minRows: 4, maxRows: 4 }}
                        className = { styles.small_ticket_set_textarea }
                        disabled = { initCheckedBox.indexOf('recBottom') > -1 ? false : true }
                        value = { ticketBottomContent }
                        onChange = { InputContentOnChange }/>
                    <div className={styles.small_ticket_set_button}>
                        <Popconfirm placement="topLeft" title='确定还原默认？' onConfirm={SaveSmallTicketReSet} okText="确定" cancelText="取消">
                            <Button type = 'ghost' className={styles.small_ticket_set_button_item}>还原默认并保存</Button>
                        </Popconfirm>
                        <Button type = 'primary' className={styles.small_ticket_set_button_item} onClick={SaveSmallTicketSet}>保存</Button>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

export default AttendancePrintPreview;
