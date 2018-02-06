import React, {PropTypes} from 'react';
import styles from './PageMenu.less';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

/*
 * 侧边栏菜单
 */
function PageMenu({
    routes, pageMenuCollapsed, handleMenuChange,
}) {

    let menuRoutes = [];//顶部菜单列表
    let pageMenuSelectKeys = [];//当前选中的侧边菜单

    if(routes && routes.length > 1) {
        let rootRouter = routes[1];
        if(rootRouter && rootRouter.childRoutes && rootRouter.childRoutes.length > 0) {
            menuRoutes = rootRouter.childRoutes;
        }
        let lastRouter = routes[routes.length-1];
        pageMenuSelectKeys.push(lastRouter.path);
    }

    let loopPageMenus = data => data.map(function(routeItem, routeIndex) {

        let {path,breadcrumbName,childRoutes,icon} = routeItem;

        let iconNode = (icon == undefined || icon == '') ? null : <Icon type={icon} />;
        if(childRoutes && childRoutes.length > 0) {
            return (
                <SubMenu key={path} title={<span className={styles.sub_menu_cont}>{iconNode}<span className='common_sub_menu_text' >{breadcrumbName}</span></span>}>
                    {loopPageMenus(childRoutes)}
                </SubMenu>
            );
        } else {
            return (
                <MenuItem key={path} title={breadcrumbName}><span className={styles.item_menu_cont}>{iconNode}<span className='common_item_menu_text'>{breadcrumbName}</span></span></MenuItem>
            );
        }
    });

    function handlePageMenuSelect(item) {
        handleMenuChange && handleMenuChange(item.key);
    }

    return (
        <div className={styles.page_menu_cont}>
            <div className='common_page_menu_cont' style={pageMenuCollapsed?{height: 'calc(100vh - 260px)'} : {height: 'calc(100vh - 260px)', overflowY: 'auto'}}>
                <Menu
                     theme="dark"
                     mode={pageMenuCollapsed? 'vertical' : 'inline'}
                     selectedKeys={pageMenuSelectKeys}
                     onSelect={handlePageMenuSelect}
                >
                   {loopPageMenus(menuRoutes)}
                </Menu>
            </div>
        </div>
    );
}

export default PageMenu;
