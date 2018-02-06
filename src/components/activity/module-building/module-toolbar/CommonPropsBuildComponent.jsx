import React, {PropTypes} from 'react';
import styles from './CommonPropsBuildComponent.less';
import {Button, Tabs, InputNumber, Slider,} from 'antd';

const TabPane = Tabs.TabPane;

/*
 * 公共显示属性的面板
 */
function CommonPropsBuildComponent({
    pageKey,activeItemKey,activeItem,propsType,updatePageItem,changePropType,children,
}) {
    let {
        item_key,type,x,y,width,height,scale,box_shadow,border_radius,opacity,
        action_type,action_speed,action_delay,
    } = activeItem;

    function changeOpacity(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {opacity: value});
    }
    function changeBorderRadius(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {border_radius: value});
    }
    function changeBoxShadow(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {box_shadow: value});
    }
    function changeScale(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {scale: value});
    }

    function changeWidth(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {width: value});
    }
    function changeHeight(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {height: value});
    }
    function changeX(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {x: value});
    }
    function changeY(value) {
        updatePageItem && updatePageItem(pageKey, activeItemKey, {y: value});
    }

    return (
        <div className={styles.iamge_build_bar_cont}>
            <Tabs activeKey={propsType} onChange={changePropType}>
                <TabPane tab="属性" key="base">
                    <div className={styles.base_props_cont}>
                        <div className={styles.base_common_props_cont}>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>透明</div>
                                <Slider className={styles.props_slider} min={0} max={100} onChange={changeOpacity} value={opacity||0} />
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{width: '100%'}}
                                        value={opacity||0}
                                        onChange={changeOpacity}
                                      />
                                </div>
                            </div>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>圆角</div>
                                <Slider className={styles.props_slider} min={0} max={100} onChange={changeBorderRadius} value={border_radius||0} />
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{width: '100%'}}
                                        value={border_radius||0}
                                        onChange={changeBorderRadius}
                                      />
                                </div>
                            </div>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>阴影</div>
                                <Slider className={styles.props_slider} min={0} max={100} onChange={changeBoxShadow} value={box_shadow||0} />
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        style={{width: '100%'}}
                                        value={box_shadow||0}
                                        onChange={changeBoxShadow}
                                      />
                                </div>
                            </div>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>旋转</div>
                                <Slider
                                    className={styles.props_slider}
                                    min={0} max={360}
                                    onChange={changeScale}
                                    value={scale||0}
                                    marks={{0: '0', 90: '90', 180: '180', 360: '360'}}
                                />
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        max={360}
                                        style={{width: '100%'}}
                                        value={scale||0}
                                        onChange={changeScale}
                                      />
                                </div>
                            </div>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>宽度</div>
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        value={width||0}
                                        onChange={changeWidth}
                                      />
                                </div>

                                <div className={styles.prop_title}>高度</div>
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        value={height||0}
                                        onChange={changeHeight}
                                      />
                                </div>
                            </div>

                            <div className={styles.base_common_props_item}>
                                <div className={styles.prop_title}>横向</div>
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        value={x||0}
                                        onChange={changeX}
                                      />
                                </div>

                                <div className={styles.prop_title}>纵向</div>
                                <div className={styles.prop_value}>
                                    <InputNumber
                                        min={0}
                                        style={{width: '100%'}}
                                        value={y||0}
                                        onChange={changeY}
                                      />
                                </div>
                            </div>

                        </div>

                        <div className={styles.other_props_cont}>
                            {children}
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="动作" key="anim">Content of Tab Pane 2</TabPane>
            </Tabs>
        </div>
    );
}

export default CommonPropsBuildComponent;
