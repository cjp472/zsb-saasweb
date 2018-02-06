import React, {PropTypes} from 'react';
import styles from './ModuleBuilding.less';

/*
 * 模板编辑页面-H5显示框架
 */
function ModuleBuilding({
    children,onClick,
}) {

    return (
        <div className={styles.h5_building_cont}>
            <div className={styles.h5_mobile_show} >

                <div className={styles.h5_mobile_show_content} onClick={onClick}>
                    {children}
                </div>

            </div>
        </div>
    );
}

export default ModuleBuilding;
