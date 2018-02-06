import React from 'react';
import { Upload, Steps, Tabs, Modal, Button } from 'antd';
import styles from './UserAgreementModal.less';

function UserAgreementModal({
	visible,
	content,
	time,

	disabled,

	clickToCloseUser
}){

	return (
		<Modal
			className = "user_agreement_modal"
            visible = { visible }
            closable={false}
            maskClosable = { false }
            width = '550px'
            footer = {[
				<Button type = "primary" onClick = { clickToCloseUser } disabled = { disabled } >
					我已仔细阅读并同意
					{
						time !== 0 && <span>( { time }s )</span>
					}
				</Button>
			]}
		>
			<div className = { styles.user_agreement_header } >
				<span className = { styles.user_agreement_header_label } >闪闪</span><span style = {{ border : 'none' }} className = { styles.user_agreement_header_label } >用户协议</span>
			</div>
			<div className = { styles.user_agreement_content } >
				{ !!content && content.map( function( item, index ){
					return (
						<div className = { styles.user_agreement_content_item } key = { 'user_agreement_content_item_' + index } >
							{ !!item.title &&
								<div className = { styles.user_agreement_content_title } >
									{ item.title || '' }
								</div>
							}
							{
								!!item && !!item.content && item.content.map(function( item, index ){
									return(
										<div className = {  styles.user_agreement_content_tip } key = { 'user_agreement_content_tip_' + index }  >
											{ item }
										</div>
									)
								})
							}
						</div>
					)
				})}
			</div>
			<div className = { styles.user_agreement_btn } >

			</div>
		</Modal>
    )
}

export default UserAgreementModal;
