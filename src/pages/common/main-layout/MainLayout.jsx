import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MainLayoutComponent from '../../../components/common/main-layout/MainLayoutComponent';

function MainLayout({dispatch, location, children, routes, mainLayoutModel}) {

    let {pageMenuCollapsed,pageMenuOpenKeys,} = mainLayoutModel;

    function changeCollapsed(collapsed, type) {
        dispatch({
            type: 'mainLayoutModel/updateState',
            payload: {
                pageMenuCollapsed: collapsed,
            }
        });
    }

    //顶部菜单切换
    function handleMenuChange(menuKey) {
        dispatch(routerRedux.push({
            pathname: menuKey,
        }));
    }

    let mainLayoutProps = {
        children, routes, pageMenuCollapsed,
        changeCollapsed,
        handleMenuChange,
    };

    return (
        <MainLayoutComponent {...mainLayoutProps} />
    );
}

MainLayout.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps({mainLayoutModel}) {
  return {mainLayoutModel};
}

export default connect(mapStateToProps)(MainLayout);
