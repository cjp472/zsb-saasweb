import React from 'react';
import { routerRedux } from 'dva/router';
import styles from './Breadcrumb.less';

function Breadcrumb ({routeTo, routes, }) {

    function toRouter(path) {
        if(path && path.length > 0) {
            routeTo && routeTo(path);
        }
    }

    let breadCrumbCont = [];

    let breadPath = '';
    routes && routes.length > 0 && routes.map(function(item, index) {

        let {path,breadcrumbName} = item;

        let realPath = '';
        if(path.substring(0,1) == '/') {
            realPath = path;
        } else {
            breadPath += '/' + path;
            realPath = breadPath;
        }

        if(breadcrumbName && breadcrumbName.length > 0) {
            breadCrumbCont.push(
                <li key={'saas_bread_crumb_' + index}>
                    <a href="javascript:void(0)"
                        className={(realPath && realPath.length > 0) ? styles.bread_href : styles.bread_default}
                        onClick={()=>toRouter(realPath)}
                    >
                        {breadcrumbName}
                    </a>
					{ ( routes.length - 1 ) != index && <span>&gt;</span> }
                </li>
            );
        }
    });

    return (
        <div className={styles.saas_bread_crumb_cont}>
            <ul className={styles.saas_bread_crumb}>
              {breadCrumbCont}
            </ul>
        </div>
    );
}

export default Breadcrumb;
