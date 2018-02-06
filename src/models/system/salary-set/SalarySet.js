import {
    GetRoleSelectContent,           //搜索栏获取角色下拉列表内容,之后查询列表
    QueryList,                      //列表查询(列表无删除操作，无需进行查询后零数据判断)
    GetCourseSummary                //打开工资设置modal时获取课程下拉列表内容
} from '../../../services/system/salary-set/SalarySet';
import { parse } from 'qs';
import { message } from 'antd';

export default {

	namespace: 'salarySet',

	state: {
        /*common*/
        courseSelectContent : [],   //课程下拉列表内容

        /*table*/
        newColumns : [],            //table显示项数组
        loading : false,            //table加载状态
        pageIndex : 0,              //table页码
        pageSize : 20,              //table每页条数
        total : 0,                  //table数据总条数
        dataSource : [],            //table数据
        selectedRowKeys : [],       //table复选框选中项的key数组
        selectedRows : [],          //table复选框选中项的数组

        /*快捷搜索*/
        roleSelectContent : [],     //角色下拉列表搜索框内容
        fastSearchContent : {},     //快捷搜索搜索内容

        /*设置工资modal*/
        setSalaryModalVisible : false,          //modal是否显示
        setSalaryModalLoading : false,          //modal加载状态
        setSalaryModalButtonLoading : false,    //modal按钮加载状态
        setSalaryModalData : {},                //编辑时回填数据
        setSalaryCourseCommission : [],         //课时提成渲染数组
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if(pathname === '/sys_salary_set') {
                    //搜索栏获取角色下拉列表内容,之后查询列表
                    dispatch({
                        type : 'GetRoleSelectContent'
                    });
				}
			});
		},
	},

	effects: {
        //搜索栏获取角色下拉列表内容,之后查询列表
        *'GetRoleSelectContent'({payload}, {put, call, select}){
            let { ret } = yield call(GetRoleSelectContent,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type : 'updateState',
                    payload : {
                        roleSelectContent : ret.results
                    }
                })
                yield put({
                    type : 'QueryList',
                    payload : {
                        pageIndex : 0,
                        pageSize : 20
                    }
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取角色信息失败')
            }
        },

        //列表查询(列表无删除操作，无需进行查询后零数据判断)
        *'QueryList'({payload}, {put, call, select}){
            let dataSource = [];
            for(let i=0;i<30;i++){
                dataSource.push({
                    name : i
                })
            }
            yield put({
                type : 'updateState',
                payload : {
                    dataSource
                }
            })
//            yield put({ type : 'showLoading' });
//            let fastSearchContent = !!payload && !!payload.fastSearchContent ? payload.fastSearchContent : {};
//            delete payload.fastSearchContent;
//            let params = { ...payload , ...fastSearchContent };
//            let { ret } = yield call(QueryList,parse(params));
//            if(ret && ret.errorCode == '9000'){
//                yield put({
//                    type : 'updateState',
//                    payload : {
//                        pageIndex : ret.data.pageIndex,
//                        pageSize : ret.data.pageSize,
//                        total : ret.data.resultCount,
//                        dataSource : ret.results,
//                        selectedRowKeys : [],
//                        selectedRows : [],
//                        fastSearchContent
//                    }
//                })
//            }else{
//                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取工资设置列表失败')
//            }
//            yield put({ type : 'closeLoading' });
        },

        //打开工资设置modal时获取课程下拉列表内容
        *'GetCourseSummary'({payload}, {put, call, select}){
            yield put({ type : 'updateState' , payload : { setSalaryModalVisible : true } });
            yield put({ type : 'showSetSalaryModalLoading' })
            let { ret } = yield call(GetCourseSummary,parse(payload));
            if(ret && ret.errorCode == '9000'){
                for(let i in ret.results){
                    ret.results[i].display = true;
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        courseSelectContent : ret.results,
                    }
                })
                //获取老师工资设置的详情信息
                yield put({
                    type : 'GetTeacherDetail'
                })
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : '获取课程信息失败');
                yield put({ type : 'updateState' , payload : { setSalaryModalVisible : false } });
            }
            yield put({ type : 'closeSetSalaryModalLoading' })
        },

        //获取老师工资设置的详情信息
        *'GetTeacherDetail'({payload}, {put, call, select}){
            let salarySet = yield select(state => state.salarySet);
            let courseSelectContent = salarySet.courseSelectContent;
            let courseChooseContent = [];       //初始化已选中课程数组
            let setSalaryModalData = {
                baseSalary : 100,
                subsidy : 20,
                commission : [
                    { courseId : '340901710685933568' , royaltyMethod : '1' , payMethod : '2' ,
                     gradientOne : [{ time : '0' , money : '100' },{ time : '2' , money : '200' }] ,
                     gradientTwo : [{ time : '0' , money : '100' },{ time : '2' , money : '200' }] ,
                     gradientThree : [],
                     personMoney : '1',
                    },
                    { courseId : '359638333854318592' , royaltyMethod : '2' , payMethod : '2' ,
                     gradientOne : [{ time : '0' , money : '300' },{ time : '4' , money : '400' }] ,
                     gradientTwo : [{ time : '0' , money : '100' },{ time : '2' , money : '200' }] ,
                     gradientThree : [{ time : '0' , money : '100' },{ time : '2' , money : '200' }] ,
                     courseMoney : '2',
                    },
                    { courseId : '359637804050808832' , royaltyMethod : '3' , payMethod : '2' ,
                     gradientOne : [{ time : '0' , money : '300' },{ time : '4' , money : '400' }] ,
                     gradientTwo : [{ time : '0' , money : '100' },{ time : '2' , money : '200' }] ,
                     gradientThree : [{ time : '0' , money : '100' },{ time : '2' , money : '100' }] ,
                     rate : '50'
                    }
                ],
                //commission : []
            }
            let setSalaryCourseCommission = [];             //初始化工资设置modal中的课时提成数组
            if(setSalaryModalData && setSalaryModalData.commission && setSalaryModalData.commission.length > 0){
                let Commission = setSalaryModalData.commission;
                for(let i in Commission){
                    courseChooseContent.push(Commission[i].courseId);        //添加已选中课程数组
                    Commission[i].zj_parent_index = i;                       //为课程增加zj_parent_index(唯一,'0','1'...)

                    //按到课人次梯度
                    if(Commission[i].gradientOne && Commission[i].gradientOne.length > 0){
                        let Gradient = Commission[i].gradientOne;
                        for(let j in Gradient){
                            Gradient[j].zj_parent_index = i;            //zj_parent_index(唯一)
                            Gradient[j].zj_son_index = j;               //zj_son_index(唯一)
                        }
                    }else{
                        Commission[i].gradientOne = [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }];
                    }

                    //按授课节数梯度
                    if(Commission[i].gradientTwo && Commission[i].gradientTwo.length > 0){
                        let Gradient = Commission[i].gradientTwo;
                        for(let j in Gradient){
                            Gradient[j].zj_parent_index = i;            //zj_parent_index(唯一)
                            Gradient[j].zj_son_index = j;               //zj_son_index(唯一)
                        }
                    }else{
                        Commission[i].gradientTwo = [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }];
                    }

                    //按消课金额梯度
                    if(Commission[i].gradientThree && Commission[i].gradientThree.length > 0){
                        let Gradient = Commission[i].gradientThree;
                        for(let j in Gradient){
                            Gradient[j].zj_parent_index = i;            //zj_parent_index(唯一)
                            Gradient[j].zj_son_index = j;               //zj_son_index(唯一)
                        }
                    }else{
                        Commission[i].gradientThree = [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }];
                    }
                }
                for(let i in courseSelectContent){
                    //从以选中的课程数组中找出相应课程置灰下拉列表选项
                    if(courseChooseContent.indexOf(courseSelectContent[i].id) > -1){
                        courseSelectContent[i].display = false;
                    }
                }
                setSalaryCourseCommission = Commission;                      //格式化课程提成数组
            }else{
                //当前老师未设置过工资
                setSalaryCourseCommission = [{
                    zj_parent_index : '0',
                    courseId : courseSelectContent && courseSelectContent.length > 0 ? courseSelectContent[0].id : undefined,  //如果有课程默认选中课程第一个
                    royaltyMethod : '1' ,                               //提成方式默认选中第一个
                    payMethod : '1',                                    //计算方式默认选中第一个
                    gradientOne : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                    gradientTwo : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                    gradientThree : [{ time : '0' , money : undefined , zj_parent_index : '0' , zj_son_index : '0' }],
                }];
                //置灰第一项
                if(courseSelectContent && courseSelectContent.length > 0){
                    courseSelectContent[0].display = false;
                }
            }
            yield put({
                type : 'updateState',
                payload : {
                    setSalaryModalData,
                    courseSelectContent,
                    setSalaryCourseCommission
                }
            })
        },
	},

	reducers: {
		updateState( state, action ) {
			return { ...state, ...action.payload };
		},
        showLoading( state, action ) {
			return { ...state, loading : true };
		},
        closeLoading( state, action ) {
			return { ...state, loading : false };
		},
        showSetSalaryModalLoading( state, action ) {
			return { ...state, setSalaryModalLoading : true };
		},
        closeSetSalaryModalLoading( state, action ) {
			return { ...state, setSalaryModalLoading : false };
		},
        //使课程下拉列表项可选或置灰
        courseSelectOperation( state, action ) {
            let courseSelectContent = state.courseSelectContent;
            let courseId = action.payload.courseId;
            let display = action.payload.display;
            for(let i in courseSelectContent){
                if(courseId == courseSelectContent[i].id){
                    courseSelectContent[i].display = display;
                    break;
                }
            }
			return { ...state, courseSelectContent };
		},
        CourseCommissionOperation( state, action ) {
            let setSalaryCourseCommission = state.setSalaryCourseCommission;
            let payload = action.payload;
            if(payload.type == 'add'){
                setSalaryCourseCommission.push({
                    zj_parent_index : (parseFloat(payload.zj_parent_index) + 1) + '',
                    courseId : undefined,
                    royaltyMethod : '1',
                    payMethod : '1',
                    gradientOne : [{ time : '0' , money : undefined , zj_parent_index : (parseFloat(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                    gradientTwo : [{ time : '0' , money : undefined , zj_parent_index : (parseFloat(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                    gradientThree : [{ time : '0' , money : undefined , zj_parent_index : (parseFloat(payload.zj_parent_index) + 1) + '' , zj_son_index : '0' }],
                })
            }else{
                for(let i in setSalaryCourseCommission){
                    if(setSalaryCourseCommission[i].zj_parent_index == payload.zj_parent_index){
                        switch(payload.type){
                            case 'delete' : setSalaryCourseCommission.splice(i,1) ; break ;
                            case 'RoyaltyMethodOnChange' : setSalaryCourseCommission[i].royaltyMethod = payload.key ; break ;
                            case 'PayMethodOnChange' : setSalaryCourseCommission[i].payMethod = payload.key ; break ;
                            case '1-1_fix' : setSalaryCourseCommission[i].personMoney = payload.value ; break ;
                            case '2-1_fix' : setSalaryCourseCommission[i].courseMoney = payload.value ; break ;
                            case '3-1_fix' : setSalaryCourseCommission[i].rate = payload.value ; break ;
                        }
                        break;
                    }
                }
            }
			return { ...state, setSalaryCourseCommission };
		},
        GradientOperation( state, action ) {
            let setSalaryCourseCommission = state.setSalaryCourseCommission;
            let payload = action.payload;
            let type = action.payload.type;
            for(let i in setSalaryCourseCommission){
                if(setSalaryCourseCommission[i].zj_parent_index == payload.zj_parent_index){
                    if(type == 'add'){
                        /*gradient数组的长度始终大于等于1*/
                        let son_index = setSalaryCourseCommission[i][payload.groupName][setSalaryCourseCommission[i][payload.groupName].length - 1].zj_son_index;
                        setSalaryCourseCommission[i][payload.groupName].push({
                            time : undefined ,
                            money : undefined ,
                            zj_parent_index : payload.zj_parent_index,
                            zj_son_index : (parseFloat(son_index) + 1) + ''
                        });
                    }else{
                        for(let j in setSalaryCourseCommission[i][payload.groupName]){
                            if(setSalaryCourseCommission[i][payload.groupName][j].zj_son_index == payload.zj_son_index){
                                if(type == 'delete'){
                                    setSalaryCourseCommission[i][payload.groupName].splice(j,1);
                                }else if(type == 'time' || type == 'money'){
                                    setSalaryCourseCommission[i][payload.groupName][j][type] = payload.value;
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            return { ...state, setSalaryCourseCommission };
        }
	},
}
