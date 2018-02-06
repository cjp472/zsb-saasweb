import React from 'react';
import { message } from 'antd';

import OrgLogo from '../../../../components/system/org-set/org-logo/OrgLogo';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function OrgLogoPages({ dispatch, orgLogo }) {

    let {
        componentsExist,            //组件是否挂载
        imgUrl,                     //图片地址
        saveButtonLoading,          //保存按钮加载状态
        useDefaultButtonLoading,    //使用默认图按钮加载状态
	} = orgLogo;

    /*点击保存*/
    let UpdateOrgLogo = function(value){
        dispatch({
            type : 'orgLogo/SaveOrgPic',
            payload : {
                imgurl : value[0].response.data.url || value[0].url
            }
        });
    }

    /*点击使用默认图*/
    let UseDefaultPic = function(){
        dispatch({
            type : 'orgLogo/SaveOrgPic',
            payload : {
                imgurl : '//img.ishanshan.com/gimg/img/eb73205f82a0534f91b521a1789b5ef8'
            }
        });
    }

    let orgLogoProps = {
        componentsExist,            //组件是否挂载
        imgUrl,                     //图片地址
        saveButtonLoading,          //保存按钮加载状态
        useDefaultButtonLoading,    //使用默认图按钮加载状态
        UpdateOrgLogo,              //点击保存校区logo图片
        UseDefaultPic,              //点击使用默认图
    }

    let headerOrgInfoProps = {
        imgUrl,
    };

    return(
        <div>
            { componentsExist == true ?
                <OrgLogo {...orgLogoProps}/>
                :
                null
            }
        </div>
    );
}

function mapStateToProps({ orgLogo }) {
  return { orgLogo };
}

export default connect(mapStateToProps)(OrgLogoPages);
