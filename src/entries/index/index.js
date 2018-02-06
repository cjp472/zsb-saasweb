import dva from 'dva';
import '../../utils/request';
import './index.css';
import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

message.config({
  duration: 3,
});

/*
 * 前端缓存数据
 * orgPermissionList array 当前登陆用户的机构权限
 * firstOrg object 第一家机构
 * signBySelf object 自主签到的数据
 */
window._init_data = {};

window.hasInitMenu = false;
window.changeLeftMenu = function() {};//变更头部菜单函数，变更侧边栏菜单

/*
 * 微活动 相关工具方法
 */
window.timer;
window.gameIframeCloseAction;               //关闭窗口
window.gameIframeCloseAndRefreshAction;     //关闭窗口并刷新

window.BASE_URL = window.BASE_URL||'/zsb-web';

window.BASE_UPLOAD_IMAGE = `${window.BASE_URL}/uploadController/upload` || '/thinknode/upload/image';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
/***********************************基础配置*******************************************************************************************/
app.model(require('../../models/common/systemInitModel'));                                                     //系统初始化数据
app.model(require('../../models/common/headerLoginUserInfoModel'));                                           //顶部当前登陆用户信息
app.model(require('../../models/common/orgSelectModel'));                                                     //校区选择框
app.model(require('../../models/common/commonLayoutModel'));                                                  //公共布局 - 左右布局
app.model(require('../../models/common/siderMenuModel'));                                                      //侧边栏 - 菜单
app.model(require('../../models/cas/mainLayoutModel'));
app.model(require('../../models/common/versionInfoModel'));																										//系统版本信息
app.model(require('../../models/common/initGuideModel'));																										//新手引导信息
app.model(require('../../models/common/userAgreementModel'));																										//新手引导信息

 /***********************************营销类*******************************************************************************************/
app.model(require('../../models/scrm/scrm-overview/ScrmOverView'));
app.model(require('../../models/scrm/wx-template/wxTemplateModel'));
app.model(require('../../models/activity/activityModuleBuildModel'));                                         //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓微活动模板化↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
app.model(require('../../models/scrm/wx-activity/microModuleFormModel'));                                     //自定义微模板的机构配置表单界面
app.model(require('../../models/scrm/wx-reservation/wxReservationMgrModel'));                                 //微信预约列表
app.model(require('../../models/scrm/wx-reservation-set/wxReservationSetModel'));                             //微信预约设置
app.model(require('../../models/scrm/wOffice-set/wOfficeSetModel'));                                          //微官网设置
app.model(require('../../models/scrm/wx-activity/wxActivityModel'));                                          //微官网下活动
app.model(require('../../models/scrm/wx-activity-create/wxActivityCreateModel'));                             //微官网下新活动
app.model(require('../../models/scrm/wx-course/wxCourseModel'));                                              //微官网下课程
app.model(require('../../models/scrm/wx-banner/WxBanner'));                                                   //微官网首页轮播管理
app.model(require('../../models/scrm/market/marketModel'));                              						//市场活动
app.model(require('../../models/scrm/market/marketOfflineLeafletsModel'));                              		//线下传单
app.model(require('../../models/scrm/market/marketMyOfflineLeafletsModel'));                               	//我的传单
app.model(require('../../models/scrm/micro-game/microGameMgrModel'));                          							//微游戏

app.model(require('../../models/crm/get-holiday/GetHoliday'));                               	              //
app.model(require('../../models/crm/sweepsignin-record/sweepSigninRecordModel'));                           //

/***********************************设置**********************************************************************************************/
app.model(require('../../models/system/RoleManage'));                                                          //角色管理
app.model(require('../../models/system/StaffManage'));                                                         //员工管理
app.model(require('../../models/system/org-set/OrgLogo'));                                                     //机构logo
app.model(require('../../models/system/org-set/OrgManage'));                                                   //机构管理
app.model(require('../../models/system/small-ticket-set/AttendancePrint'));                                    //考勤小票
app.model(require('../../models/system/small-ticket-set/signInPrintModel'));                                   //签到打印
app.model(require('../../models/system/maintenanceModel'));    	                                             //数据字典维护
app.model(require('../../models/system/course-num-alert/CourseNumAlert'));    	                             //课时预警设置
app.model(require('../../models/system/domain-name-setting/DomainNameSetting'));    	                         //三级域名设置
app.model(require('../../models/system/salary-set/SalarySet'));    	                                         //工资设置

app.model(require('../../models/system/class-schedule-time-set/ClassScheduleTimeSet'));                        //课程表时段设置
app.model(require('../../models/system/gong-hai-set/check-same-rule/CheckSameRule'));                          //课程表时段设置
app.model(require('../../models/system/security-settings/SecuritySettingsModel'));                             //安全设置
app.model(require('../../models/system/gong-hai-set/lead-record-no-rule/leadRecordNoRuleModel'));              //无记录跟进名单
app.model(require('../../models/system/gong-hai-set/have-max-list/haveMaxListModel'));                         //最大拥有名单数
app.model(require('../../models/system/check-on-work-attendance/checkOnWorkAttendanceModel'));                 //考勤设置
app.model(require('../../models/system/payment-center/account-details/AccountDetailsModel'));                  //支付中心>账户明细
app.model(require('../../models/system/account-card/accountCardModel'));                                       //支付方式
app.model(require('../../models/system/account-card/accountCardFormModel'));                                   //支付方式
app.model(require('../../models/system/message/messageModel'));                                                //短信业务列表

app.model(require('../../models/common/veryCodeButtonModel'));                                                 //验证码按钮
app.model(require('../../models/common/countDownMsModel'));                                                 	//ms倒计时

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
