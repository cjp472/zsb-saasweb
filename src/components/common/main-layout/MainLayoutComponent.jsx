import React, {PropTypes} from 'react';
import styles from './MainLayoutComponent.less';
import { Layout, Menu, Icon } from 'antd';
import HeaderMenu from '../header-menu/HeaderMenu';
import HeaderSetting from '../header-setting/HeaderSetting';
import PageMenu from '../page-menu/PageMenu';
import Breadcrumb from '../bread-crumb/Breadcrumb';
const { Header, Sider, Content } = Layout;

/*
 * 布局文件
 */
function MainLayoutComponent({
    routes,children,
    pageMenuCollapsed,
    changeCollapsed,
    handleMenuChange,
}) {
    let header_setting_cont_width = 300;
    return (
         <Layout className={styles.main_layout_cont}>
             <Header className={styles.main_layout_header}>
                <div className={styles.org_logo_img_cont}>
                    <img src='//img.ishanshan.com/gimg/img/2a3f846a8b43c903d9a48f32bc8148e5'/>
                </div>
                <div className={styles.header_menu_and_set} style={{width: 'calc(100% - 160px)'}}>
                    <div className={styles.header_menu_cont} style={{width: 'calc(100% - ' +header_setting_cont_width+'px)'}}>
                        <HeaderMenu routes={routes} handleMenuChange={handleMenuChange}/>
                    </div>

                    <div className={styles.header_setting_cont} style={{width: header_setting_cont_width+'px'}}>
                        <HeaderSetting />
                    </div>
                </div>
                <div className={styles.header_show_split}></div>
            </Header>

            <Layout className={styles.content_layout_cont}>
                <Sider
                     trigger={null}
                     collapsible
                     breakpoint="lg"
                     width='130'
                     collapsedWidth="40"
                     collapsed={pageMenuCollapsed}
                     onCollapse={(collapsed, type) => changeCollapsed(collapsed, type)}

                  >
                      <div className={styles.logo_cont} >
                          <div className={styles.logo_and_img_content}>
                              <div className={styles.head_img_cont} style={pageMenuCollapsed?{opacity: 0} : {opacity: 1}}><img src='//img.ishanshan.com/gimg/img/47bf2182aa1b4d18c30179840965fe8b' /></div>
                          </div>

                         <div className={styles.sider_trigger_switch_cont} onClick={()=>changeCollapsed(!pageMenuCollapsed, 'trigger')}>
                            <div className={styles.sider_trigger_switch_topline}></div>
                             <div className={styles.sider_trigger_switch}>
                                 <Icon type={pageMenuCollapsed ? "double-right" : "double-left"} />
                             </div>
                             <div className={styles.sider_trigger_switch_bottomline}></div>
                         </div>
                      </div>

                      <PageMenu routes={routes} pageMenuCollapsed={pageMenuCollapsed} handleMenuChange={handleMenuChange} />
                </Sider>
                <Content className={styles.main_layout_content}>
                    <Breadcrumb routes={routes} routeTo={handleMenuChange}/>

                    <div className={styles.page_cont} style={{height: 'calc(100% - 36px)'}}>
                        <div className={styles.page_content}>
                            {children}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default MainLayoutComponent;
