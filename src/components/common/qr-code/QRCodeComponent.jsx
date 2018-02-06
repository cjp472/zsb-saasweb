/*
 * linkArr 			: array  	// 需要生成的二维码链接
 * titleHide 		: bool  	// 是否隐藏title, false
 * showModal		: bool 		// 显示modal
 * calcelQrModal	: function	// 取消modal
 * orgId			: string	// 机构id
 * activityId		: string 	// 活动id
 */
import React from 'react';
import {Modal, message, Button} from 'antd';
import styles from './QRCodeComponent.less';
var QRCode = require('qrcode.react');

/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
var saveFile = function(data, filename){

	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = data;
	save_link.download = filename;
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(event);
};

function QRCodeComponent ({

	linkArr,
	titleHide,
	showModal,
	calcelQrModal,
	orgId,
	activityId,

}) {

	titleHide = titleHide == undefined ? false : titleHide;

	//取消显示modal
	function touchCancelQRModal() {
		calcelQrModal();
	}

	function getCanvasQr(index) {
		var qrCodeImage = document.getElementsByTagName('canvas');
		var canvas = qrCodeImage[index];
        var data = canvas.toDataURL();
		var filename = linkArr.length > 0 ? linkArr[index].name || '人员二维码' + '.png' : '人员二维码';
		saveFile(data,filename);
	}

	//下载二维码
	function downloadQr(index) {
		getCanvasQr(index);
	}

	//打包下载
	function packagingDownloadQr() {

		window.open(`${BASE_URL}/zsb/market/img/zip?orgId=${orgId || undefined}&activityId=${activityId || undefined}`);

//		var qrCodeImage = document.getElementsByTagName('canvas');
//		for(var i = 0; i < qrCodeImage.length; i++) {
//			var name = linkArr[i].name;
//			var canvas = qrCodeImage[i];
//			var data = canvas.toDataURL();
//			var filename = name + '.png';
//			saveFile(data,filename);
//		}
	}

	if(linkArr&&linkArr.length == 0) {
		return <div></div>
	}

	let component = undefined;

	/*
	 *	linlData : 数据源 	{name : '姓名', link : "http://facebook.github.io/react/"}
	 *	downloadString : 文案
	 */
	function commonlayout(linlData, downloadString) {
		return (
			<div className={styles.qrBase}>
				<div className={styles.qrCodeBox}>
					{
						linlData&&linlData.map((item, index) => {
							return <div key={index} className={linlData.length == 1 ? styles.qrBaseDiv : styles.qrBaseDivSecond}>
										{titleHide ? '' : <p className={styles.qrCodeTitle}>{item.name || ''}</p>}
										<QRCode value={item.link} size={150} level="M" />
										<Button className={styles.qrDownloadBtn} onClick={() => downloadQr(index)}>{downloadString}</Button>
									</div>
						})
					}
					</div>
				{linlData.length > 1 ? <div className={styles.qrLine}></div> : ''}
				{linlData.length > 1 ? <Button type="primary" className={styles.qrDownloadBtn} onClick={() => packagingDownloadQr()}>打包下载</Button> : ''}
			</div>
		)
	}

	component = commonlayout(linkArr, '下载二维码');

    return (
		<Modal
			title="下载二维码"
			visible={showModal}
			onCancel={touchCancelQRModal}
			maskClosable={false}
			footer={null}
			width={linkArr.length == 1 ? '250px' : linkArr.length == 2 ? '440px' : '640px' }
			wrapClassName="marketQRModal"
		>
			{component}
		</Modal>
    );
}




export default QRCodeComponent;
