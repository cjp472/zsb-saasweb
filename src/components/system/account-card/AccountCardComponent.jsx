import React from 'react';
import styles from './AccountCardComponent.less';
import { Modal , Button } from 'antd';
import ManagerListMgr from '../../common/manager-list/ManagerListMgr';
import AccountCardForm from '../../../pages/system/account-card/AccountCardForm';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';

function AccountCardComponent ({
    table: {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        onRowSelectChange,
        onShowSizeChange,
        pageChange,
    },
    search: {
        showSearch,
        onSearch,
        onClear,
        onFilterClick,
    },
    onBatchDelete,
    onCreateClick,
    statusActive,
    onStatusTabChange,

    onEditClick,

    listOrgShow,
    record_org_select,
    closeListOrgShow,
    showRecordOrgSelect,
}) {

    let orgSelectProps = {
        visible: listOrgShow,
        disabled: true,
        onClose: closeListOrgShow,
        afterSubmit: closeListOrgShow,
        init_org_select: record_org_select,
    };

    let managerListProps = {
        search: {
            searchAble: false,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'organId',
                    type: 'orgSelect',
                    label: '校区:',
                    placeholder: '请选择校区',
                    width: '300px',
                },
            ],
            initSearchValues: [],
        },
        table: {
            loading,
            rowKey: 'id',
            columns: [
                {
                    key: 'name',
                    title: '支付方式名称',
                    dataIndex: 'name',
                    width: 150,
                    render: function(text, record, index) {
                        if(record.paymentKey == 'pos' || record.paymentKey == 'xianjin'){
                            return(
                                <div>{text}</div>
                            )
                        }else{
                            return (
                                <div className={styles.table_cell_href_item} onClick={()=>onEditClick(record.id)}>{text}</div>
                            );
                        }
                    },
                },
                {
                    key: 'acctNo',
                    title: '账号/卡号',
                    dataIndex: 'acctNo',
                    width: 200,
                },
                {
                    key: 'rate',
                    title: '费率',
                    dataIndex: 'rate',
                    width: 100,
                    render: (text, record, index) => {
                        return <div className={styles.table_cell_item}>{(parseFloat(text + '')*100).toFixed(3)+'%'}</div>
                    }
                },
            ],
            dataSource,
            emptyText: '没有通知记录',
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys,
                onChange: onRowSelectChange,
            },
            pagination: {
                total,
                pageIndex,
                pageSize,
                onShowSizeChange,
                onChange: pageChange,
            }
        },
        leftBars: {
            label: '操作:',
            btns: [
                {
                    type: 'text',
                    label: '删除',
                    handle: onBatchDelete,
                    confirm: true,
                }
            ],
        },
        rightBars: {
            label: '',
            btns: [
                {
                    type: 'btn',
                    label: '新增支付方式',
                    icon: '',
                    handle: onCreateClick,
                },
            ]
        },
    };

    return (
        <div className={styles.account_card_manage_cont} >
            <ManagerListMgr {...managerListProps} />
            <AccountCardForm />
            <TenantOrgSelect {...orgSelectProps}/>
        </div>
    );
}


export default AccountCardComponent;
