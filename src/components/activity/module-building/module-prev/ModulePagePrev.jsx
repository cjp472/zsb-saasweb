import React, {PropTypes} from 'react';
import styles from './ModulePagePrev.less';
import {Button,Icon,} from 'antd';

/*
 * 模板编辑页面-H5显示框架
 */
function ModulePagePrev({
    pages, currentPageKey, onCreatePage, onRemovePage, changeActivePage,
}) {

    return (
        <div className={styles.page_prev_cont} style={{height: 'calc(100vh - 185px)'}}>

           <div className={styles.page_item_list} style={{height: 'calc(100% - 40px)'}}>
           {pages && pages.map(function(pageItem, pageIndex) {
                let isActive = currentPageKey == pageItem.page_key;
                return (
                    <div
                       key={'page_prev_item_' + pageIndex}
                       className={isActive ? styles.page_prev_item_active : styles.page_prev_item} >
                        <div className={styles.item_prev_cont} onClick={()=>changeActivePage(pageItem.page_key)}>

                        </div>
                        <div className={styles.item_bar}>
                            <div className={styles.page_item_name} title={'第' + pageItem.index + '个页面'}>
                                第{pageItem.index}个页面
                            </div>
                            <div className={styles.item_bar_cont}>
                                <Icon type="delete" className={styles.item_bar_icon} onClick={()=>onRemovePage(pageItem.index)}/>
                                <Icon type="file-add" className={styles.item_bar_icon} onClick={()=>onCreatePage(pageItem.index)}/>
                            </div>
                        </div>
                    </div>
                )
            })}
            </div>

            <div className={styles.add_btn_cont}>
                <Button className={styles.add_btn} type="primary" onClick={()=>onCreatePage()}><Icon type="plus" /></Button>
            </div>
        </div>
    );
}

export default ModulePagePrev;
