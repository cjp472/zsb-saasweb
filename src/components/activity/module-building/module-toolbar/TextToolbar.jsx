import React, {PropTypes} from 'react';
import styles from './ToolBar.less';
import {Button, Tabs, Upload, Icon, Popover, Select, Input,} from 'antd';
import CommonPropsBuildComponent from './CommonPropsBuildComponent';
import ColorSelect from '../../../common/color-select/ColorSelect';
import FontFamilySelect from '../../../common/font-family-select/FontFamilySelect';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

/*
 * 模板编辑工具栏-图片工具栏

 {
    item_key: '',
    type: 'text',
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    scale:  0,
    text_content: string,//文本内容
    font_family: string,//字体类型
    font_size: number,  //字体大小
    line_height: string,//行间距
    font_color: string, //字体颜色
    font_weight: string,//字体粗细
    font_style: string, //是否倾斜
    text_align: string, //对齐方式
 }
 */
function TextToolbar({
    pageKey,activeItemKey,activeItem,propsType,updatePageItem,changePropType,
}) {

    function addTextItem(textType) {
        let textItem = {
            item_key: '',
            type: 'text',
            x: 0,
            y: 0,
            width: 300,
            height: 80,
            scale:  0,

            text_content: '文本',
            font_size: '1rem',
            line_height: '1rem',
            font_color: '#000',
            text_align: 'center',
        };

        if(textType == '1') {
            textItem.text_content = '大标题';
            textItem.font_size = '3rem';
            textItem.line_height = '1.5';
            textItem.font_weight = 'bold';
        } else if(textType == '2') {
            textItem.text_content = '标题';
            textItem.font_size = '2.5rem';
            textItem.line_height = '1.35';
            textItem.height = 60;
        } else if(textType == '3') {
            textItem.text_content = '副标题';
            textItem.font_size = '1.5rem';
            textItem.line_height = '1';
            textItem.height = 40;
        } else if(textType == '4') {
            textItem.text_content = '正文内容';
            textItem.font_size = '1rem';
            textItem.line_height = '1';
        }

        updatePageItem && updatePageItem(pageKey, '', textItem);
    }

    function handleTextContentChange(e) {
        let {target} = e;
        let value = target.value;
        updatePageItem && updatePageItem(pageKey, activeItemKey, {text_content: value});
    }

    let propsComponent = {pageKey,activeItemKey,activeItem,propsType,updatePageItem,changePropType,};

    let font_color = activeItem && activeItem.font_color;
    let font_family = activeItem && activeItem.font_family;
    let font_size = activeItem && activeItem.font_size;
    let line_height = activeItem && activeItem.line_height;
    let text_content = activeItem && activeItem.text_content;
    let font_weight = activeItem && activeItem.font_weight;
    let font_style = activeItem && activeItem.font_style;
    let text_decoration = activeItem && activeItem.text_decoration;
    let text_align = activeItem && activeItem.text_align;

    return (
        <div className={styles.toolbar_cont}>
           {(activeItemKey == undefined || activeItemKey == '') ?
            <div className={styles.add_iamge_bar_cont}>
                <div className={styles.bar_cont_title}>模板编辑工具栏-文本工具栏</div>
                <div className={styles.bar_content}>
                    <div className={styles.add_text_type_1} onClick={()=>addTextItem('1')}>大标题</div>
                    <div className={styles.add_text_type_2} onClick={()=>addTextItem('2')}>标题</div>
                    <div className={styles.add_text_type_3} onClick={()=>addTextItem('3')}>副标题</div>
                    <div className={styles.add_text_type_4} onClick={()=>addTextItem('4')}>正文内容</div>

                    <div className={styles.split_line}></div>
                </div>
            </div>
            :
            <CommonPropsBuildComponent {...propsComponent} >
                <div className={styles.text_bar_content}>
                    <div className={styles.bar_content_line}>
                        <div className={styles.color_select_bar}>
                           <ColorSelect width='80px' height='28px' value={font_color} onChange={(color)=>updatePageItem(pageKey,activeItemKey,{font_color: color})}/>
                        </div>

                        <div className={styles.family_select_bar}>
                            <FontFamilySelect value={font_family} onChange={(font_family)=>updatePageItem(pageKey,activeItemKey,{font_family})}/>
                        </div>

                        <div className={styles.fontsize_select_bar}>
                            <FontSizeSelect value={font_size} onChange={(font_size)=>updatePageItem(pageKey,activeItemKey,{font_size})}/>
                        </div>

                        <div className={styles.fontsize_select_bar}>
                            <LineHeightSelect value={line_height} onChange={(line_height)=>updatePageItem(pageKey,activeItemKey,{line_height})}/>
                        </div>

                    </div>

                    <div className={styles.bar_content_line}>
                        <Icon
                           type="minus-square"
                           style={(font_weight=='bold'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{font_weight: (font_weight=='bold'?'normal':'bold')})}
                        />

                        <Icon
                           type="minus-square"
                           style={(font_style=='italic'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{font_style: (font_style=='italic'?'normal':'italic')})}
                        />

                        <Icon
                           type="minus-square"
                           style={(text_decoration=='underline'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{text_decoration: (text_decoration=='underline'?'normal':'underline')})}
                        />

                        <Icon
                           type="minus-square"
                           style={(text_align=='left'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{text_align: 'left'})}
                        />

                        <Icon
                           type="minus-square"
                           style={(text_align=='center'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{text_align: 'center'})}
                        />

                        <Icon
                           type="minus-square"
                           style={(text_align=='right'?{color: '#000'} : {color: '#999'})}
                           className={styles.font_style_bar}
                           onClick={()=>updatePageItem(pageKey,activeItemKey,{text_align: 'right'})}
                        />
                    </div>

                    <div className={styles.bar_content_line} style={{marginTop: '10px', padding: '5px'}}>
                        <Input type="textarea" style={{width: '100%'}} rows={4} value={text_content} onChange={handleTextContentChange} />
                    </div>
                </div>
            </CommonPropsBuildComponent>
           }

        </div>
    );
}

/*
 * 字体选择组件
 */
class FontSizeSelect extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
           size: this.props.value || '1rem',
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != this.props.value) {
            this.setState({
                size: nextProps.value,
            });
        }
    }

    handleChangeValue(value) {
        this.setState({
            size: value,
        });
        this.props.onChange && this.props.onChange(value);
    }

    render() {

        let {size} = this.state;

        let {width,height,value,onChange,} = this.props;

        let fontSizeOpts = [];
        let maxFontSize = 10;

        for(let i = 1; i < maxFontSize; i++) {
            fontSizeOpts.push(
                <Option key={'font_size_'+i} value={i+'rem'}>{i+'rem'}</Option>
            );
        }

        return (
            <div className={styles.size_select_cont}>
                <Select value={size} className={styles.size_select} onChange={this.handleChangeValue}>
                    {fontSizeOpts}
                </Select>
            </div>
        );
    }
}

/*
 * 字体选择组件
 */
class LineHeightSelect extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
           lineHeight: this.props.value || '1',
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value != this.props.value) {
            this.setState({
                lineHeight: nextProps.value,
            });
        }
    }

    handleChangeValue(value) {
        this.setState({
            lineHeight: value,
        });
        this.props.onChange && this.props.onChange(value);
    }

    render() {

        let {lineHeight} = this.state;

        let {width,height,value,onChange,} = this.props;

        return (
            <div className={styles.size_select_cont}>
                <Select value={lineHeight} className={styles.size_select} onChange={this.handleChangeValue}>
                    <Option  value='1'>1</Option>
                    <Option  value='1.2'>1.2</Option>
                    <Option  value='1.35'>1.35</Option>
                    <Option  value='2'>2</Option>
                    <Option  value='2.5'>2.5</Option>
                </Select>
            </div>
        );
    }
}

export default TextToolbar;
