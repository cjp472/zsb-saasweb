import React from 'react';
import { connect } from 'dva';
import VersionInfoComponent from '../../../components/common/version-info/VersionInfoComponent';

function VersionInfoPage({dispatch, versionInfoModel, menuType}) {

    let {versionInfo, versionInfoVisible,} = versionInfoModel;

	function changeVisible() {
		dispatch({
			type: 'versionInfoModel/updateState',
			payload: {
				versionInfoVisible: !versionInfoVisible
			}
		});
	}

    let componentProps = {
        versionInfo, visible: versionInfoVisible,changeVisible,menuType,
    };
    return (
        <VersionInfoComponent {...componentProps} />
    );
}

function mapStateToProps({ versionInfoModel }) {
    return { versionInfoModel };
}

export default connect(mapStateToProps)(VersionInfoPage);
