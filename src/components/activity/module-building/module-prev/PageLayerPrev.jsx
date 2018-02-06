import React, {PropTypes} from 'react';
import styles from './PageLayerPrev.less';
import {Icon} from 'antd';

/*
 * 模板编辑页面-H5显示框架
 */
function PageLayerPrev({
    items,activeItemKey,changeActiveItem,
}) {

    let itemArr = [];

    if(items && items.length > 0) {
        for(let i = (items.length-1); i >= 0; i--) {
            let itemObj = items[i];
            let {type,item_key} = itemObj;
            let layerPrev;
            //根据不同的类型显示图层
            if(type == 'text') {
                layerPrev = (
                    <div className={styles.layer_prev}>
                        <Icon type="file-text" className={styles.layer_prev_icon} />
                        <span className={styles.layer_prev_title}>{itemObj.text_content||'文本'}</span>
                    </div>
                );
            } else {
                layerPrev = (
                    <div className={styles.layer_prev}>
                        <Icon type="file-text" className={styles.layer_prev_icon} />
                        <span className={styles.layer_prev_title}>{'文本'}</span>
                    </div>
                );
            }

            itemArr.push(
                <div key={'page_layer_item_'+i}
                   onClick={()=>changeActiveItem(item_key)}
                   className={item_key==activeItemKey ? styles.page_layer_item_active : styles.page_layer_item}>
                    {layerPrev}
                </div>
            );
        }
    }

    return (
        <div className={styles.page_layers_cont}>
            {itemArr}
        </div>
    );
}

export default PageLayerPrev;
