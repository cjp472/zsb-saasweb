import React from 'react';
import Draggable from 'react-draggable';
import styles from './DragableItem.less';

class DragableItem extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            mouseState: 'normal',   //鼠标状态  normal 正常  over 鼠标在组件上方
            dragState: 'normal',    //拖拽状态  normal 正常  drag 正在拖拽中
        };

        // ES6 类中函数必须手动绑定
        this.onHover = this.onHover.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleStop = this.handleStop.bind(this);

        this.handleScaleDrag = this.handleScaleDrag.bind(this);//元素编辑缩放的按钮拖动事件
    }

    onHover() {
        this.setState({
            mouseState: 'over'
        });
    }

    onMouseOut() {
        this.setState({
            mouseState: 'normal'
        });
    }

    handleStart(e, data) {
        this.props.changeDragData && this.props.changeDragData(data, this.props.drag_key);
        this.setState({
            dragState: 'drag'
        });
    }

    handleDrag(e, data) {
        this.setState({
            mouseState: 'drag'
        });
        this.props.changeProps && this.props.changeProps({x: data.x, y: data.y});
    }

    handleStop(e, data) {
        this.setState({
            mouseState: 'over',
        });
    }

    handleScaleDrag(e, data, scaleType) {
        let {x,y,deltaX,deltaY} = data;
        let {itemX, itemY, itemWidth, itemHeight, scale, changeProps} = this.props;
//        _('x= '+data.x, 'y= '+data.y, 'deltaX= '+data.deltaX, 'deltaY= '+data.deltaY, 'lastX= '+ data.lastX, 'lastY= '+ data.lastY);

        itemWidth = parseInt(itemWidth+'') + parseInt(deltaX+'');
        itemHeight = parseInt(itemHeight+'') + parseInt(deltaY+'');
        changeProps && changeProps({width: itemWidth, height: itemHeight});
    }

    render() {
        let {mouseState,dragState} = this.state;
        let {itemX, itemY, itemWidth, itemHeight, scale, activiteDrag,itemClick,} = this.props;

        let activite_edit_flg = activiteDrag && (dragState == 'drag');//是否激活的正在编辑的元素

        return (
            <Draggable
                axis="both"
                handle='.common_dragable_cls'
                cancel='.common_drag_scale_tool'
                position={{x: itemX, y: itemY}}

                grid={[1, 1]}
                onStart={this.handleStart}
                onDrag={this.handleDrag}
                onStop={this.handleStop}
                >
                 <div className='common_dragable_cls' style={activite_edit_flg ? {border: 0, margin: 0} : {}} onClick={itemClick}>
                     <div className={styles.drag_cont} style={{transform: 'rotate(' + scale + 'deg)'}}>
                         {this.props.children}
                     </div>
                     <div className={activite_edit_flg ? 'common_drag_scale_cont' : styles.noraml_drag_sacle} style={{transform: 'rotate(' + scale + 'deg)'}}>
                         <div className='common_drag_scale_line'></div>
                         <DragScaleItem scaleType='common_drag_scale_size' handleDrag={this.handleScaleDrag} />
                     </div>
                 </div>
            </Draggable>
        );
    }
}

class DragScaleItem extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            dragState: 'normal',    //拖拽状态  normal 正常  drag 正在拖拽中
        };

        // ES6 类中函数必须手动绑定
        this.handleScaleDrag = this.handleScaleDrag.bind(this);//元素编辑缩放的按钮拖动事件
        this.handleStart = this.handleStart.bind(this);
        this.handleStop = this.handleStop.bind(this);//元素编辑缩放的按钮拖动事件
    }

    handleScaleDrag(e, data) {
        let {scaleType} = this.props;
        this.props.handleDrag && this.props.handleDrag(e, data, scaleType);
    }

    handleStart(e, data) {
        this.setState({
            dragState: 'drag',
        });
    }

    handleStop(e, data) {
        this.setState({
            dragState: 'normal',
        });
    }


    render() {
        let {scaleType} = this.props;
        let {dragState} = this.state;
      return (
          <Draggable
            axis='both'
            handle='.common_drag_scale_tool'
            grid={[1, 1]}
            position= {{x: 0, y: 0}}
            onStart={this.handleStart}
            onDrag={this.handleScaleDrag}
            onStop={this.handleStop}
            >
            <div className={'common_drag_scale_tool ' + scaleType} style={dragState == 'normal' ? {opacity: '0.8'} : {opacity: '0'}}></div>
          </Draggable>
      );
    }
}

export default DragableItem;
