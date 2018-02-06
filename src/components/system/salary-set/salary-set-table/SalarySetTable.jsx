import React from 'react';
import { Popover , Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent'
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

/*工资设置列表*/
function SalarySetTable({
    refundFormType,                         //全部退款单(all)，我负责的退款(my)，审核退款(check)
    search,
    table,
    pagination,
    leftBars
}){

    let columns = [{
        title : '姓名',
        key : 'name',
        dataIndex : 'name',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '角色',
        key : 'role',
        dataIndex : 'role',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '所属机构',
        key : '所属机构',
        dataIndex : 'organ',
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '基本工资',
        key : '基本工资',
        dataIndex : 'refundWay',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }, {
        title : '补贴',
        key : '补贴',
        dataIndex : 'status',
        width : 200,
        render : (text,record) => (
            <Popover placement="top" content={ text } trigger="hover">
                { text }
            </Popover>
        )
    }];

    table.columns = columns;
    table.xScroll = 1200;

    return(
        <ManagerList
            search = { search }
            table = { table }
            pagination = { pagination }
            leftBars = { leftBars }
            />
    );
}

export default SalarySetTable;
