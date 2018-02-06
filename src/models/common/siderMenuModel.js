import { routerRedux } from 'dva/router';
//侧边栏菜单
export default {

    namespace: 'siderMenuModel',

    state: {
        currentMenu: '',
		selectedKeys: [],//选中的二级菜单
        openModuleMenus: [],//打开的模块菜单
        openSubMenus: [],//打开的菜单

        menuType: 'inline',                 //vertical  /   inline  菜单是否展开
        menuLoading: true,                  //菜单是否 加载中

        menuTreeList: [],                   //所有菜单  tree型结构
        menuRenderInit:false,				//菜单是否渲染过
    },

    effects: {
        *changeMenuType({ payload }, { call, put, select }) {
            let leftMenuModel   = yield select(state => state.siderMenuModel);
            let {menuType} = leftMenuModel;
            let newMenuType = menuType == 'inline' ? 'vertical' : 'inline';

            yield put({
                type: 'updateState',
                payload: {
                    menuType: newMenuType,
                }
            });

            yield put({
                type: 'commonLayoutModel/updateState',
                payload: {
                    collapsed: newMenuType == 'inline' ? false : true,
                }
            });
        },

        *initSiderMenu({ payload }, { call, put, select }) {

        	let {menuTreeList} = payload;

            //打开并调转第一个菜单
            let currentMenu = '', selectedKeys = [], openModuleMenus = [];
            if(menuTreeList && menuTreeList.length >0) {
            	let first_module = menuTreeList[0];
            	if(first_module && first_module.menu_key) {
            		openModuleMenus.push(first_module.menu_key);

            		let first_module_sub_menus = first_module.children;
            		if(first_module_sub_menus && first_module_sub_menus.length > 0) {
            			let first_module_sub_menu = first_module_sub_menus[0];

            			if(first_module_sub_menu && first_module_sub_menu.menu_key) {
            				selectedKeys.push(first_module_sub_menu.menu_key);

            				let third_menus = first_module_sub_menu.children;

            				if(third_menus && third_menus.length > 0) {
            					let first_third_menu = third_menus[0];
            					if(first_third_menu && first_third_menu.menu_key) {
            						currentMenu = first_third_menu.menu_key;
            					}
            				} else {
            					currentMenu = first_module_sub_menu.menu_key;
            				}
            			}
            		}
            	}
            }

            if(currentMenu != '') {
            	yield put(routerRedux.push({
		            pathname: currentMenu,
		        }));
            }

            yield put({
            	type: 'updateState',
            	payload: {
            		menuTreeList, currentMenu, selectedKeys, openModuleMenus,
            	}
            });
            if(window._resource_load_log) {
				console.info('菜单完成其他改造:', new Date().getTime());
			}
            closeLoadingPageShow && closeLoadingPageShow();//loading加载页加载完成
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload, };
        },

        menuOpenChange(state, action) {

            let {openKeys} = action.payload;
            let {menuTreeList} = state;

            let openModuleMenus = [];

            //选中最后选中的一级菜单
            let lastModuleMenuKey = '';
            openKeys && openKeys.map(function(item, index) {
            	let arr = item.split('_');
            	if(arr && arr.length > 0 && arr[0] == 'modulemenu') {
            		lastModuleMenuKey = item;
            	}
            });

            //选中最后选中的二级菜单
            let lastSubMenuKey = '';
            openKeys && openKeys.map(function(item, index) {
            	let arr = item.split('_');
            	if(!(arr && arr.length > 0 && arr[0] == 'modulemenu')) {
            		lastSubMenuKey = item;
            	}
            });

            openModuleMenus.push(lastModuleMenuKey);
            openModuleMenus.push(lastSubMenuKey);
            return { ...state, openModuleMenus, };
        },

        changeCurrentMenu(state, action) {

            let {menuKey} = action.payload;

            return { ...state, currentMenu: menuKey };
        },
    },

}
