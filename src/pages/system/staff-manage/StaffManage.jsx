import React from 'react';
import { Tabs,message } from 'antd';
import QueueAnim from 'rc-queue-anim';
const TabPane = Tabs.TabPane;

import TenantOrgSelect from '../../common/tenant-org-select/TenantOrgSelect';

import StaffManageLeftList from '../../../components/system/staff-manage/StaffManageLeftList';                  /*员工管理左边组织架构*/
import StaffManageAddOrEditSector from '../../../components/system/staff-manage/StaffManageAddOrEditSector';    /*组织架构新增部门modal*/

import StaffManageRightSearch from '../../../components/system/staff-manage/StaffManageRightSearch';            /*员工管理右边table*/
import StaffManageRightTable from '../../../components/system/staff-manage/StaffManageRightTable';              /*员工管理右边search*/
import StaffManageAddOrEditStaff from '../../../components/system/staff-manage/StaffManageAddOrEditStaff';      /*员工管理新增员工modal*/

import StaffManageChangeStatusFailedModal from '../../../components/system/staff-manage/StaffManageChangeStatusFailedModal';      /*员工修改状态失败的员工会显示在此表单中*/

import { connect } from 'dva';
import styles from './StaffManage.less';

function StaffManage({ dispatch, staffManage }) {

    let {

        /*是否是系统管理员*/
        wetherSystemMgr,                        //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

        /*组织架构列表*/
        allOrganList,                           //左边组织架构数据
        allOrganListLoading,                    //左边组织架构是否加载中
        secondOrganArray,                       //左边组织架构列表默认打开的二级菜单
        organItemIndexOnMouseMove,              //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
        organItemIdOnMouseMove,                 //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')

        /*组织架构新增部门modal*/
        addOrEditSectorModalType,               //新增编辑部门类型('add'/'edit')
        addOrEditSectorModalVisible,            //新增编辑部门modal是否显示
        addOrEditSectorModalButtonLoading,      //新增编辑部门modal按钮是否在加载状态
        addOrEditSectorModalData,               //编辑部门时回填数据

        /*右边列表*/
        staffTableType,                         //表格类型(使用中'1'/已停用'3')
        staffManageRoleSelectContent,           //表格搜索栏角色列表下拉数据
        staffManageSearchContentUseing,         //使用中员工管理查询条件
        staffManageSearchContentDisabled,       //已停用员工管理查询条件
        staffManagePageSizeUseing,              //使用中表格每页显示条数
        staffManagePageIndexUseing,             //使用中表格页码
        staffManagePageSizeDisabled,            //已停用表格每页显示条数
        staffManagePageIndexDisabled,           //已停用表格页码
        staffManageTableLoading,                //表格加载状态
        staffManageTableTotal,                  //表格数据总数
        staffManageTableContent,                //表格数据所有内容
        staffManageSearchVisible,               //右边table列表搜索栏是否显示
        staffManageTableSelectedRowKeys,        //表格多选选中的数组
        staffManageTableSelectedRow,            //表格多选中的对象数组

        /*右边列表新增编辑员工modal*/
        addOrEditStaffModalType,                //新增编辑表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible,             //新增员工modal是否显示
        addOrEditStaffModalButtonLoading,       //新增员工modal按钮是否在加载状态
        addOrEditStaffModalData,                //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect,        //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalHeadId,              //总部ID，选择所属部门时保存，选择管辖校区时用
        addOrEditStaffModalChooseOrgId,         //账号所属选中的校区ID
        addOrEditStaffModalWetherHead,          //所属部门如果是总部(true),用来判断管辖校区的显示内容

        /*员工修改状态失败的员工会显示在此表单中*/
        changeStatusOperateStaffNum,                    //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible,                 //表单是否显示

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex,               //页码
        staffManageChangeStatusPageSize,                //每页条数
        staffManageChangeStatusTableTotal,              //列表总数
        staffManageChangeStatusTableContent,            //列表内容

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible,               //选择校区modal是否显示
        selectCampus,                           //默认添加的校区选项

        /*表格点击所属机构下方数据时弹出模态框*/
        checkOrgsModalVisible,                  //查看所属机构模态框是否展示
        checkOrgsModalData,                     //查看所属机构机构数据

	} = staffManage;

    /*左边组织架构*/
        /*左边组织架构列表节点展开事件*/
        let OrganListOnExpend = function(expandedKeys){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    secondOrganArray : expandedKeys,
                }
            });
        }

        /*左边组织架构鼠标经过显示编辑和删除*/
        let organOnMouseMove = function(id,index){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    organItemIdOnMouseMove : id,
                    organItemIndexOnMouseMove : index,
                }
            });
        }

        /*左边组织架构点击新增部门*/
        let OrganAddSector = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditSectorModalType : 'add',
                    addOrEditSectorModalVisible : true,
                    wetherSystemMgr : false,
                }
            });
        }

        /*左边组织架构点击编辑部门*/
        let OrganEditSector = function(data){
            let array = [];
            for(let i in (data.pids).split(',')){
                array.push(parseInt(((data.pids).split(','))[i]));
            }
            array.splice(1,1);
            data.default = array;
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditSectorModalType : 'edit',
                    addOrEditSectorModalVisible : true,
                    addOrEditSectorModalData : data,
                }
            });
        }

        /*新增编辑部门提交*/
        let AddOrEditSectorModalSubmit = function(data,type){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditSectorModalButtonLoading : true,
                }
            });
            if('add' == type){
                dispatch({
                    type:'staffManage/AddSector',
                    payload:{
                        secondOrganArray,
                        ...data
                    }
                });
            }else if('edit' == type){
                dispatch({
                    type:'staffManage/EditSector',
                    payload:{
                        secondOrganArray,
                        ...data
                    }
                });
            }
        }

        /*新增部门表单关闭*/
        let AddOrEditSectorModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditSectorModalType : '',
                    addOrEditSectorModalVisible : false,
                    addOrEditSectorModalData : {},
                }
            });
        }

        /*左边组织结构列表点击删除*/
        let OrganDeleteSector = function(id){
            dispatch({
                type:'staffManage/DeleteSector',
                payload:{
                    id,
                    secondOrganArray,
                }
            });
        }

    /*右边员工列表*/
        /*员工管理点击查询*/
        let  StaffManageSearchSubmit = function(data){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                }
            });
            if('1' == staffTableType){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        staffManageSearchContentUseing : data,     //使用中员工管理查询条件
                        staffManagePageIndexUseing : 0,
                    }
                });
                dispatch({
                    type:'staffManage/ShowStaffTable',
                    payload:{
                        pageSize : staffManagePageSizeUseing,       //表格每页显示条数
                        pageIndex : 0,                              //表格页码
                        status : staffTableType,                    //判断是使用中还是停用中
                        ...data
                    }
                });
            }else if('3' == staffTableType){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        staffManageSearchContentDisabled : data,    //已停用员工管理查询条件
                        staffManagePageIndexDisabled : 0,
                    }
                });
                dispatch({
                    type:'staffManage/ShowStaffTable',
                    payload:{
                        pageSize : staffManagePageSizeDisabled,     //表格每页显示条数
                        pageIndex : 0,                              //表格页码
                        status : staffTableType,                    //判断是使用中还是停用中
                        ...data
                    }
                });
            }
        }

        /*员工管理清除条件*/
        let StaffManageSearchReset = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    staffManageSearchContentUseing : {},
                    staffManageSearchContentDisabled : {},
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                }
            });
            if( '1' == staffTableType){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        staffManagePageIndexUseing : 0,
                        staffManagePageSizeUseing : 10
                    }
                });
                dispatch({
                    type:'staffManage/ShowStaffTable',
                    payload:{
                        pageSize : 10,                                 //员工表格表格使用中每页显示条数
                        pageIndex : 0,                                 //员工表格使用中页码
                        status : staffTableType,                       //判断是使用中还是停用中
                    }
                });
            }else if( '3' == staffTableType){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        staffManagePageIndexDisabled : 0,
                        staffManagePageSizeDisabled : 10
                    }
                });
                dispatch({
                    type:'staffManage/ShowStaffTable',
                    payload:{
                        pageSize : 10,                                  //员工表格表格已停用每页显示条数
                        pageIndex : 0,                                  //员工表格已停用页码
                        status : staffTableType,                        //判断是使用中还是停用中
                    }
                });
            }
        }

        /*右边员工列表使用中分页*/
        let StaffManageTableOnChangePageUseing = function(pagination, filters, sorter) {
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManagePageIndexUseing : pagination.current-1,
                    staffManagePageSizeUseing : 10,
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                },
            });
            dispatch({
                type: 'staffManage/ShowStaffTable',
                payload: {
                    pageIndex : pagination.current-1,
                    pageSize : 10,
                    status : staffTableType,                    //判断是使用中还是停用中
                    ...staffManageSearchContentUseing           //使用中员工搜索数据
                },
            });
        };

        /*右边员工列表已停用分页*/
        let StaffManageTableOnChangePageDisabled = function(pagination, filters, sorter) {
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManagePageIndexDisabled : pagination.current-1,
                    staffManagePageSizeDisabled : 10,
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                },
            });
            dispatch({
                type: 'staffManage/ShowStaffTable',
                payload: {
                    pageIndex : pagination.current-1,
                    pageSize : 10,
                    status : staffTableType,                    //判断是使用中还是停用中
                    ...staffManageSearchContentDisabled         //使用中员工搜索数据
                },
            });
        };

        /*表格多选框是否可选中*/
        let StaffManageTableRowCheckProps = function(record){
            return true;
        }

        /*多选框选中的onChange方法*/
        let StaffManageTableRowSelectChange = function(selectedRowKeys, selectedRows){
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManageTableSelectedRowKeys:selectedRowKeys,
                    staffManageTableSelectedRow:selectedRows,
                },
            });
        }

        /*右边员工列表点击筛选*/
        let StaffManageTableOnFilter = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    staffManageSearchVisible : !staffManageSearchVisible,
                }
            });
        }

        /*表格点击所属机构下方数据时弹出并查看*/
        let StaffManageCheckOrgs = function(data){
            let orgIdArray = [];
            for(let i in data){
                orgIdArray.push(data[i].org_id+'');
            }
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    checkOrgsModalData : orgIdArray,          //查看所属机构机构数据
                    checkOrgsModalVisible : true,
                }
            });
        }

        /*关闭查看所属机构模态框*/
        let CheckOrgsModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    checkOrgsModalData : [],
                    checkOrgsModalVisible : false,
                }
            });
        }

        /*右边员工列表点击新增按钮*/
        let StaffManageTableOnCreateStaff = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalType : 'add',
                    addOrEditStaffModalVisible : true,
                    wetherSystemMgr : false,
                    selectCampus : [],
                }
            });
        }

        /*右边员工列表内点击编辑*/
        let StaffManageTableOnEditStaff = function(data,type){
            if(type == 'byBatch' && staffManageTableSelectedRow.length != 1){
                message.warn('编辑时应选中一个员工');
            }else if(type == 'modifyFunction' && staffManageTableSelectedRow.length != 1){
                message.warn('修改职能时应选中一个员工');
            }else if(data.kbmerchantDesc == '' || data.kbmerchantDesc == null || data.kbmerchantDesc == undefined){
                dispatch({
                    type:'staffManage/GetStaffDetail',
                    payload:{
                        id : data.id,
                        orgId : data.orgId,
                        type,
                    }
                });
            }else{
                message.warn('口碑用户不能修改');
            }
        }

        /*选择所属部门的改变事件，用来带出汇报对象*/
        let StaffManageAddOrEditChooseOrg = function(data){
            if(data[0] == addOrEditStaffModalHeadId[0]){
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        addOrEditStaffModalWetherHead : true,
                        addOrEditStaffModalChooseOrgId : data,
                    }
                });
            }else{
                dispatch({
                    type:'staffManage/updateState',
                    payload:{
                        addOrEditStaffModalWetherHead : false,
                        addOrEditStaffModalChooseOrgId : data,
                    }
                });
            }

            let newData = addOrEditStaffModalData;
            for(let i in allOrganList){
                if(allOrganList[i].orgId == (data[0])){
                    newData.orgName = allOrganList[i].label;
                }
            };

            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalData : newData
                }
            });

            dispatch({
                type:'staffManage/GetLeaderSelect',
                payload:{
                    orgId : data[0],
                }
            });
        }

        /*新增编辑员工modal关闭*/
        let AddOrEditStaffModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalType : undefined,
                    addOrEditStaffModalButtonLoading : false,
                    addOrEditStaffModalVisible : false,
                    addOrEditStaffModalLeaderSelect : [],
                    addOrEditStaffModalData : {},           //清空表单回填数据
                    selectCampus : [],                      //清空选择校区数据
                    staffManageTableSelectedRowKeys : [],
                    staffManageTableSelectedRow : [],
                }
            });
        }

        /*新增编辑员工提交*/
        let AddOrEditStaffModalSubmit = function(data){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    addOrEditStaffModalButtonLoading : true,       //新增员工modal按钮是否在加载状态
                }
            });
            if(addOrEditStaffModalType == 'add'){
                dispatch({
                    type:'staffManage/CreateStaff',
                    payload:{
                        ...data
                    }
                })
            }else if(addOrEditStaffModalType == 'edit'){
                dispatch({
                    type:'staffManage/UpdateStaff',
                    payload:{
                        ...data
                    }
                })
            }else if(addOrEditStaffModalType == 'modifyFunction'){
                dispatch({
                    type:'staffManage/ChangeStaffFunc',
                    payload:{
                        ...data
                    }
                })
            }
        }

        /*添加校区modal打开*/
        let OpenSelectCampusModal = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampusModalVisible : true,
                }
            });
        }

        /*添加校区选择完毕点击保存*/
        let AfterSelectCampusModalSubmit = function(array){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampus : array,
                }
            });
        }

        /*添加校区modal关闭*/
        let CloseSelectCampusModal = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    selectCampusModalVisible : false,
                }
            });
        }

        /*表格点击启用*/
        let StaffManageTableOnEnableStaff = function(data){
            if(data.length == 0){
                message.warn('启用时应至少选中一个员工');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:{
                        status : 1,
                        ids : value.join(',')
                    }
                });
            }
        }

        /*员工表格点击停用*/
        let StaffManageTableOnFiredStaff = function(data){
            if(data.length == 0){
                message.warn('启用时应至少选中一个员工');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:{
                        status : 3,
                        ids : value.join(',')
                    }
                });
            }
        }

        /*员工表格点击删除*/
        let StaffManageTableOnDeleteStaff = function(data){
            if(data.length == 0){
                message.warn('删除时应至少选中一项');
            }else{
                let value = [];
                for(let i in data){
                    value.push(data[i].id);
                }
                dispatch({
                    type : 'staffManage/EnableOrFireOrDeleteStaff',
                    payload:{
                        status : 0,
                        ids : value.join(',')
                    }
                });
            }
        }

    /*员工修改状态失败的员工会显示在此表单中*/
        /*分页等改变*/
        let StaffManageChangeStatusTableOnChange = function(pagination, filters, sorter) {
            dispatch({
                type: 'staffManage/updateState',
                payload: {
                    staffManageChangeStatusPageIndex : pagination.current-1,
                    staffManageChangeStatusPageSize : pagination.pageSize,
                },
            });
        };

        /*关闭modal*/
        let StaffManageChangeStatusFailedModalCancel = function(){
            dispatch({
                type:'staffManage/updateState',
                payload:{
                    changeStatusFailedModalVisible : false,
                    staffManageChangeStatusPageIndex : 0,           //页码
                    staffManageChangeStatusPageSize : 10,           //每页条数
                    staffManageChangeStatusTableTotal : undefined,  //列表总数
                    staffManageChangeStatusTableContent : [],       //列表内容
                }
            });
        }

    /*员工管理左边组织架构*/
    let staffManageListProps = {
        allOrganList,                           //左边组织架构数据
        allOrganListLoading,                    //左边组织架构是否加载中
        secondOrganArray,                       //左边组织架构列表默认打开的二级菜单
        organItemIndexOnMouseMove,              //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
        organItemIdOnMouseMove,                 //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')

        OrganListOnExpend,                      //左边组织架构列表节点展开事件

        OrganAddSector,                         //左边阻止架构列表点击新增部门
        OrganEditSector,                        //左边组织架构列表点击编辑部门
        OrganDeleteSector,                      //左边组织结构列表点击删除
        organOnMouseMove,                       //左边部门鼠标悬浮事件

        staffManageSearchVisible,               //右边table列表搜索栏是否显示(用来使组织架构高度和右边table高度一样)
    }

    /*组织架构新增编辑部门*/
    let staffManageAddOrEditSectorProps = {
        allOrganList,                           //左边组织架构数据作为下拉列表数据
        addOrEditSectorModalType,               //新增编辑部门类型('add'/'edit')
        addOrEditSectorModalVisible,            //新增编辑部门modal是否显示
        addOrEditSectorModalButtonLoading,      //新增编辑部门modal按钮是否在加载状态
        addOrEditSectorModalData,               //编辑部门时回填数据

        AddOrEditSectorModalSubmit,             //新增编辑部门提交
        AddOrEditSectorModalCancel,             //新增编辑部门modal关闭
    }

    /*员工管理右边search栏*/
    let staffManageRightSearchProps = {
        staffManageRoleSelectContent,           //表格搜索栏角色列表下拉数据
        StaffManageSearchSubmit,                //员工管理点击查询
        StaffManageSearchReset,                 //员工管理清除条件
    }

    /*员工管理右边table表格*/
    let staffManageRightTableProps = {
        staffTableType,                         //表格类型(使用中/已停用)
        staffManageTableLoading,                //表格加载状态
        staffManageTableTotal,                  //表格数据总数
        staffManageTableContent,                //表格数据所有内容
        staffManageTableSelectedRowKeys,        //表格多选选中的数组
        staffManageTableSelectedRow,            //表格多选中的对象数组
        staffManagePageSizeUseing,              //使用中表格每页显示条数
        staffManagePageIndexUseing,             //使用中表格页码
        staffManagePageSizeDisabled,            //已停用表格每页显示条数
        staffManagePageIndexDisabled,           //已停用表格页码

        StaffManageTableOnChangePageUseing,     //使用中表格分页改变
        StaffManageTableOnChangePageDisabled,   //已停用表格分页改变
        StaffManageTableOnFilter,               //表格点击筛选
        StaffManageTableRowCheckProps,          //表格多选框是否可被选中
        StaffManageTableRowSelectChange,        //多选框选择方法
        StaffManageTableOnCreateStaff,          //表格点击新增员工
        StaffManageTableOnEditStaff,            //表格点击编辑员工
        StaffManageTableOnFiredStaff,           //表格点击停用
        StaffManageTableOnEnableStaff,          //表格点击启用
        StaffManageTableOnDeleteStaff,          //表格点击删除
        StaffManageCheckOrgs,                   //表格点击所属机构下方数据时弹出并查看
    }

    /*员工管理新增编辑员工modal*/
    let staffManageAddOrEditStaffProps = {
        wetherSystemMgr,                        //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

        allOrganList,                           //左边组织架构数据,用来带出所属校区和所属部门
        staffManageRoleSelectContent,           //角色下拉数据

        addOrEditStaffModalType,                //新增编辑表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible,             //新增员工modal是否显示
        addOrEditStaffModalButtonLoading,       //新增员工modal按钮是否在加载状态
        addOrEditStaffModalData,                //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect,        //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalHeadId,              //总部ID，选择所属部门时保存，选择管辖校区时用
        addOrEditStaffModalChooseOrgId,         //账号所属选中的校区ID
        addOrEditStaffModalWetherHead,          //所属部门如果是总部(true),用来判断管辖校区的显示内容

        AddOrEditStaffModalSubmit,              //新增编辑员工提交
        AddOrEditStaffModalCancel,              //新增员工modal关闭

        StaffManageAddOrEditChooseOrg,          //选择账号所属的onChange事件，用来发送请求，获取汇报对象下拉列表
        selectCampusModalVisible,               //选择校区modal是否显示
        selectCampus,                           //默认添加的校区选项

        OpenSelectCampusModal,                  //添加校区modal打开
        CloseSelectCampusModal,                 //添加校区modal关闭
        AfterSelectCampusModalSubmit,           //添加校区选择完毕点击保存
    }

    /*员工修改状态失败的员工会显示在此表单中*/
    let staffManageChangeStatusFailedModalProps = {
        addOrEditStaffModalType,                        //新增编辑员工表单类型('add'/'edit'/'modifyFunction')
        changeStatusOperateStaffNum,                    //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible,

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex,               //页码
        staffManageChangeStatusPageSize,                //每页条数
        staffManageChangeStatusTableTotal,              //列表总数
        staffManageChangeStatusTableContent,            //列表内容

        StaffManageChangeStatusTableOnChange,           //列表分也等信息改变

        StaffManageChangeStatusFailedModalCancel,       //关闭modal
    }

    //校区选择框属性
    let tenantOrgSelectProps = {
        headOrg : false,
        visible : checkOrgsModalVisible,
        onClose : CheckOrgsModalCancel,
        disabled : true,
        init_org_select: checkOrgsModalData,
    };

    /*改变tabs回调函数*/
    let changeTabsSelect = function(value){
        dispatch({
            type:'staffManage/updateState',
            payload:{
                staffTableType : value,
            }
        });
        if( '1' == value ){
            dispatch({
                type: 'staffManage/ShowStaffTable',
                payload: {
                    pageSize : 10,
                    pageIndex : staffManagePageIndexUseing,
                    status : value,
                    ...staffManageSearchContentUseing
                },
            });
        }else if( '3' == value){
            dispatch({
                type: 'staffManage/ShowStaffTable',
                payload: {
                    pageSize : 10,
                    pageIndex : staffManagePageIndexDisabled,
                    status : value,
                    ...staffManageSearchContentDisabled
                },
            });
        }
    }

    return(
        <div className = { styles.staff_manage_all }>
            <div className = { styles.staff_manage_left }>
                <StaffManageLeftList {...staffManageListProps}/>
            </div>
            <div className = { styles.staff_manage_right }>
                <Tabs defaultActiveKey="1" type='card' onChange={changeTabsSelect}>
                    <TabPane tab={<span>使用中</span>} key="1">
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            {staffManageSearchVisible ?
                                [ <StaffManageRightSearch {...staffManageRightSearchProps} key='StaffManageSearchUse' /> ] : null}
                        </QueueAnim>
                        <StaffManageRightTable {...staffManageRightTableProps}/>
                    </TabPane>
                    <TabPane tab={<span>已停用</span>} key="3">
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            {staffManageSearchVisible ?
                                [ <StaffManageRightSearch {...staffManageRightSearchProps} key='StaffManageSearchUnUse' /> ] : null}
                        </QueueAnim>
                        <StaffManageRightTable {...staffManageRightTableProps}/>
                    </TabPane>
                </Tabs>
            </div>
            { addOrEditSectorModalVisible == true ? <StaffManageAddOrEditSector {...staffManageAddOrEditSectorProps}/> : null }
            { addOrEditStaffModalVisible == true ? <StaffManageAddOrEditStaff {...staffManageAddOrEditStaffProps}/> : null }
            { changeStatusFailedModalVisible == true ? <StaffManageChangeStatusFailedModal {...staffManageChangeStatusFailedModalProps} /> : null }
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </div>
    );
}

function mapStateToProps({ staffManage }) {
  return { staffManage };
}

export default connect(mapStateToProps)(StaffManage);
