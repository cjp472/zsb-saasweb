import React from 'react';
import { Icon} from 'antd';
import SiderMenuItem from './SiderMenuItem';
import styles from './SiderMenuComponent.less';
import VersionInfoPage from '../../../pages/common/version-info/VersionInfoPage'

function SiderMenuComponent ({
    menuLoading,currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,tipVersion,tipUpdateDate,updateMenuRenderInit,
    subMenuOpenChange,menuOnSelect,changeLeftMenuType,changeVersionVisible,

    menuOpenChange,   //切换模块菜单
	menuSelectChange, //点击子菜单
}) {

    let top_header_height = '50px';

    let siderMenuItemProps = {
        currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,updateMenuRenderInit,
        menuOpenChange, menuSelectChange
    };

    return (
        <div className={styles.sider_menu_cont}>

            <div className={styles.sider_menu_trigger_cont} >
            	<div className={styles.system_name}>
            		招生宝
            	</div>
            </div>

            <div className={styles.sider_menu_content} style={{height: 'calc(100vh - 100px - ' + top_header_height + ')'}}>
                <SiderMenuItem {...siderMenuItemProps} />
            </div>

			<VersionInfoPage menuType={menuType} />

        </div>
    );
}

export default SiderMenuComponent;
