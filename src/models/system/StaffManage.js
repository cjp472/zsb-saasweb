import {
    SearchAllOrganList,     /*请求左边组织架构列表数据*/
    AddSector,              /*新增部门*/
    EditSector,             /*编辑部门*/
    DeleteSector,           /*删除部门*/

    ShowStaffTable,             /*员工列表展示*/
    GetRoleSelect,              /*获取搜索栏角色下拉列表数据*/
    GetStaffDetail,             /*员工列表点击编辑获取详情*/
    GetLeaderSelect,            /*点击编辑后查询当前机构下的汇报对象下拉列表内容*/
    CreateStaff,                /*新增表单提交*/
    UpdateStaff,                /*新增表单提交*/
    ChangeStaffFunc,            /*修改员工职能提交*/
    EnableOrFireOrDeleteStaff   /*停用或删除员工*/
} from '../../services/system/staff-manage/StaffManage';
import { parse } from 'qs';
import { message } from 'antd';

/*角色管理*/
export default {

    namespace: 'staffManage',

    state: {
        /*是否是系统管理员*/
        wetherSystemMgr : false,                //是否是管理员(如果是管理员，则新增修改员工信息时表单'职能信息'部分不可修改，否则可修改)

        /*组织架构列表*/
        allOrganList : [],                      //左边组织架构数据
        allOrganListLoading : false,            //左边组织架构是否加载中
        secondOrganArray : [],                  //左边组织架构列表默认打开的二级菜单
        organItemIndexOnMouseMove : '',         //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
        organItemIdOnMouseMove : '',            //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')

        /*组织架构新增部门*/
        addOrEditSectorModalType : false,               //新增编辑部门类型('add'/'edit')
        addOrEditSectorModalVisible : false,            //新增编辑部门modal是否显示
        addOrEditSectorModalButtonLoading : false,      //新增编辑部门modal按钮是否在加载状态
        addOrEditSectorModalData : {},                  //编辑部门时回填数据

        /*右边员工列表*/
        staffTableType : '1',                       //表格类型(使用中'1'/已停用'3')
        staffManageRoleSelectContent: [],           //表格搜索栏角色列表下拉数据
        staffManageSearchContentUseing : {},        //使用中员工管理查询条件
        staffManageSearchContentDisabled : {},      //已停用员工管理查询条件
        staffManagePageSizeUseing : 10,             //使用中表格每页显示条数
        staffManagePageIndexUseing : 0,             //使用中表格页码
        staffManagePageSizeDisabled : 10,           //已停用表格每页显示条数
        staffManagePageIndexDisabled : 0,           //已停用表格页码
        staffManageTableLoading : false,            //表格加载状态
        staffManageTableTotal : '',                 //表格数据总数
        staffManageTableContent : [],               //表格数据所有内容
        staffManageSearchVisible : false,           //右边table列表搜索栏是否显示
        staffManageTableSelectedRowKeys : [],       //表格多选选中的数组
        staffManageTableSelectedRow : [],           //表格多选中的对象数组

        /*右边列表新增编辑员工*/
        addOrEditStaffModalType : '',                   //新增编辑员工表单类型('add'/'edit'/'modifyFunction')
        addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
        addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
        addOrEditStaffModalData : {},                   //编辑员工时回填数据
        addOrEditStaffModalLeaderSelect : [],           //通过摘要查询获取汇报对象下拉列表
        addOrEditStaffModalHeadId : [],                 //总部ID，选择所属部门时保存，选择管辖校区时用
        addOrEditStaffModalChooseOrgId : [],            //账号所属选中的校区ID
        addOrEditStaffModalWetherHead : false,          //所属部门如果是总部(true),用来判断管辖校区的显示内容

        /*员工修改状态失败的员工会显示在此表单中*/
        changeStatusOperateStaffNum : undefined,        //总共有多少个员工被改变了状态
        changeStatusFailedModalVisible : false,         //表单是否显示

        //员工需要交接任务列表
        staffManageChangeStatusPageIndex : 0,           //页码
        staffManageChangeStatusPageSize : 10,           //每页条数
        staffManageChangeStatusTableTotal : undefined,  //列表总数
        staffManageChangeStatusTableContent : [],       //列表内容

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible : false,           //选择校区modal是否显示
        selectCampus : [],                          //默认添加的校区选项

        /*表格点击所属机构下方数据时弹出模态框*/
        checkOrgsModalVisible : false,              //查看所属机构模态框是否展示
        checkOrgsModalData : [],                    //查看所属机构机构数据

    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_scfg_user_list') {
                    dispatch({
                        type: 'SearchAllOrganList'
                    });
                    dispatch({
                        type: 'ShowStaffTable',
                        payload:{
                            pageIndex : 0,
                            pageSize : 10,
                            status : 1,
                        }
                    });
                    /*获取搜索栏角色下拉列表的数据*/
                    dispatch({
                        type : 'GetRoleSelect'
                    });
                }
            });
        },
    },

    effects: {
        /*组织结构*/
            /*请求左边组织架构列表数据*/
            *'SearchAllOrganList'({ payload }, { call, put, select }){
                yield put({ type:'showLeftRoleListLoading' });
                let { ret } = yield call(SearchAllOrganList);
                if (ret && ret.errorCode === 9000) {
                    let headId = [];
                    for(let i in ret.results){
                        if((ret.results)[i].headOffice == true){
                            headId.push((ret.results)[i].value);
                        }
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            allOrganList : ret.results,
                            secondOrganArray : ['allOrgan'],
                            addOrEditStaffModalHeadId : headId,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeLeftRoleListLoading' });
            },

            /*新增部门*/
            *'AddSector'({ payload }, { call, put, select }){
                yield put({ type:'showLeftRoleListLoading' });
                let { ret } = yield call(AddSector,parse(payload));
                if (ret && ret.errorCode === 9000) {
                    message.success(ret.errorMessage);
                    payload.secondOrganArray.push(payload.pids + '')
                    yield put({
                        type:'AfterOrganListOperation',
                        payload:{
                            array : payload.secondOrganArray,
                        }
                    });
                    yield put({
                        type: 'updateState',
                        payload: {
                            addOrEditSectorModalVisible : false,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        addOrEditSectorModalButtonLoading : false,
                    },
                });
                yield put({ type:'closeLeftRoleListLoading' });
            },

            /*编辑部门*/
            *'EditSector'({ payload }, { call, put, select }){
                yield put({ type:'showLeftRoleListLoading' });
                let { ret } = yield call(EditSector,parse(payload));
                if (ret && ret.errorCode === 9000) {
                    message.success(ret.errorMessage);
                    payload.secondOrganArray.push(payload.pids + '')
                    yield put({
                        type:'AfterOrganListOperation',
                        payload:{
                            array : payload.secondOrganArray,
                        }
                    });
                    yield put({
                        type: 'updateState',
                        payload: {
                            addOrEditSectorModalVisible : false,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        addOrEditSectorModalButtonLoading : false,
                        addOrEditSectorModalData : {},
                    },
                });
                yield put({ type:'closeLeftRoleListLoading' });
            },

            /*删除部门*/
            *'DeleteSector'({ payload }, { call, put, select }){
                yield put({ type:'showLeftRoleListLoading' });
                let { ret } = yield call(DeleteSector,parse(payload));
                if (ret && ret.errorCode === 9000) {
                    message.success(ret.errorMessage);
                    yield put({
                        type:'AfterOrganListOperation',
                        payload:{
                            array : payload.secondOrganArray,
                        }
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeLeftRoleListLoading' });
            },

            /*新增编辑删除之后的组织架构列表查询操作*/
            *'AfterOrganListOperation'({ payload }, { call, put, select }){
                yield put({ type:'showLeftRoleListLoading' });
                let { ret } = yield call(SearchAllOrganList);
                if (ret && ret.errorCode === 9000) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            allOrganList : ret.results,
                            secondOrganArray : payload.array,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeLeftRoleListLoading' });
            },

        /*员工列表*/
            /*获取搜索栏角色下拉列表数据*/
            *'GetRoleSelect'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let { ret } = yield call(GetRoleSelect,parse(payload));
                if (ret && ret.errorCode === 9000) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            staffManageRoleSelectContent : ret.results,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeRightTableLoading' });
            },

            /*员工列表展示*/
            *'ShowStaffTable'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let res = yield call(ShowStaffTable,parse(payload));
                if (!!res && res.ret && res.ret.errorCode === 9000) {
                    let { ret } = res;
                    let results = ret.results || [];
                    //后台所传roles字段个格式化
                    for(let i = 0 , len = results.length ; i < len ; i++){
                        results[i].formatRoles = '';
                        if(results[i].roles && (results[i].roles).length > 0){
                            for(let j in results[i].roles){
                                results[i].formatRoles += (results[i].roles)[j].role_name+'';
                            }
                        }
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            staffManageTableContent : results,
                            staffManageTableTotal : ret.data && ret.data.resultCount || 0,
                            staffManageTableSelectedRowKeys : [],       //表格多选选中的数组
                            staffManageTableSelectedRow : [],           //表格多选中的对象数组
                        },
                    });
                    if(payload.status == '1'){
                        yield put({
                            type: 'updateState',
                            payload: {
                                staffManagePageIndexUseing : ret.data && ret.data.pageIndex || 0,
                                staffManagePageSizeUseing : ret.data && ret.data.pageSize || 20
                            },
                        });
                    }else if(payload.status == '3'){
                        yield put({
                            type: 'updateState',
                            payload: {
                                staffManagePageIndexDisabled : ret.data && ret.data.pageIndex || 0,         //已停用表格页码
                                staffManagePageSizeDisabled : ret.data && ret.data.pageSize || 20,           //已停用表格每页显示条数
                            },
                        });
                    }
                }else{
                    message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeRightTableLoading' });
            },

            /*列表点击编辑获取详情用于回填*/
            *'GetStaffDetail'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let { ret } = yield call(GetStaffDetail,parse(payload));
                if (ret && ret.errorCode === 9000) {
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalWetherHead : ret.data.headOffice,
                            addOrEditStaffModalChooseOrgId : [parseInt(ret.data.deptPids)],
                        }
                    });
                    //查询当前机构下的汇报对象下拉列表内容
                    yield put({
                        type:'GetLeaderSelect',
                        payload:{
                            orgId : ret.data.orgId
                        }
                    });
                    if(payload.type == 'modifyFunction'){
                        yield put({
                            type: 'updateState',
                            payload: {
                                addOrEditStaffModalType : payload.type,
                            },
                        });
                    }else{
                        yield put({
                            type: 'updateState',
                            payload: {
                                addOrEditStaffModalType : 'edit',
                            },
                        });
                    }
                    let campus = [];
                    for(let i in ret.data.mgrOrgs){
                        campus.push(ret.data.mgrOrgs[i].org_id + '');
                    }
                    yield put({
                        type: 'updateState',
                        payload: {
                            wetherSystemMgr : ret.data.roles && ret.data.roles.legnth > 0 && ret.data.roles[0].role_key == 'admin' ? true : false,                 //是系统管理员
                            addOrEditStaffModalVisible : true,
                            addOrEditStaffModalData : ret.data,
                            selectCampus : campus,
                        },
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeRightTableLoading' });
            },

            /*汇报对象下拉列表内容(包括新增员工时和编辑员工时)*/
            *'GetLeaderSelect'({ payload }, { call, put, select }){
                let { ret } = yield call(GetLeaderSelect,parse(payload));
                if (ret && ret.errorCode === 9000){
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalLeaderSelect : ret.results
                        }
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
            },

            /*新增员工表单提交*/
            *'CreateStaff'({ payload }, { call, put, select }){
                let { ret } = yield call(CreateStaff,parse(payload));
                if (ret && ret.errorCode === 9000){
                    message.success(ret.errorMessage);
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                            selectCampus : [],
                            addOrEditStaffModalLeaderSelect : [],
                        }
                    });
                    yield put({
                        type:'AfterOperationShowStaffTable',
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({
                    type:'updateState',
                    payload:{
                        addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
                    }
                })
            },

            /*编辑员工表单提交*/
            *'UpdateStaff'({ payload }, { call, put, select }){
                let { ret } = yield call(UpdateStaff,parse(payload));
                if (ret && ret.errorCode === 9000){
                    message.success(ret.errorMessage);
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                            selectCampus : [],
                            addOrEditStaffModalLeaderSelect : [],
                        }
                    });
                    yield put({
                        type:'AfterOperationShowStaffTable',
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({
                    type:'updateState',
                    payload:{
                        addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
                    }
                })
            },

            /*修改员工职能提交*/
            *'ChangeStaffFunc'({ payload }, { call, put, select }){
                let { ret } = yield call(ChangeStaffFunc,parse(payload));
                if (ret && ret.errorCode === 9000){
                    if(ret.flag == true){
                        message.success(ret.errorMessage);
                    }else{
                        let userJobInfo = [];
                        if(ret.userJobInfo != '' && ret.userJobInfo != null && ret.userJobInfo != undefined ){
                            userJobInfo.push(ret.userJobInfo);
                        }
                        /*打开未交接员工表单*/
                        yield put({
                            type:'updateState',
                            payload:{
                                changeStatusFailedModalVisible : true,
                                changeStatusOperateStaffNum : ret.failNum + ret.num,
                                staffManageChangeStatusTableTotal : ret.failNum,
                                staffManageChangeStatusTableContent : userJobInfo,
                                staffManageChangeStatusPageIndex : 0,
                                staffManageChangeStatusPageSize : 10,
                            }
                        });
                    }
                    yield put({
                        type:'updateState',
                        payload:{
                            addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                            selectCampus : [],
                            addOrEditStaffModalLeaderSelect : [],
                        }
                    });
                    yield put({
                        type:'AfterOperationShowStaffTable',
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({
                    type:'updateState',
                    payload:{
                        addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
                    }
                })
            },

            /*启用或者停用或者删除员工*/
            *'EnableOrFireOrDeleteStaff'({ payload }, { call, put, select }){
                yield put({ type:'showRightTableLoading' });
                let { ret } = yield call(EnableOrFireOrDeleteStaff,parse(payload));
                if (ret && ret.errorCode === 9000){
                    if(ret.failNum == 0){
                        message.success(ret.errorMessage);
                    }else{
                        /*打开未交接员工表单*/
                        yield put({
                            type:'updateState',
                            payload:{
                                changeStatusFailedModalVisible : true,
                                changeStatusOperateStaffNum : ret.failNum + ret.num,
                                staffManageChangeStatusTableTotal : ret.failNum,
                                staffManageChangeStatusTableContent : ret.userJobInfo,
                                staffManageChangeStatusPageIndex : 0,
                                staffManageChangeStatusPageSize : 10,
                            }
                        });
                    }
                    yield put({
                        type:'AfterOperationShowStaffTable',
                    });
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
                yield put({ type:'closeRightTableLoading' });
            },

            /*新增编辑停用删除操作过后重新查询列表(删除操作可能在使用中操作也可以在已停用中操作，所以要判断当前status)*/
            *'AfterOperationShowStaffTable'({ payload }, { call, put, select }){
                let staffManage = yield select(state => state.staffManage);
                let staffManageSearchContentUseing = staffManage.staffManageSearchContentUseing || {};
                let staffManageSearchContentDisabled = staffManage.staffManageSearchContentDisabled || {};
                let status = staffManage.staffTableType;
                let pageIndex;
                let pageSize;
                let params = {};
                if('1' == status){
                    pageIndex = staffManage.staffManagePageIndexUseing;             //使用中员工的当前页数
                    pageSize = staffManage.staffManagePageSizeUseing;
                    params = { pageIndex,pageSize,status,...staffManageSearchContentUseing };
                }else if('3' == status){
                    pageIndex = staffManage.staffManagePageIndexDisabled;             //已停用员工的当前页数
                    pageSize = staffManage.staffManagePageSizeDisabled;
                    params = { pageIndex,pageSize,status,...staffManageSearchContentDisabled };
                }
                let { ret } = yield call(ShowStaffTable,parse(params));
                if (ret && ret.errorCode === 9000) {
                    /*如果删除或停用时对当前页全部项目操作，则操作成功后请求前一页的数据(当前页已无数据)*/
                    if((ret.results).length == 0 && pageIndex > 0){
                        params.pageIndex = pageIndex-1;     //发送前一页数据请求的页码
                        let { ret } = yield call(ShowStaffTable,parse(params));
                        if (ret && ret.errorCode === 9000) {
                            let results = ret.results;
                            //后台所传roles字段个格式化
                            for(let i in results){
                                results[i].formatRoles = '';
                                if(results[i].roles && (results[i].roles).length > 0){
                                    for(let j in results[i].roles){
                                        results[i].formatRoles += (results[i].roles)[j].role_name+'';
                                    }
                                }
                            }
                            yield put({
                                type: 'updateState',
                                payload: {
                                    staffManageTableContent : results,
                                    staffManageTableTotal : (ret.data).resultCount,
                                    addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                                    addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
                                    staffManageTableSelectedRowKeys : [],           //表格多选选中的数组
                                    staffManageTableSelectedRow : [],               //表格多选中的对象数组
                                },
                            });
                            if('1' == status){
                                yield put({
                                    type : 'updateState',
                                    payload:{
                                        staffManagePageIndexUseing : params.pageIndex
                                    }
                                });
                            }else if('3' == status){
                                yield put({
                                    type : 'updateState',
                                    payload:{
                                        staffManagePageIndexDisabled : params.pageIndex
                                    }
                                });
                            }
                        }else{
                            ret && ret.errorMessage && message.error(ret.errorMessage);
                        }
                    }else{
                        let results = ret.results;
                        //后台所传roles字段个格式化
                        for(let i in results){
                            results[i].formatRoles = '';
                            if(results[i].roles && (results[i].roles).length > 0){
                                for(let j in results[i].roles){
                                    results[i].formatRoles += (results[i].roles)[j].role_name+'';
                                }
                            }
                        }
                        yield put({
                            type: 'updateState',
                            payload: {
                                staffManageTableContent : results,
                                staffManageTableTotal : (ret.data).resultCount,
                                addOrEditStaffModalVisible : false,             //新增编辑员工modal是否显示
                                addOrEditStaffModalButtonLoading : false,       //新增编辑员工modal按钮是否在加载状态
                                staffManageTableSelectedRowKeys : [],           //表格多选选中的数组
                                staffManageTableSelectedRow : [],               //表格多选中的对象数组
                            },
                        });
                        if('1' == status){
                            yield put({
                                type : 'updateState',
                                payload:{
                                    staffManagePageIndexUseing : ret.data.pageIndex
                                }
                            });
                        }else if('3' == status){
                            yield put({
                                type : 'updateState',
                                payload:{
                                    staffManagePageIndexDisabled : ret.data.pageIndex
                                }
                            });
                        }
                    }
                }else if( ret && ret.errorMessage ){
                    ret && ret.errorMessage && message.error(ret.errorMessage);
                }else{
                    message.error('您的网络状况不佳，请检查您的网络');
                }
            },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //左边角色列表加载中
        showLeftOrganListLoading(state,action) {
            return { ...state, ...action.payload, allOrganListLoading: true };
        },
        //左边角色列表加载消失
        closeLeftOrganListLoading(state,action){
            return { ...state, ...action.payload, allOrganListLoading: false };
        },
        //右边功能列表加载中
        showRightTableLoading(state,action) {
            return { ...state, ...action.payload, staffManageTableLoading: true };
        },
        //右边功能列表加载消失
        closeRightTableLoading(state,action){
            return { ...state, ...action.payload, staffManageTableLoading: false };
        },
    },
};
