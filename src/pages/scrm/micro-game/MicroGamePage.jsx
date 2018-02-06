import React, { PropTypes } from 'react';
import { connect } from 'dva';
import MicroGameComponent from '../../../components/scrm/micro-game/MicroGameComponent';

function MicroGamePage({dispatch, microGameMgrModel,}) {

    let {
        dataSource, pageIndex, pageSize, loading, hasMore,
        query,
        gameFrameVisible, gameFrameUrl, buyModalVisible,
    } = microGameMgrModel;

	/*
	 * 滚动加载更多数据
	 */
	function handleQueryMore() {

		dispatch({
			type: 'microGameMgrModel/queryDataSource',
			payload: {
				pageSize: pageSize + 15
			}
		});
	}

	/*机构切换选择时*/
	function handleOrgChange(selectOrgId) {
		dispatch({
			type: 'microGameMgrModel/queryDataSource',
			payload: {
				query: {
					...query,
					selectOrgId
				}
			}
		});
	}

	/*打开创建游戏窗口*/
	function openCreateGame(gameItem) {

		let tenantId       = gameItem.tenantId;
		let orgId          = gameItem.orgId;
		let gameCode       = gameItem.gameCode;
		let gameId         = gameItem.gameId;

		let new_gameFrameUrl = gameItem.provider + '/page?m=create&tenantId='+tenantId+'&orgId='+orgId+'&gameCode='+gameCode+'&gameId='+gameId;

		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				gameFrameVisible: true,
				gameFrameUrl: new_gameFrameUrl,
			}
		});

		//启动定时器   保证seesion有效
		window.wActivityTimer = setInterval(function(){
			serviceRequest(
				BASE_URL + '/organController/getTenant', {}
			)
		}, 600000);
	}

	/*关闭创建游戏窗口*/
	function closeGameCreateModal() {
		dispatch({
			type: 'microGameMgrModel/updateState',
			payload: {
				gameFrameVisible: false,
				gameFrameUrl: '',
			}
		});

		window.wActivityTimer && clearInterval( window.wActivityTimer );
	}

    let componentProps = {
        dataSource, pageIndex, pageSize, loading, hasMore,
        query,
        gameFrameVisible, gameFrameUrl, openCreateGame, closeGameCreateModal,
        handleQueryMore, handleOrgChange,
    };

    return (
        <MicroGameComponent {...componentProps} />
    );
}

MicroGamePage.propTypes = {
  dispatch: PropTypes.func,
  microGameMgrModel: PropTypes.object,
};

function mapStateToProps({microGameMgrModel}) {
  return {microGameMgrModel};
}

export default connect(mapStateToProps)(MicroGamePage);
