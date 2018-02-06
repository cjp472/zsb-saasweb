import React, {PropTypes} from 'react';
import styles from './HeaderMenu.less';
import { Tabs, Icon } from 'antd';
const TabPane = Tabs.TabPane;

function HeaderMenu({
    routes, handleMenuChange,
}) {
    let headMenuRoutes = [];//顶部菜单列表
    let currentHeadMenu = '';//当前选中的顶部菜单
    if(routes && routes.length > 0) {
        let rootRouter = routes[0];
        if(rootRouter && rootRouter.childRoutes && rootRouter.childRoutes.length > 0) {
            headMenuRoutes = rootRouter.childRoutes;
        }
        if(routes.length > 1) {
            let firstRouter = routes[1];
            currentHeadMenu = firstRouter.path;
        }
    }

    return (
        <div className='common_header_menu_tabs'>
            <Tabs
                 activeKey={currentHeadMenu}
                 onChange={handleMenuChange}
             >
                 {headMenuRoutes && headMenuRoutes.map(function(routeItem, routeIndex) {
                    return (
                        <TabPane key={routeItem.path + '_' + routeIndex} tab={routeItem.breadcrumbName} key={routeItem.path}>{routeItem.breadcrumbName}</TabPane>
                    )
                })}
             </Tabs>
        </div>

    );
}

export default HeaderMenu;
