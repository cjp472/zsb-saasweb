import { parse } from 'qs';
import { message } from 'antd';
export default {

  	namespace: 'orgSelectModel',

  	state: {
		orgSelectModalVisible              : false,               //校区选择框显隐
		orgIdList                          : [],
		headMenuList                       : [],
	},

  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname == '/org_select' ) {

				}
          	});
      	},
  	},

	effects : {
		*openOrgSelectModal({ payload },{ call, put, select }){
			let { orgIdList, headMenuList } = payload;
			let state = yield select( state => state.orgSelectModel );
			yield put({
				type : 'updateState',
				payload : {
					orgSelectModalVisible : true,
					orgIdList,
					headMenuList
				}
			})
		},

		*orgSelectChange({ payload },{ call, put, select }){
			let { value } = payload;
			let state = yield select( state => state.orgSelectModel );
			let headMenuList = state.headMenuList;
			!!headMenuList && headMenuList.map(function( item, index ){
			  if( item.menu_key == 'erp_main' ){
				  item.status = true;
			  }
			  if( value == '1' ){
				  if( item.menu_key == 'cerp' ){
					  item.status = false
				  }
			  }else{
				  if( item.menu_key == 'erp' ){
					  item.status = false
				  }
			  }
		    })
			yield put({
				type: 'headerMenuModel/updateState',
				payload : {
					headMenuList,
				}
			});
			if( value == '1' ){
				let headMenu = 'cerp';
				yield put({
					type: 'mainLayoutModel/changeHeadMenu',
					payload : {
						headMenu
					}
			    });
			}else{
				let headMenu = 'erp';
				yield put({
					type : 'mainLayoutModel/changeHeadMenu',
					payload : {
						headMenu
					}
				})
			}

			window.hasInitMenu = true;
			yield put({
				type: 'mainLayoutModel/updateState',
				payload : {
					hasInitMenu: true,
				}
			});


			//判断是否打开过最新版的版本提示
			yield put({
				type: 'mainLayoutModel/checkVersionInfo'
			});

			yield put({
				type : 'updateState',
				payload : {
					orgSelectModalVisible : false
				}
			})
		}
	},


  	reducers: {
		updateState( state, action ){
			return {...state, ...action.payload};
		},
  	},
}
