import React, {PropTypes} from 'react';
import styles from './ToolBar.less';
import {Button, Tabs, Upload, Icon,} from 'antd';
import CommonPropsBuildComponent from './CommonPropsBuildComponent';

const TabPane = Tabs.TabPane;

/*
 * 模板编辑工具栏-图片工具栏

 {
    item_key: '',
    type: 'image',
    x: 0,
    y: 0,
    width: 200,
    height: 80,
    scale:  0,
    img_url: '//img.ishanshan.com/gimg/img/dafc0da13fc9f62dc6f17b0018eeaf31',
 }
 */
function ImageToolbar({
    pageKey,activeItemKey,activeItem,propsType,updatePageItem,changePropType,
}) {

    function addTestImage() {
        updatePageItem && updatePageItem(pageKey, '',
         {
            item_key: '',
            type: 'image',
            x: 0,
            y: 0,
            width: 200,
            height: 80,
            scale:  0,
            img_url: '//img.ishanshan.com/gimg/img/dafc0da13fc9f62dc6f17b0018eeaf31',
         });
    }

    let propsComponent = {pageKey,activeItemKey,activeItem,propsType,updatePageItem,changePropType,};

    return (
        <div className={styles.toolbar_cont}>
           {(activeItemKey == undefined || activeItemKey == '') ?
            <div className={styles.add_iamge_bar_cont}>
                <div className={styles.bar_cont_title}>模板编辑工具栏-图片工具栏</div>
                <div className={styles.bar_content}>
                    <ImageBarSelect />
                </div>
            </div>
            :
            <CommonPropsBuildComponent {...propsComponent} >

            </CommonPropsBuildComponent>
           }

        </div>
    );
}

/*
 * 图片类型-选择图片
 */
class ImageBarSelect extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
           fileList : [],
        };

        this.handleChangeImage = this.handleChangeImage.bind(this);
    }

    handleChangeImage({fileList}) {
        this.setState({
            fileList
        });
    }

    render() {
        let {fileList}  = this.state;

        return (
            <div className={styles.image_bar_select_cont}>
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture"
                  fileList={fileList}
                  onChange={this.handleChangeImage}
                >
                  <Button icon="cloud-upload-o">选择图片</Button>
                </Upload>
            </div>
        );
    }
}

export default ImageToolbar;
