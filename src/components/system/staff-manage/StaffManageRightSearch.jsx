import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Form, Icon, Select, message } from 'antd';
import styles from './StaffManageRightSearch.less';
const Option = Select.Option;

/*员工管理右边search*/
function StaffManageRightSearch({
    staffManageRoleSelectContent,       //表格搜索栏角色列表下拉数据
    StaffManageSearchSubmit,            //员工管理点击查询
    StaffManageSearchReset,             //员工管理清除条件
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
    },
  }) {

    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,fieldsValue) => {
            if (!!errors) {
                return;
            }
        let data = getFieldsValue();
        StaffManageSearchSubmit(data);
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        StaffManageSearchReset();
    }

    let children = [];
    if( staffManageRoleSelectContent && staffManageRoleSelectContent.length > 0 ){
        children = staffManageRoleSelectContent.map((item) => {
            return(
                <Option key={item.id+''} value={item.id+''}>{item.name}</Option>
            );
        });
    }

    return(
        <div className={styles.searchForm}>
            <div className={styles.searchArea}>
                <div className={styles.searchItem}>
                    {getFieldDecorator('id')(
                        <Input placeholder="员工编号" style={{ width: 120 }}/>
                    )}
                </div>
                <div className={styles.searchItem}>
                    {getFieldDecorator('name')(
                        <Input placeholder="员工姓名" style={{ width: 120 }}/>
                    )}
                </div>
                <div className={styles.searchItem}>
                    {getFieldDecorator('mobile')(
                        <Input placeholder="员工手机号" style={{ width: 120 }}/>
                    )}
                </div>
                <div className={styles.searchItem}>
                    {getFieldDecorator('roleIds')(
                        <Select
                            placeholder="选择角色"
                            style={{ width: 120 }}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            notFoundContent="未找到"
                            >
                            <Option value="">全部</Option>
                            { children || [] }
                        </Select>
                    )}
                </div>
            </div>
            <div className={styles.searchBtn}>
                <Button type = 'primary' onClick={handleSearchSubmit} className={styles.searchButton}>
                    搜索
                </Button>
                <Button type = 'ghost' onClick={handleSearchClear} className={styles.searchButton} style = {{ background : '#fff' }}>
                    清除条件
                </Button>
            </div>
        </div>
    );
}

export default Form.create()(StaffManageRightSearch);
