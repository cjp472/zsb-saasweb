import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { listToTree, listToGroup, objListSort } from '../../utils/arrayUtils';
import { loadAllMenuList, getOrgPermissionList, getMySubordinates, getOrgIdList, getOrg, GetUserInfo } from '../../services/common/mainLayoutService';
// 全局布局model
export default {

	namespace: 'systemInitModel',

	state: {
		headMenuKey: '',
		allMenuList: [],

		currentUserId: '', //当前登陆用户的编号
		permissionList: [], //当前用户拥有的所有权限
		orgPermissionList: [], //当前用户拥有的机构权限
		subordinates: [], //当前用户拥有的下属
		selectSubordinate: 'my', //选中的下属
		SubordinateType: '', //当前页面类型
		versionInfoVisible: false, //版本更新提示框
		hasInitMenu: false, //是否加载完菜单

		versionInfo: {                                  //版本信息
			version: '4.1.0',                     //版本更新信息-版本号
			title: '闪闪全新版本4.1.0震撼来袭！',
			updateDate: '2018-01-31',             //版本更新信息-更新时间
			details: [
				{
					title: '总部系统',
					items: [
                  	    '总部账号直接登录总部系统',
						'机构总部可以给校区分配套餐，查看数据报表，提供课件服务',
						'机构总部可以选择校区进行统一的在线招生活动',
                        '机构设置建立维护属于自己的早教品牌信息'
					]
				},{
					title: '校区系统',
					items: [
                  	    '系统优化成单校区系统，所有校区选择下拉框取消',
						'业务参数（包括角色管理、业务参数、公海池规则等）各校区独立，再也不会相互影响了',
                        '域名设置移到总部系统',
                        '新增课件服务，校区可查看总部提供的课件',
						'其他功能优化'
					]
				}
			],
		}
	},

	subscriptions: {
		setup({dispatch,history}) {
			history.listen(({
				pathname,
				query
			}) => {
				if(!hasInitMenu) {

					/*加载校区列表*/
					dispatch({
						type: 'GetUserInfo',
					})

					/*加载校区列表*/
					dispatch({
						type: 'getOrgIdList',
					})

                    /*加载校区列表*/
					dispatch({
						type: 'getOrg',
					})

					//加载机构权限
					dispatch({
						type: 'initOrgPermissionList',
					});

					/*加载应用列表*/
					dispatch({
						type: 'casMainLayoutModel/queryApplicationList',
					})

					//加载菜单
					dispatch({
						type: 'initMenuList',
					});

					//加载拥有的下属
					dispatch({
						type: 'initSubordinates',
					});

					//获取顶部机构图片
					dispatch({
						type: 'casMainLayoutModel/queryCurrentOrgLogo',
					});

					//获取顶部用户头像
					dispatch({
						type: 'headerLoginUserInfoModel/queryUserImg',
					});

					//加载系统版本信息
					dispatch({
						type: 'versionInfoModel/initVersionInfo',
					});

					//加载新手引导信息
//					dispatch({
//						type: 'initGuideModel/openGuideFunc',
//					});

					//加载用户协议
					dispatch({
						type: 'userAgreementModel/openUserAgreement',
					});
					//初始化lodop打印配置
					//                  dispatch({
					//                    type: 'lodopPrintModel/initLodopConfing',
					//                  });

					window.changeLeftMenu = function(menuKey) {
						dispatch({
							type: 'siderMenuModel/changeCurrentMenu',
							payload: {
								menuKey,
							}
						});
					}
				}
			});
		},
	},

	effects: {

		/*获取用户信息*/
		*'GetUserInfo'({ payload }, { put, select, call }) {
			const { ret } = yield call(GetUserInfo);
			if (ret && ret.errorCode === 9000) {
				window._current_user_info = {
					orgName: ret.orgName || '',
					orgId: String(ret.orgId) || '',
					tenantId: String(ret.tenantId) || ''
				}
			}
		},

        /*得到当前机构名称以及机构编号*/
        *'getOrg'({ payload },{ call, put, select }){
          let { ret } = yield call( getOrg );
          if( ret && ret.errorCode == 9000 ){
              window._init_data.orgId = ret.orgId;
              window._init_data.cerp_orgId = ret.orgId;
              window._init_data.cerp_orgName = ret.orgName;
              yield put({
                  type : 'casMainLayoutModel/updateState',
                  payload : {
                      orgInfo : ret
                  }
              })
          }else{
              message.error( ret && ret.errorMessage || '校区信息加载失败' )
          }
        },

		/*得到机构列表用来判断是否需要选择校区*/
		*getOrgIdList({ payload }, { call, put, select }) {
			let { ret } = yield call(getOrgIdList);
			if(ret && ret.errorCode == 9000) {
				window._init_data.orgIdList = ret.results;
			}
		},

		/*加载所有菜单*/
		*initMenuList({ payload }, { call, put, select }) {
			let {
				ret
			} = yield call(loadAllMenuList);
			if(window._resource_load_log) {
				console.info('菜单请求加载完成:', new Date().getTime());
			}
			if(ret && ret.errorCode == 9000) {
				let menuList = listToTree(objListSort(ret.results, 'seq_no'), 0);
				if(window._resource_load_log) {
					console.info('菜单完成层级结构的改造:', new Date().getTime());
				}
				yield put({
					type: 'siderMenuModel/initSiderMenu',
					payload: {
						menuTreeList: menuList,
					}
				});

				window.hasInitMenu = true;
				yield put({
					type: 'updateState',
					payload: {
						hasInitMenu: true,
					}
				});

				//判断是否打开过最新版的版本提示
				yield put({
					type: 'checkVersionInfo'
				});
			} else {
				message.error(ret && ret.errorMessage || '查询菜单出错啦');
			}
		},

		/*判断是否打开过最新版的版本提示*/
		* checkVersionInfo({
			payload
		}, {
			call,
			put,
			select
		}) {
			let systemInitModel = yield select(state => state.systemInitModel);
			let {
				versionInfo
			} = systemInitModel;
			let localVersion = (versionInfo && versionInfo.version) || '0.0.0';
			let localVersionKey = 'saas_local_version_' + localVersion;
			//读取本地的localstorage
			let localVersionValue = localStorage.getItem(localVersionKey);

			if(localVersionValue == undefined || localVersionValue == '') {
				//延时显示版本提示
				let sleep = function(ms) {
					return new Promise(function(resolve, reject) {
						setTimeout(function() {
							resolve()
						}, ms);
					});
				}
				yield sleep(2000);
				yield put({
					type: 'changeVersionInfoVisible'
				});
				localStorage.setItem(localVersionKey, "true");
			}

		},

		/*变更顶部一级菜单*/
		* changeHeadMenu({
			payload
		}, {
			call,
			put,
			select
		}) {
			let systemInitModel = yield select(state => state.systemInitModel);
			let {
				allMenuList
			} = systemInitModel;

			if(!hasInitMenu) {
				let {
					ret
				} = yield call(loadAllMenuList);
				systemInitModel = yield select(state => state.systemInitModel);
				allMenuList = systemInitModel.allMenuList;
			}
			let headMenu = payload.headMenu;
			yield put({
				type: 'updateState',
				payload: {
					headMenuKey: headMenu,
				}
			});

			yield put({
				type: 'headerMenuModel/updateState',
				payload: {
					currentMenuKey: headMenu,
				}
			});
			let mapMenuItems = {};
			for(let i = 0; i < allMenuList.length; i++) {
				let {
					menu_key,
					children
				} = allMenuList[i];
				if(menu_key == headMenu) {
					mapMenuItems = children;
					break;
				}
			}

			yield put({
				type: 'leftMenuModel/updateState',
				payload: {
					mapMenuItems,
				}
			});

			//获取第一项可点击的菜单项
			function getFirstMenuItem(menuList) {
				let keys = Object.keys(menuList);
				if(keys && keys.length > 0) {
					let firstKey = keys[0];
					let firstGroup = menuList[firstKey];

					if(firstGroup && firstGroup.length > 0) {
						let firstMenu = firstGroup[0];

						if(firstMenu.children && firstMenu.children.length > 0) {
							return firstMenu.children[0];
						} else {
							return firstMenu;
						}
					}
				}
			}
			let firstMenuItem = getFirstMenuItem(mapMenuItems);

			if(firstMenuItem && firstMenuItem.menu_key != undefined && firstMenuItem.menu_key != '') {
				yield put(routerRedux.push({
					pathname: firstMenuItem.menu_key,
				}));
			}
		},

		/*加载拥有的机构权限*/
		* initOrgPermissionList({
			payload
		}, {
			call,
			put,
			select
		}) {
			let {
				ret
			} = yield call(getOrgPermissionList);
			if(ret && ret.errorCode == 9000) {
				yield put({
					type: 'updateState',
					payload: {
						orgPermissionList: ret.results,
					}
				});
				//缓存用户有管辖权限的机构
				window._init_data.orgPermissionList = ret.results;
				//缓存用户有管辖权限的第一家机构
				if(ret.results && ret.results.length > 0) {
					let orglist = ret.results[0].children;
					let firstOrg = {};
					if(orglist && orglist.length > 0) {
						firstOrg = orglist[0];
						if(firstOrg && firstOrg.pid == '0') {
							//第一家校区是总部时跳过
							if(orglist.length > 1) {
								firstOrg = orglist[1];
							} else {
								orglist = ret.results.length > 1 && ret.results[1].children;
								firstOrg = orglist && orglist.length > 0 && orglist[0];
							}
						}
					}
					window._init_data.firstOrg = firstOrg;
				}
			} else {
				message.error((ret && ret.errorMessage) || '没有获取到机构权限信息');
			}
		},

		/*加载拥有的下属*/
		* initSubordinates({
			payload
		}, {
			call,
			put,
			select
		}) {
			let {
				ret
			} = yield call(getMySubordinates);
			if(ret && ret.errorCode == 9000) {
				yield put({
					type: 'updateState',
					payload: {
						currentUserId: ret.userId,
						subordinates: ret.results,
					}
				});
			} else {
				message.error((ret && ret.errorMessage) || '没有获取到下属信息');
			}
		},
	},

	reducers: {

		updateState(state, action) {
			return { ...state,
				...action.payload,
			};
		},

		changeVersionInfoVisible(state, action) {
			let {
				versionInfoVisible
			} = state;
			return { ...state,
				versionInfoVisible: !versionInfoVisible,
			}
		},
		closeVersionInfoVisible(state, action) {
			return { ...state,
				versionInfoVisible: false,
			}
		},
	},

}
