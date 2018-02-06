import React, {PropTypes} from 'react';
import styles from './ActivityModuleBuildComponent.less';
import ModuleBuilding from '../module-building/ModuleBuilding';
import ModuleBuildingRender from '../module-building/module-render/ModuleBuildingRender';
import ModuleToolBar from '../module-building/module-toolbar/ModuleToolBar';
import ModuleBuildPrev from '../module-building/module-prev/ModuleBuildPrev';

/*
 * 模板编辑页面
 *

 {
    id: string,         //模板主键
    name: string,       //模板名称
    share_config: object,//分享配置
    switch_type: string, //页面切换方式

    pages: [            //页面配置

        {
            index: number,         //加入顺序
            page_key: string,      //键
            seq_no: number,        //顺序
            items: [               //元素项   元素顺序就是图层顺序
                {
                    item_key: string,   //元素键、元素索引
                    type: string,       //元素类型  base/text/image/button/other   base有且唯一并在最前面
                    x: number,          //元素横坐标
                    y: number,          //元素纵坐标
                    width: number,      //元素宽度
                    height: number,     //元素高度
                    scale: number,      //元素旋转角度
                    box_shadow: string, //元素阴影
                    border_radius: number,//圆角大小
                    opacity: number,    //透明度 单位%

                    //动作相关配置
                    action_type: string,//动作类型
                    action_speed: number,//动作速度(几秒内完成动作)
                    action_delay: number,//动作延迟(几秒后开始动作)

                    //↓↓↓↓↓基本类型元素↓↓↓↓↓
                    bg_img: string,     //背景图片  URL
                    bg_color: string,   //背景颜色 '#F1F1F1'
                    bg_opacity: number, //背景颜色的透明度  当bg_color不为空时生效
                    //↓↓↓↓↓文本类型元素↓↓↓↓↓
                    text_content: string,//文本内容
                    font_family: string,//字体类型
                    font_size: number,  //字体大小
                    line_height: string,//行间距
                    font_color: string, //字体颜色
                    font_weight: string,//字体粗细
                    font_style: string, //是否倾斜  italic
                    text_decoration: string, //是否下划线  underline
                    text_align: string, //对齐方式
                    //↓↓↓↓↓图片类型元素↓↓↓↓↓
                    img_url: string,    //图片链接
                    //↓↓↓↓↓按钮类型元素↓↓↓↓↓
                    href_url: string,    //点击链接
                    button_text: string,//按钮文本
                    button_fontsize: number,//按钮文本大小
                }
            ]
        }
    ]

 }

 */
function ActivityModuleBuildComponent({
    moduleConfigData,   //全部页面的配置数据
    currentPageKey,     //当前操作页面的键
    currentPageConfig,  //当前操作的页面配置数据

    onCreatePage,       //新增页面
    onRemovePage,       //删除页面
    changeActivePage,   //改变激活(操作)页面
    updatePageItem,     //编辑页面元素
    activeItemKey,      //当前操作元素键
    changeActiveItem,   //改变正在编辑的元素对象
}) {
    {/*========*/}

    function itemClick(t, e) {
        t.nativeEvent.isInH5render = true;
    }
    function outH5RenderClick(t, e) {
        if(!t.nativeEvent.isInH5render) {
            changeActiveItem && changeActiveItem('');
        }
    }

    return (
        <div className={styles.activity_module_build_page_cont}>

                {/*左侧卡片预览和图层预览*/}
                <div className={styles.prev_cont}>
                    <ModuleBuildPrev
                        onCreatePage={onCreatePage}
                        onRemovePage={onRemovePage}
                        moduleConfigData={moduleConfigData}
                        currentPageConfig={currentPageConfig}
                        currentPageKey={currentPageKey}
                        changeActivePage={changeActivePage}
                        activeItemKey={activeItemKey}
                        changeActiveItem={changeActiveItem} />
                </div>

                {/*中间显示模板构建预览*/}
                <div className={styles.building_mobile_cont} style={{width: 'calc(100% - 35rem)'}} onClick={outH5RenderClick}>
                    <div className={styles.building_mobile_content}>
                        <ModuleBuilding>
                            <ModuleBuildingRender
                                pageKey={currentPageKey}
                                pageConfig={currentPageConfig}
                                updatePageItem={updatePageItem}
                                activeItem={activeItemKey}
                                changeActiveItem={changeActiveItem}
                                itemClick={itemClick}
                            />
                        </ModuleBuilding>
                    </div>
                </div>

                {/*右侧显示操作工具栏*/}
                <div className={styles.build_tool_cont}>
                    <ModuleToolBar
                        pageKey={currentPageKey}
                        pageConfig={currentPageConfig}
                        updatePageItem={updatePageItem}
                        activeItemKey={activeItemKey}
                    />
                </div>

        </div>
    );
}

export default ActivityModuleBuildComponent;
