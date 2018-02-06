import React, {PropTypes} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import CasMainLayoutComponent from '../../../components/cas/main-layout/MainLayoutComponent';

function MainLayoutPage({dispatch, children, routes, casMainLayoutModel, headerLoginUserInfoModel}) {

  let {orgInfo, applicationList,currentApplication, currentOrgLogoImg} = casMainLayoutModel;

  let {
  	userImg, userName,
  	passWordChangeModalVisible,
  	passWordChangeModalButtonLoading,
  } = headerLoginUserInfoModel;

  function changeApplication(appItem) {

  	if(appItem.appCode == 'koubei') {
  		window.open(appItem.url);
  	} else {
  		window.location = appItem.url;
  	}

  }

 function openPassWord() {
 	dispatch({
      type: 'headerLoginUserInfoModel/updateState',
      payload: {
        passWordChangeModalVisible: true
      }
    });
 }

 /*密码重置提交*/
    function PassWordChangeModalSubmit(data){
        dispatch({
            type:'headerLoginUserInfoModel/ChangePassWord',
            payload:{
                ...data
            }
        });
    }

    /*密码重置modal关闭*/
    function closeChangePassword(){
        dispatch({
            type:'headerLoginUserInfoModel/updateState',
            payload:{
                passWordChangeModalVisible : false,
                passWordChangeModalButtonLoading : false,
            }
        });
    }

    let componentProps = {
        orgInfo,
        children, routes,currentOrgLogoImg,
        applicationList,currentApplication,changeApplication,
        userImg, userName,
        passWordChangeModalVisible,
        passWordChangeModalButtonLoading,
        openPassWord,PassWordChangeModalSubmit,closeChangePassword,
    };

  return (
    <CasMainLayoutComponent {...componentProps} />
  );
}

MainLayoutPage.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps({casMainLayoutModel, headerLoginUserInfoModel}) {
  return {casMainLayoutModel, headerLoginUserInfoModel};
}

export default connect(mapStateToProps)(MainLayoutPage);
