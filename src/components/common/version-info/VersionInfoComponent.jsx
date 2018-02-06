import React from 'react';
import styles from './VersionInfoComponent.less';
import {Modal, Icon, Tooltip} from 'antd';
import PageModal from '../page-modal/PageModal';

function VersionInfo ({visible, versionInfo, changeVisible, menuType}) {

    let {version,title,details} = versionInfo;

    let tipVersion = (versionInfo && versionInfo.version) || '0.0.0';
    let tipUpdateDate = (versionInfo && versionInfo.updateDate) || '2017-07-06';

    let version_info_render = [];
    let version_info_index = 0;

    details && details.length > 0 && details.map(function(versionItem, vversionIndex) {
        let detailTitle = versionItem.title || '模块名称';
        let detailItems = versionItem.items || [];

        version_info_render.push(
            <div key={'version_info_item_' + version_info_index++} className={styles.content_item_title}>【{detailTitle}】</div>
        )

        detailItems && detailItems.map(function(dItem, dIndex) {
            version_info_render.push(
                <div key={'version_info_item_' + version_info_index++} className={styles.content_item}>
                    {(dIndex+1)}.{dItem}
                </div>
            )
        });
    });

    //收缩菜单时  版本信息展示块
    let common_info_vertical_tip = (
        <div className={styles.common_info_vertical_tip_cont}>
            <div className={styles.sider_menu_version_text}>版本号: {tipVersion}</div>
            <div className={styles.sider_menu_version_text}>更新时间: {tipUpdateDate}</div>
        </div>
    );

    return (

    	<div>

    		<div>
	    		{menuType == 'inline' ?
	                <div className={styles.sider_menu_version_cont} onClick={changeVisible} >
	                    <div className={styles.sider_menu_version_text}>版本号: {tipVersion}</div>
	                    <div className={styles.sider_menu_version_text}>更新时间: {tipUpdateDate}</div>
	                </div>
	                :
	                <div className={styles.sider_menu_version_cont} >
	                    <Tooltip placement="right" title={common_info_vertical_tip} trigger="hover" overlayClassName="left_menu_switch_tip">
	                        <Icon type="info-circle-o" className={styles.sider_menu_version_icon_vertical} onClick={changeVisible} />
	                    </Tooltip>
	                </div>
	            }
    		</div>

	    	<PageModal
	            title='更新提示'
	            visible={visible}
	            maskClosable={true}
	            closable={true}
	            onCancel={changeVisible}
	            onClose={changeVisible}
	            width='600px'
	            footer={null}>

				<div className={styles.modal_version_info}>
					<div className={styles.content}>
						<div className={styles.title_cont}>
							<div className={styles.first_title}>{title||'新版本'}</div>
						</div>

						<div className={styles.text_content}>
							<div className={styles.content_title}>本次更新内容包括 :</div>
							{version_info_render}
						</div>
					</div>
				</div>
	        </PageModal>
    	</div>

    );
}

export default VersionInfo;
