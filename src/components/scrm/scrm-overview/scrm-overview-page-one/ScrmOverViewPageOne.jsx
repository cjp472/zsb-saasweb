import React from 'react';
import moment from 'moment';
import { Button , Icon , Form , Radio , Spin } from 'antd';
import { Surface, Pie, BarChart, Bar, XAxis, YAxis,ZAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,PieChart, Sector, Cell,Treemap,ReferenceLine,Brush,ScatterChart,Scatter,AreaChart,Area,ResponsiveContainer } from 'recharts';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './ScrmOverViewPageOne.less';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

function ScrmOverViewPageOne ({
    rechartsLoading,            //图表加载状态
    reportData,                 //统计数据
    getStuCount,                //招生总条目数
    defeatPercent,              //击败机构百分比数
    selectOrgId,                //选择校区id
    selectDay,                  //选择日期
    PageOneSelectDay,           //选择日期
    SelectOrg,                  //选择校区方法
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}) {

    /*chart悬浮设置*/
    function ModalTooltip(props){
        if (props.active) {
            const { payload, label } = props;
            return (
                <div className={styles.Popover}>
                    <p className={styles.inner} style={{color:'#666666'}}>{payload[0].payload.name}</p>
                    <p className={styles.inner} style={{color:'#5d9cec'}}>报名数:{payload[0].value}条</p>
                </div>
            );
        }
        return null;
    };

    /*chartshape*/
    function ModalShape(props){
        return(
            <rect style = {{ height : props.height , width : props.width , fill : props.fill , x : props.x , y : props.y , rx : 3 , ry : 3 }}/>
        )
    }


    return (
        <div className={styles.pageOne}>
            <div className={styles.searchContent}>
                {/*
                <div className={styles.searchItem} >
                    <FormItem
                        { ...formItemLayout }
                        label = "选择校区"
                        className='zj_scrm_pageone_choose_org'
                        style={{lineHeight:'13px'}}
                    >
                            { getFieldDecorator('orgId',{
                                initialValue : selectOrgId
                            })(
                                <TenantOrgFilter onChange={SelectOrg} width = { 220 }/>
                            )}
                    </FormItem>
                </div>
                */}
                <div className='zj_scrm_pageone_RadioGroup'>
                    <div className={styles.radioGroup}>
                        <RadioGroup defaultValue="0" onChange={PageOneSelectDay}>
                            <RadioButton value="0">今日</RadioButton>
                            <RadioButton value="1">昨日</RadioButton>
                            <RadioButton value="7">近7日</RadioButton>
                            <RadioButton value="30">近30日</RadioButton>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <div className={styles.AllData}>
                <div className={styles.charts}>
                    <div style={{marginLeft:'40px',height:'13px',lineHeight:'65px'}}>报名数</div>
                    <Spin tip="闪电般的速度加载中..." spinning={rechartsLoading}>
                        <ResponsiveContainer width="100%" height={300} >
                            <BarChart
                                data={reportData}
                                barSize={40}
                                margin={{top: 35, right: 30, left: 20, bottom: 15}} >
                                <XAxis dataKey="modelName" stroke='#666666' tickLine={false} allowDataOverflow={false} strokeWidth={0.5}/>
                                <YAxis stroke="#666666" tickLine={false}/>
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip cursor={false} content={ <ModalTooltip/> }/>
                                <ReferenceLine y={0} stroke='#b4d5fe'/>
                                <Bar dataKey="modelNum" stackId="a" fill="#5d9cec" minPointSize={2} shape = { <ModalShape/> }/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Spin>
                </div>
            </div>
            <div style={{width:'44%',height:'100%',float:'right',position:'relative',color:'#666666',marginLeft:'1%'}}>
                <div style={{width:'100%',textAlign:'center',position:'absolute',top:'14%',paddingRight:'20px',overFlow:'auto'}}>
                    <div style={{fontSize:'16px',marginBottom:'10px'}}>
                        <span style={{color:'#5d9cec'}}>
                            { selectDay == '0' ? '今日' :
                              selectDay == '1' ? '昨日' :
                              selectDay == '7' ? '近7日' :
                              selectDay == '30' ? '近30日' : null
                            }
                        </span>
                        新增总报名数
                    </div>
                    <div style={{fontSize:'60px',height:'53px',lineHeight:'50px',marginBottom:'20px'}}>
                        {getStuCount}
                        <span style={{fontSize:'16px'}}>条</span>
                    </div>
                    { !!defeatPercent || defeatPercent === 0 ?
                        <div style={{fontSize:'16px'}}>击败全国<span style={{color:'#5d9cec'}}>{defeatPercent}</span>的机构</div>
                        :
                        <div style={{fontSize:'16px'}}>暂未统计击败机构百分比</div>
                    }

                </div>
                <img src='//img.ishanshan.com/gimg/img/f4e93704069ea4875e1e3324563d7796' className={styles.page_one_img}/>
            </div>
        </div>
    );
}

export default Form.create()(ScrmOverViewPageOne);
