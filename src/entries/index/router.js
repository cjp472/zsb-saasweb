import React from 'react';
import { Router, Route } from 'dva/router';
import { hashHistory } from 'react-router';

/***********************************基础配置*******************************************************************************************/
import MainLayoutPage from '../../pages/cas/main-layout/MainLayoutPage';
import CommonLayout                             from '../../pages/common/common-layout/CommonLayout';
import NotFound                                 from '../../components/common/not-found/NotFound';

/***********************************营销类*******************************************************************************************/
import ScrmOverView                             from '../../pages/scrm/scrm-overview/ScrmOverView';                            //营销首页
//微信预约
import WxReservationMgr                         from '../../pages/scrm/wx-reservation/WxReservationMgr';                       //微信预约列表
import WxReservationConfig                      from '../../pages/scrm/wx-reservation-set/WxReservationSetPage';               //微信预约设置
//微官网
import WOfficeSetPage                           from '../../pages/scrm/wOffice-set/WOfficeSetPage';                            //微官网设置
import WxBanner                                 from '../../pages/scrm/wx-banner/WxBanner';                                    //微官网首页轮播图
import WxActivityPage                           from '../../pages/scrm/wx-activity/WxActivityPage';                            //微官网下活动
import WxCoursePage                             from '../../pages/scrm/wx-course/WxCoursePage';                                //微官网下课程
import WxCreateActivityPage 					from '../../pages/scrm/wx-activity-create/WxActivityCreatePage';               //微官网下活动

import GetHoliday                               from '../../pages/crm/get-holiday/GetHoliday'                                  //微官网下学员请假
import SweepSigninRecordPage                    from '../../pages/crm/sweepsignin-record/SweepSigninRecordPage';               //微官网-签到记录
//微信营销
import MicroActivity                            from '../../pages/scrm/microActivity/MicroActivity';                           //微活动
import MicroGame                                from '../../pages/scrm/microGame/MicroGame';                                   //微游戏
import MicroLeaflet                             from '../../pages/scrm/microLeaflet/MicroLeaflet1';                            //微传单
import MyMarketing                              from '../../pages/scrm/myMarketing/MyMarketingEntrance';                       //我的营销
//市场活动
import MarketActivity                           from '../../pages/scrm/market/MarketActivityPage';                             //市场活动
import MarketOfflineLeaflets      			 	from '../../pages/scrm/market/MarketOfflineLeafletsPage';             						//线下传单编辑
import MarketMyOfflineLeaflets       			from '../../pages/scrm/market/MarketMyOfflineLeafletsPage';             					//我的传单
import MicroGamePage 							from '../../pages/scrm/micro-game/MicroGamePage';								//微游戏的列表

/***********************************设置**********************************************************************************************/
//系统设置
import RoleManage 	                            from '../../pages/system/role-manage/RoleManage';                               //角色管理
import StaffManage 	                            from '../../pages/system/staff-manage/StaffManage';                             //员工管理
import SystemDicDataMaintenance 	            from '../../pages/system/Maintenance';                                          //业务参数
import AccountCard   		                    from '../../pages/system/account-card/AccountCard';                             //收付款账号
import checkOnWorkAttendance                    from '../../pages/system/check-on-work-attendance/checkOnWorkAttendancePage' ;  //考勤设置
import SecuritySettings                         from '../../pages/system/security-settings/SecuritySettingsPage';               //安全设置
import ClassScheduleTimeSet                     from '../../pages/system/class-schedule-time-set/ClassScheduleTimeSet';         //课程表时间设置
import CourseNumAlert                           from '../../pages/system/course-num-alert/CourseNumAlert';                      //课时预警设置
import DomainNameSetting                        from '../../pages/system/domain-name-setting/DomainNameSetting';                //三级域名设置
import SalarySet                                from '../../pages/system/salary-set/SalarySet';                                 //工资设置
//小票设置
import AttendancePrint                          from '../../pages/system/small-ticket-set/AttendancePrint';                     //考勤打印
import SignInPrint                              from '../../pages/system/small-ticket-set/SignInPrintPage';                        //签到打印
//校区设置
import OrgLogo                                  from '../../pages/system/org-set/org-logo/OrgLogo';                             //机构logo
import OrgManage                                from '../../pages/system/org-set/org-manage/OrgManage';                         //机构管理
//短信业务
import MessagePage                              from '../../pages/system/message/MessagePage';                                  //短信记录
//公海池设置
import leadRecordNoRule                         from '../../pages/system/gong-hai-set/lead-record-no-rule/leadRecordNoRule' ;   //无跟进记录名单规则
import haveMaxList                              from '../../pages/system/gong-hai-set/have-max-list/haveMaxListPage' ;          //最大拥有名单数
import CheckSameRule                            from '../../pages/system/gong-hai-set/check-same-rule/CheckSameRule';           //查重规则
import AccountDetails                           from '../../pages/system/payment-center/account-details/AccountDetailsPage';    //账户明细

export default function ({ history }) {

	return(
		<Router history={hashHistory}>
	      <Route path="/" component={MainLayoutPage} >

				<Route path="scrm" component={CommonLayout} breadcrumbName="营销">
					<Route path="/scrm_homepage" component={ScrmOverView} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_homepage')}/>
		            <Route breadcrumbName="微信预约">
		                <Route path="/scrm_wx_maa_list" breadcrumbName="预约名单" component={WxReservationMgr} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_wx_maa_list')}/>
		                <Route path="/scrm_wx_maa_set"  breadcrumbName="预约设置" component={WxReservationConfig} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_wx_maa_set')}/>
		            </Route>
		            <Route breadcrumbName="微官网">
		                <Route path="/scrm_woffice_set" breadcrumbName="微官网设置" component={WOfficeSetPage} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_set')}/>
						<Route path="/1" breadcrumbName="活动管理" component={WxActivityPage} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_activity')}/>
						<Route path="/scrm_woffice_activity" breadcrumbName="活动管理" component={WxCreateActivityPage} onEnter={() => changeLeftMenu && changeLeftMenu('scrm_woffice_activity')} />
		                <Route path="/scrm_woffice_course" breadcrumbName="课程管理" component={WxCoursePage} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_course')}/>
		                <Route path="/scrm_woffice_banner" breadcrumbName="首页轮播图" component={WxBanner} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_banner')}/>
		                <Route path="/scrm_woffice_vocation"  breadcrumbName="请假申请" component={GetHoliday} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_vocation')}/>
		                <Route path="/scrm_woffice_sign"  breadcrumbName="签到记录" component={SweepSigninRecordPage} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_woffice_sign')}/>
		            </Route>
		            <Route breadcrumbName="微互动">
		                <Route path="/scrm_wx_wact_list" breadcrumbName="微活动" component={MicroActivity} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_wx_wact_list')}/>
		                <Route path="/scrm_wx_wgame_list" breadcrumbName="微游戏" component={MicroGamePage} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_wx_wgame_list')}/>
		                <Route path="/scrm_wx_myscrm_list" breadcrumbName="我的互动" component={MyMarketing} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_wx_myscrm_list')}/>
		            </Route>
		            <Route breadcrumbName="市场管理">
		                <Route path="/scrm_market_activity" breadcrumbName="市场活动" component={MarketActivity} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_market_activity')}/>
		                <Route path="/scrm_offline_leaflets" breadcrumbName="线下传单" component={MarketOfflineLeaflets} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_offline_leaflets')}/>
						<Route path="/scrm_my_offline_leaflets" breadcrumbName="我的传单" component={MarketMyOfflineLeaflets} onEnter={()=> changeLeftMenu && changeLeftMenu('scrm_my_offline_leaflets')}/>
	            	</Route>
	           </Route>

	          <Route path="sys" component={CommonLayout} breadcrumbName="设置" >

	           		<Route breadcrumbName="系统设置">
		                <Route path="/sys_scfg_role_list" breadcrumbName="角色管理" component={RoleManage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_role_list')}/>
		                <Route path="/sys_scfg_user_list" breadcrumbName="员工管理" component={StaffManage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_user_list')}/>
		                <Route path="/sys_scfg_param_set" breadcrumbName="业务参数" component={SystemDicDataMaintenance} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_param_set')}/>
		                <Route path="/sys_scfg_payacct_list" breadcrumbName="收付款账号" component={AccountCard} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_payacct_list')}/>
		                <Route path="/sys_cfg_sign" breadcrumbName="考勤设置" component={checkOnWorkAttendance} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_cfg_sign')}/>
		                <Route path="/sys_scfg_safety" breadcrumbName="安全设置" component={SecuritySettings} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_safety')}/>
		                <Route path="/sys_scfg_cptime" breadcrumbName="课程表时段" component={ClassScheduleTimeSet} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_cptime')}/>
		                <Route path="/sys_scfg_pr" breadcrumbName="续费提醒" component={CourseNumAlert} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_pr')}/>
		                <Route path="/sys_scfg_host" breadcrumbName="域名设置" component={DomainNameSetting} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_scfg_host')}/>
		                <Route path="/sys_salary_set" breadcrumbName="工资设置" component={SalarySet} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_salary_set')}/>
	            	</Route>

	            	<Route breadcrumbName="校区设置">
		                <Route path="/sys_org_logo_set" breadcrumbName="校区logo" component={OrgLogo} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_org_logo_set')}/>
		                <Route path="/sys_org_list" breadcrumbName="校区管理" component={OrgManage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_org_list')}/>
	            	</Route>

	            	<Route breadcrumbName="短信业务">
						<Route path="/sys_sms_record" breadcrumbName="短信记录" component={MessagePage} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sms_record')}/>
					</Route>

	            	<Route breadcrumbName="小票设置">
						<Route path="/sys_rece_kq_list" breadcrumbName="考勤小票" component={AttendancePrint} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_rece_kq_list')}/>
	                	<Route path="/sys_ticket_sign" breadcrumbName="签到打印" component={SignInPrint} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_ticket_sign')}/>
					</Route>

		            <Route breadcrumbName="公海池设置">
		                <Route path="/sys_sea_follow" breadcrumbName="跟进名单规则" component={leadRecordNoRule} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_follow')}/>
		                <Route path="/sys_sea_maxnum" breadcrumbName="拥有名单数规则" component={haveMaxList} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_maxnum')}/>
		                <Route path="/sys_sea_repetrule" breadcrumbName="查重规则" component={CheckSameRule} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_sea_repetrule')}/>
		            </Route>

		            <Route breadcrumbName="支付中心">
		                 <Route path="/sys_pay_account" breadcrumbName="账户明细" component={AccountDetails} onEnter={()=> changeLeftMenu && changeLeftMenu('sys_pay_account')}/>
		            </Route>

	           </Route>

           	<Route path="other" component={CommonLayout} >
	            <Route path="/*" breadcrumbName="未定义页面" component={NotFound} onEnter={()=> changeLeftMenu && changeLeftMenu('not_found')}/>
	        </Route>
		</Route>
    </Router>
	);
}

