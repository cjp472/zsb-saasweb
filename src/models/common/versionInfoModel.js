import versionInfo from '../../../version.json';
//系统版本信息model
export default {

	namespace: 'versionInfoModel',

	state: {

		versionInfoVisible: false, //版本更新提示框

		versionInfo: {}, //版本信息
	},

	effects: {
		* initVersionInfo({
			payload
		}, {
			call,
			put,
			select
		}) {
			let localVersion = (versionInfo && versionInfo.version) || '0.0.0';
			let localVersionKey = 'zsb_local_version_' + localVersion;
			//读取本地的localstorage
			let localVersionValue = localStorage.getItem(localVersionKey);

			if(localVersionValue == undefined || localVersionValue == '') {
				//延时显示版本提示
				let sleep = function(ms) {
					return new Promise(function(resolve, reject) {
						setTimeout(function() {
							resolve()
						}, ms);
					});
				}
				yield sleep(2000);
				yield put({
					type: 'updateState',
					payload: {
						versionInfoVisible:true
					}
				});
				localStorage.setItem(localVersionKey, "true");
			}

			yield put({
				type: 'updateState',
				payload: {
					versionInfo
				}
			});
		},
	},

	reducers: {
		updateState(state, action) {
			return { ...state,
				...action.payload,
			};
		},

	},

}
