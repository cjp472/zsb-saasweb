import React, {PropTypes} from 'react';
import { connect } from 'dva';
import ActivityModuleBuildComponent from '../../../components/activity/activity-module-build/ActivityModuleBuildComponent';

function ActivityModuleBuild({dispatch, activityModuleBuildModel}) {
    let {moduleConfigData,currentPageKey,currentPageConfig,activeItemKey,} = activityModuleBuildModel;

    /*在某一页后面增加一页*/
    function onCreatePage(fromIndex) {
        dispatch({
            type: 'activityModuleBuildModel/onCreatePage',
            payload: {
                fromIndex
            }
        });
    }

    /*删除某页*/
    function onRemovePage(fromIndex) {
        dispatch({
            type: 'activityModuleBuildModel/onRemovePage',
            payload: {
                fromIndex
            }
        });
    }

    /*切换当前编辑页面*/
    function changeActivePage(pageKey) {
        dispatch({
            type: 'activityModuleBuildModel/changeActivePage',
            payload: {
                pageKey
            }
        });
    }

    /*编辑页面元素*/
    function updatePageItem(pageKey, itemKey, itemValue) {
        dispatch({
            type: 'activityModuleBuildModel/updatePageItem',
            payload: {
                pageKey, itemKey, itemValue
            }
        });
    }

    /*更改正在编辑的元素*/
    function changeActiveItem(itemKey) {
        dispatch({
            type: 'activityModuleBuildModel/changeActiveItem',
            payload: {
                itemKey
            }
        });
    }

    let componProps = {
        moduleConfigData,currentPageKey,currentPageConfig,
        onCreatePage,onRemovePage,changeActivePage,updatePageItem,
        activeItemKey,changeActiveItem,
    };

    return (
        <ActivityModuleBuildComponent {...componProps} />
    );
}

ActivityModuleBuild.propTypes = {
    dispatch: PropTypes.func,
};

function mapStateToProps({activityModuleBuildModel}) {
  return {activityModuleBuildModel};
}

export default connect(mapStateToProps)(ActivityModuleBuild);
