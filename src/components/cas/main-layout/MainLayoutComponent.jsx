import React, {PropTypes} from 'react';
import styles from './MainLayoutComponent.less';
import PassWordChangeForm from './PassWordChangeForm';
import { Layout, Menu, Icon, Tooltip, Dropdown, Popover,} from 'antd';
import InitGuidePage from '../../../pages/common/init-guide/InitGuidePage';
import UserAgreementPage from '../../../pages/common/user-agreement/UserAgreementPage';

const { Header, Sider, Content } = Layout;

/*
 * 布局文件
 */
function MainLayoutComponent({
    orgInfo,
	routes,children,currentOrgLogoImg,
	applicationList,currentApplication,changeApplication,
	userImg, userName,
	passWordChangeModalVisible,
	passWordChangeModalButtonLoading,
	openPassWord,PassWordChangeModalSubmit,closeChangePassword,
  }) {

  let user_drap_menu = (
    <Menu theme="dark" className={styles.top_user_drap_menu}>
      <Menu.Item key={'update_password'}>
        <a href="javascript:void(0)" className={styles.top_user_drap_menu_text} onClick={openPassWord}>修改密码</a>
      </Menu.Item>
      <Menu.Item key={'logout'}>
        <a href={BASE_URL + '/logout'} className={styles.top_user_drap_menu_text}>注销</a>
      </Menu.Item>
    </Menu>
  );

  let mobile_popover = (
		<div className={styles.connect_popover_cont}>
	  		<img className={styles.connect_popover_img} src='https://img.ishanshan.com/gimg/img/b5e435e322b3ea2b62fce41bdd6939ac'/>
	  	</div>
	)

  let changePassProps = {
  	passWordChangeModalVisible,
	passWordChangeModalButtonLoading,
	PassWordChangeModalSubmit,PassWordChangeModalCancel: closeChangePassword,
  }

  let connect_popover = (
  	<div className={styles.connect_popover_cont}>
  		<img className={styles.connect_popover_img} src='//img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c'/>
  	</div>
  );

  function qqTalk() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=3519232593&site=qq&menu=yes', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
  }

  return (
    <Layout className={styles.main_layout_cont}>
    	<InitGuidePage />
    	<UserAgreementPage />
      <Header className={styles.main_layout_header}>
        <div className={styles.main_layout_header_left}>
            <img src = { !!orgInfo && !!orgInfo.schoolLogo ? orgInfo.schoolLogo : 'https://img.ishanshan.com/gimg/img/fa78332e0d89045a645a31c6f34ef223' } className={styles.org_logo_img_cont}/>
            <span className = { styles.org_logo_name_cont }>{ orgInfo.orgName || '' }</span>
        </div>

        <div className={styles.main_layout_header_right}>
                    <Popover
		        		key = { 'mobile_popover' }
		        		overlayClassName = { styles.connect_popover }
		        		content={ mobile_popover }
		        		title = { null } trigger = "hover" placement = "bottom" >
			          <div className = { styles.main_layout_header_right_item }>
			            <Icon type = "mobile" className = { styles.btn_a_icon } />
			            <div className = { styles.btn_a_text }>移动管理</div>
			          </div>
		          </Popover>
                     <div className={styles.main_layout_header_right_item_split}></div>
	        <div className={styles.main_layout_header_right_item}>
	            {!!false && <Icon type="phone" className={styles.btn_a_icon} />}
	            <div className={styles.btn_a_text} id="BDBridgeFixedWrap" title="在线客服"></div>
	          </div>

	          <div className={styles.main_layout_header_right_item_split}></div>

        	<div className={styles.main_layout_header_right_item}>
            	<div className={styles.btn_a_text} id="qq_talk_warp" title="QQ在线">
	            	<img
	            		alt="QQ在线咨询"
	            		src="//img.ishanshan.com/gimg/img/54cd57420c9b544d280a38f38a0bb392"
	            		className={styles.qq_talk_warp_img}
	            		onClick={qqTalk} />
				</div>
          	</div>

          <div className={styles.main_layout_header_right_item_split}></div>

			<Popover
        		key={'connect_popover'}
        		overlayClassName={styles.connect_popover}
        		content={connect_popover}
        		title={null} trigger="hover" placement="bottom">
	          <div className={styles.main_layout_header_right_item}>
	            <Icon type="question-circle" className={styles.btn_a_icon} />
	            <div className={styles.btn_a_text}>帮助中心</div>
	          </div>
          </Popover>

          <div className={styles.main_layout_header_right_item_split}></div>

          <Dropdown overlay={user_drap_menu}>
            <div className={styles.main_layout_header_right_item}>
              <Icon type="user" className={styles.btn_a_icon} />
              <div className={styles.btn_a_text} style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100px',
                display: 'block',
                overflow: 'hidden',
              }}>{userName}</div>

              <div className={styles.user_text_trigger}>
                <Icon type="cas-right-bottom" className={styles.user_text_trigger_icon}/>
              </div>
            </div>
          </Dropdown>

			{passWordChangeModalVisible ? <PassWordChangeForm {...changePassProps} /> : null}
        </div>

        <div className={styles.header_show_split}></div>
      </Header>

      <Layout className={styles.content_layout_cont}>
        <Sider
          trigger={null}
          width='50'
        >
          <div className={styles.cas_layout_left_cont} >

            {applicationList && applicationList.map(function(item, index) {

              let isCurrentApp = item.appCode == currentApplication;
              return (
                <div className={styles.cas_layout_left_item_cont} key={'cas_layout_left_item_' + index}>
                  <Tooltip placement="right" title={item.name} trigger="hover" >
                  	<div className={isCurrentApp ? styles.cas_layout_left_item_active : styles.cas_layout_left_item}
                  		key={'cas_layout_left_item_' + index}
                  		onClick={()=>changeApplication(item)}
                  	>
                    	<Icon type={item.icon} className={styles.cas_layout_left_item_icon} />
                    </div>
                  </Tooltip>
                </div>
              )
            })}

            <div className={styles.cas_layout_left_bottom_split}></div>
          </div>

        </Sider>
        <Content className={styles.main_layout_content}>
			{children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayoutComponent;
