import React from 'react';
import { message } from 'antd';

import LeadRecordNoRuleComponent from '../../../../components/system/gong_hai_set/lead-record-no-rule/lead-record-no-rule';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function LeadRecordNoRule({ dispatch, leadRecordNoRule }) {

    let {
        loading,                    //是否加载状态
        dataKey,
        Status,                     //input框状态
        checkedstatus,              //单选按钮选中状态
	} = leadRecordNoRule;



    //保存选项
    function SaveLeadRecordNoRule(data){
        dispatch({
            type:'leadRecordNoRule/SaveLeadRecordRule',
            payload:{
               value:data,
               confKey:'BACKTOCLUEPOOLDAY'
            }
        });
    }
    function stopStatus(data){

        dispatch({
            type:'leadRecordNoRule/updateState',
            payload:{
               checkedstatus :data
            }
        });

    }
    let LeadRecordNoRuleComponentProps = {
        loading,                    //是否加载状态
        SaveLeadRecordNoRule,         //保存事件
        dataKey,
        Status,
        stopStatus,
        checkedstatus,           //单选按钮选中状态
    };

    return(
        <div>
            <LeadRecordNoRuleComponent {...LeadRecordNoRuleComponentProps}/>
        </div>
    );
}

function mapStateToProps({ leadRecordNoRule }) {
  return { leadRecordNoRule };
}

export default connect(mapStateToProps)(LeadRecordNoRule);
