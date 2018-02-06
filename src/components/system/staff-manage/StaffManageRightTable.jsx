import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon, Table, Popover } from 'antd';
import { StatusFlag } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './StaffManageRightTable.less';
const TreeNode = Tree.TreeNode;

/*员工管理右边table*/
function StaffManageRightTable({
    staffTableType,                         //表格类型(使用中'1'/已停用'3')
    staffManageTableLoading,                //表格加载状态
    staffManageTableTotal,                  //表格数据总数
    staffManageTableContent,                //表格数据所有内容
    staffManageTableSelectedRowKeys,        //表格多选选中的数组
    staffManageTableSelectedRow,            //表格多选中的对象数组
    staffManagePageSizeUseing,              //使用中表格每页显示条数
    staffManagePageIndexUseing,             //使用中表格页码
    staffManagePageSizeDisabled,            //已停用表格每页显示条数
    staffManagePageIndexDisabled,           //已停用表格页码

    StaffManageTableOnFilter,               //表格点击筛选
    StaffManageTableOnCreateStaff,          //表格点击新增员工
    StaffManageTableOnEditStaff,            //表格点击编辑员工
    StaffManageTableOnFiredStaff,           //表格点击停用
    StaffManageTableOnDeleteStaff,          //表格点击删除
    StaffManageTableOnEnableStaff,          //表格点击启用
    StaffManageTableOnChangePageUseing,     //使用中表格分页改变
    StaffManageTableOnChangePageDisabled,   //已停用表格分页改变
    StaffManageTableRowCheckProps,          //多选框是否可被选中
    StaffManageTableRowSelectChange,        //多选框选择方法
    StaffManageCheckOrgs,                   //表格点击所属机构下方数据时弹出并查看

    subordinates,                           //当前登陆用户的下属编号
    selectSubordinate,                      //当前选中的下属
    subordinateChange,                      //下属选择变更事件
  }) {

    const columns = [{
        width: 96,
        title: '员工编号',
        dataIndex: 'id',
        key: 'id',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
      }, {
        width: 96,
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
      }, {
        width: 82,
        title: '状态',
        dataIndex: 'activeStatus',
        key: 'activeStatus',
        render:(text,record) => (
            <div>
                { '1' == text ? <StatusFlag type = 'green'>已激活</StatusFlag> :
                  '0' == text ? <StatusFlag type = 'gray'>未激活</StatusFlag> : '' }
            </div>
        )
      }, {
        width: 112,
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
      }, {
        width: 68,
        title: '头像',
        dataIndex: 'headImgurl',
        key: 'headImgurl',
        render: (text, record) =>
            (
             <div style={{cursor:'pointer'}}>
                {text == null || text == '' || text == undefined ?
                    '无'
                    :
                    <Popover placement="right" content={<span><img src={text} height='120px' width='80px' style={{paddingTop:'5px'}}/></span>} >
                        <a>查看</a>
                    </Popover>
                }

             </div>
            ),
      }, {
        width: 96,
        title: '角色',
        dataIndex: 'formatRoles',
        key: 'formatRoles',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        )
      }, {
        width: 96,
        title: '汇报对象',
        dataIndex: 'leaderName',
        key: 'leaderName',
        render : (text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
      }, {
        width: 96,
        title: '所属校区',
        dataIndex: 'orgName',
        key: 'orgName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
      }, /*{
        width: 96,
        title: '管辖校区',
        dataIndex: 'mgrOrgs',
        key: 'mgrOrgs',
        render:(text,record) => (
            <a disabled = {text && (text+'').length > 0 ? false : true} onClick={() => StaffManageCheckOrgs(text)}>{text && (text).length > 0 ? (text.length+'')+'家' : '无'}</a>
        ),
      },*/{
        width: 96,
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render:(text,record) => (
            <Popover placement="top" content={text}>
                { text }
            </Popover>
        ),
    }];

    let rowSelection = {
        selectedRowKeys : staffManageTableSelectedRowKeys,
        onChange : StaffManageTableRowSelectChange,
        getCheckboxProps : StaffManageTableRowCheckProps,
	};

    let paginationProps = {
        size : 'large',
        total: staffManageTableTotal,
        current : staffTableType == '1' ? staffManagePageIndexUseing+1 : staffManagePageIndexDisabled+1,
        pageSize : staffTableType == '1' ? staffManagePageSizeUseing : staffManagePageSizeDisabled,
        showQuickJumper :true,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    return(
        <div style={{width:'100%'}} className='zj_staff_manage_right_table'>
            <div className={styles.tableBtn}>
                <span>操作：</span>
                <a style={{ marginLeft: 5 }} onClick={() => StaffManageTableOnEditStaff(staffManageTableSelectedRow[0],'byBatch')}>编辑</a>
                { staffTableType == '1' ?
                    <Popconfirm placement="top" title={<span>确定要<span style={{color:'red'}}>停用</span>{staffManageTableSelectedRow.length > 1 ? '这些' : '此'}员工吗(管理员不可被停用)</span>} onConfirm={() => StaffManageTableOnFiredStaff(staffManageTableSelectedRow)}>
                        <a style={{ marginLeft: 10 }}>停用</a>
                    </Popconfirm>
                    :
                    null
                }
                { staffTableType == '3' ?
                    <Popconfirm placement="top" title={<span>确定要<span style={{color:'red'}}>启用</span>{staffManageTableSelectedRow.length > 1 ? '这些' : '此'}员工吗</span>} onConfirm={() => StaffManageTableOnEnableStaff(staffManageTableSelectedRow)}>
                        <a style={{ marginLeft: 10 }}>启用</a>
                    </Popconfirm>
                    :
                    null
                }
                <Popconfirm placement="top" title={<span>确定要<span style={{color:'red'}}>删除</span>{staffManageTableSelectedRow.length > 1 ? '这些' : '此'}员工吗</span>} onConfirm={() => StaffManageTableOnDeleteStaff(staffManageTableSelectedRow)}>
                    <a style={{ marginLeft: 10 }}>删除</a>
                </Popconfirm>

                <a style={{ marginLeft: 10 }} onClick={() => StaffManageTableOnEditStaff(staffManageTableSelectedRow[0],'modifyFunction')}>修改职能</a>

                <Button type="primary" onClick={StaffManageTableOnFilter} style={{position:'absolute',right:'0'}}>筛选</Button>
                { '1' == staffTableType ?
                    <Button onClick={StaffManageTableOnCreateStaff} style={{position:'absolute',right:'75px',background:'rgb(136,199,2)',borderColor:'rgb(136,199,2)',color:'#fff'}}>新增员工</Button>
                    :
                    null
                }
            </div>
            <div style={{marginBottom:'20px'}}>
                <Table
                    columns={columns}
                    dataSource={staffManageTableContent}
                    loading={staffManageTableLoading}
                    pagination={paginationProps}
                    rowSelection={rowSelection}
                    onChange={ staffTableType == '1' ?  StaffManageTableOnChangePageUseing : StaffManageTableOnChangePageDisabled }
                    bordered
                    rowKey="id"
                    size='middle'
                    scroll={{ x : 200 }} />
            </div>
        </div>
    );
}

export default StaffManageRightTable;
