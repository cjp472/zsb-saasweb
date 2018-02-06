import React, {PropTypes} from 'react';
import styles from './ModuleBuildingRender.less';
import DragableItem from './dragable-item/DragableItem';

/*
 * 模板编辑渲染-按配置变量渲染预览界面
 */
function ModuleBuildingRender({
    pageKey, pageConfig, updatePageItem,
    itemClick,//在元素上点击
    activeItem, changeActiveItem,
}) {

    function renderDragContent(item) {
        let {type, width, height, box_shadow,border_radius,opacity,} = item;
        if(opacity == undefined || opacity == '') {
            opacity = 0;
        }
        if(box_shadow == undefined || box_shadow == '') {
            box_shadow = 0;
        }
        let opacityValue = 1.0 * (100 - opacity) / 100;
        if(type == 'image') {
            let img_url = item.img_url;
            return (
                <div className={styles.render_image_cont}
                   style={{width: width+'px', height: height+'px', opacity: opacityValue}}>
                    <img src={img_url} className={styles.render_image}
                        style={{
                            borderRadius: border_radius + '%',
                            boxShadow: '#000 0px 0px '+box_shadow+'px',
                            width: 'calc(100% - 10px)',
                            height: 'calc(100% - 10px)',
                            margin: '5px',
                        }} />
                </div>
            );
        } else if(type == 'text') {
            let text_content = item.text_content;
            let font_size = item.font_size;
            let line_height = item.line_height;
            let font_color = item.font_color;
            let font_family = item.font_family || '微软雅黑';
            let font_weight = item.font_weight || 'normal';
            let font_style = item.font_style || 'normal';
            let text_decoration = item.text_decoration || 'normal';
            let text_align = item.text_align || 'center';
            return (
                <div className={styles.render_text_cont}
                   style={{width: width+'px', height: height+'px', opacity: opacityValue}}>
                    <div className={styles.render_text}
                        style={{
                            borderRadius: border_radius + '%',
                            boxShadow: '#000 0px 0px '+box_shadow+'px',
                            width: 'calc(100% - 10px)',
                            height: 'calc(100% - 10px)',
                            margin: '5px',

                            fontSize: font_size,
                            lineHeight: line_height,
                            color: font_color,
                            fontFamily: font_family,
                            fontWeight: font_weight,
                            fontStyle: font_style,
                            textDecoration: text_decoration,
                            textAlign: text_align,
                        }} >{text_content}</div>
                </div>
            );
        }
    }

    let items = (pageConfig && pageConfig.items) || [];

    let me = this;

    return (
        <div className={styles.module_building_cont}>
            {items && items.map(function(item, index) {

                let dragProps = {
                    activiteDrag: item.item_key == activeItem,
                    drag_key: item.item_key,
                    itemX: item.x,
                    itemY: item.y,
                    itemWidth: item.width,
                    itemHeight: item.height,
                    scale: item.scale,
                    changeDragData: (dragData, itemKey) => {         //更改拖拽对象  元素点击时触发
                        changeActiveItem && changeActiveItem(itemKey)
                    },
                    changeProps: (itemValue)=>{       //更改拖拽对象的属性
                        updatePageItem && updatePageItem(pageKey, item.item_key, itemValue);
                    },
                    itemClick,
                };
                return (
                    <DragableItem {...dragProps} key={item.item_key}>
                        {renderDragContent(item)}
                    </DragableItem>
                )
            })}
        </div>
    );
}

export default ModuleBuildingRender;
