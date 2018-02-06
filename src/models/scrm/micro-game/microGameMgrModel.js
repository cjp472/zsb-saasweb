import {message} from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import {queryMicroGame} from '../../../services/scrm/micro-game/microGameService';
/*
 * 微游戏管理model
 */
export default {

  namespace: 'microGameMgrModel',

  state: {
    	dataSource: [],
    	pageIndex: 0,
    	pageSize: 10,
    	loading: false,
    	query: {},
    	hasMore: true,
    	gameFrameVisible: false,
    	gameFrameUrl: '',
    	buyModalVisible: false,
	},

	subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {

                if(pathname === '/scrm_wx_wgame_list') {
                	dispatch({
                		type: 'queryDataSource',
                		payload: {
                			pageIndex: 0,
                			pageSize: 20,
                			query: {
                				selectOrgId: window._init_data && window._init_data.firstOrg && window._init_data.firstOrg.key
                			}
                		}
                	});

                	window.addEventListener('message', function(e){
						if( e.data == 'close' ){
							dispatch({
								type: 'updateState',
								payload: {
									gameFrameVisible: false,
									gameFrameUrl: '',
								}
							});
							window.wActivityTimer && clearInterval( window.wActivityTimer );
						}else if( e.data == 'closeAndLink' ){
							dispatch({
								type: 'updateState',
								payload: {
									gameFrameVisible: false,
									gameFrameUrl: '',
								}
							});
							dispatch(
								routerRedux.push('/scrm_wx_myscrm_list')
							);

							window.wActivityTimer && clearInterval(window.wActivityTimer);
						}
			        }, false );
                }
            });
        },
    },


  effects: {
    *queryDataSource({ payload }, { call, put, select }) {
    	yield put({
    		type: 'updateState',
    		payload: {
    			loading: true
    		}
    	});
    	let microGameMgrModel = yield select(state => state.microGameMgrModel);

    	let pageIndex = (payload && payload.pageIndex != undefined) ? payload.pageIndex : microGameMgrModel.pageIndex;
    	let pageSize = (payload && payload.pageSize != undefined) ? payload.pageSize : microGameMgrModel.pageSize;
    	let query = (payload && payload.query != undefined) ? payload.query : microGameMgrModel.query;
    	let orgId = query && query.selectOrgId;
    	let gameName = query && query.moduleName;

    	let params = {
    		pageIndex,pageSize,orgId,
    	}

    	if(gameName && gameName.length > 0) {
    		params.gameName = gameName;
    	}

    	let {ret} = yield call( queryMicroGame, parse(params));

        if( ret && ret.errorCode == 9000 ){

        	yield put({
    			type: 'updateState',
	    		payload: {
	    			pageIndex,pageSize,query,
	    			dataSource: ret.results,
	    			hasMore: ret.results.length < ret.data.resultCount
	    		}
	    	});
        } else {
            message.error((ret && ret.errorMessage) || '微游戏查询出错啦');
        }

    	yield put({
    		type: 'updateState',
    		payload: {
    			loading: false
    		}
    	});
    },

  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
