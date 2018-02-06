import React from 'react';
import styles from './MicroGameComponent.less';
import { Button, Input, Spin, Modal,} from 'antd';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import QRCode from 'qrcode.react';
import moment from 'moment';


/**
 * 微游戏管理界面
 */
function MicroGameComponent ({
    dataSource, pageIndex, pageSize, loading, hasMore,
    query,
    gameFrameVisible, gameFrameUrl,
    handleOrgChange,//机构选择切换
    handleGameNameChange,//检索的游戏名称改变时
    handleQueryMore,
    openCreateGame,//打开创建游戏窗口
    closeGameCreateModal,//关闭创建游戏窗口
}) {

	function openBuyModal() {
		Modal.info({
		    title: '游戏开通',
		    content: (
		      <div className={styles.buy_text_cont}>
		        <p className={styles.buy_text_p}>您可以拨打400-660-5733进行游戏开通。</p>
		      </div>
		    ),
		    onOk() {},
		  });
	}

	function gameListScroll() {

		let list_cont = document.getElementById('zsb_micro_game_list_cont_9212');

		if((list_cont.clientHeight + list_cont.scrollTop + 50) >= list_cont.scrollHeight && list_cont.scrollTop > 0 && hasMore && !loading) {
			handleQueryMore && handleQueryMore();
		}
	}

	//根据屏幕宽度计算右间距
	let sc_width = window.innerWidth;//屏幕宽度
	let game_list_width = sc_width - 200 - 35;//游戏列表展示的区域宽度
	let column_num = Math.floor(game_list_width / 220);

	let left_width = game_list_width - column_num * 220;//剩余宽度
	let left_with_item = left_width / (column_num - 1) + 10;

	let gameItemListRender = [];
	dataSource && dataSource.length > 0 && dataSource.map(function(item, index) {

		let bg_img_url = (item.icon && item.icon.length > 0) ? item.icon : '';

		let {btnType, expireTime} = item;
        let flg = btnType != 'OFF';
        if(flg) {
            flg = moment(expireTime, 'YYYY-MM-DD HH:mm:ss') > moment();
        }

		gameItemListRender.push(
			<div className={styles.game_item_cont} key={'game_item_cont_' + index}
				style={{marginRight: ((index + 1) % column_num == 0) ? '10px' : left_with_item + 'px'}}
			>

				<div className={styles.game_item_top_cont}
					style={{backgroundImage: 'url("' + bg_img_url + '")'}}
				>
					<div className={styles.data_info_cont}>
						<span style={{color: '#5D9CEC'}}>{item.allUsers || 0}</span>家机构已经创建
					</div>

					<div className={styles.qrcode_modal_warp}>
						{!!(item.demoUrl && item.demoUrl.length > 0) &&
						<QRCode
							size={130}
							value={item.demoUrl} /> }
					</div>
				</div>

				<div className={styles.game_item_bottom_cont}>

					<div className={styles.game_item_info}>
						<div className={styles.game_item_title}>
							{item.gameTitle}
						</div>

						<div className={styles.game_item_intro} title={item.gameIntro}>
							{item.gameIntro}
						</div>
					</div>

					<div className={styles.game_item_buy_cont}>
						<div className={styles.game_item_price}
							style={{
								opacity: flg ? '0' : '1'
							}}
						>
							￥{item.price}
						</div>

						<div className={styles.game_item_btn_cont}>
							{flg ?
							<Button type="primary" className={styles.game_item_btn} onClick={()=>openCreateGame(item)}>创建</Button>
							:
							<Button type="primary" className={styles.game_item_btn} onClick={openBuyModal}>购买</Button>
							}

						</div>
					</div>
				</div>
			</div>
		);
	});

return (
		<div className={styles.business_page_content}>

			<div className={styles.top_content}>
				{/*
				<div className={styles.filter_org_cont}>
					<TenantOrgSelect
						style={{marginLeft: '10px', width : '100%'}}
						value = { query.selectOrgId }
						onSelect = { handleOrgChange }/>
				</div>
				*/}
				{!!false &&
				<div className={styles.filter_name_cont}>
					<Input
						style={{width : '140px'}}
						placeholder="游戏名称" value={query.moduleName} onChange={handleGameNameChange} />
				</div>}

				{!!false &&
				<div className={styles.top_handle_btn_cont}>
					<Button icon="search" type="primary" className={styles.handle_btn}></Button>
					<Button icon="reload" className={styles.handle_btn}></Button>
				</div>}
			</div>

			<div className={styles.center_content} onScroll={gameListScroll}
				style={{height: 'calc(100% - 50px)'}}
				id="zsb_micro_game_list_cont_9212"
			>

				<div className={styles.game_list_cont} >

					{/*单个游戏的展示块*/}
					{gameItemListRender}
					{/*单个游戏的展示块*/}

				</div>

				{loading ?
					<Spin spinning={loading} tip="加载中..." className={styles.loading_cont}/>
				:
				null
				}

			</div>

			<Modal
	          title="新增微游戏"
	          visible={gameFrameVisible}
	          className={styles.modal_frame_modal}
	          width = "940px"
	          style={{top: '20px'}}
	          footer={null}
	          onCancel = { closeGameCreateModal }
			  maskClosable = { false }
	        >
	          <div className={styles.modal_frame_cont}>
	          	<iframe
	          		src = { gameFrameUrl }
	          		frameBorder="0"
	          		width="917px"
	          		height="100%"
	          		marginHeight="0"
	          		marginWidth="0"
	          		scrolling="auto" ></iframe>
	          </div>
	        </Modal>
		</div>
    );

}


export default MicroGameComponent;
