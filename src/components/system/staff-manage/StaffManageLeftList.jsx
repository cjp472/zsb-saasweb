import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './StaffManageLeftList.less';
const TreeNode = Tree.TreeNode;

/*员工管理左边组织架构*/
function StaffLeftList({
    allOrganList,               //左边组织架构数据
    allOrganListLoading,        //左边组织架构是否加载中
    organItemIndexOnMouseMove,  //左边组织架构鼠标放到项目上的索引(用来使对应位置出现'编辑'和'删除')
    organItemIdOnMouseMove,     //左边组织架构鼠标放到项目上的id(用来使对应位置出现'编辑'和'删除')
    secondOrganArray,           //左边组织架构列表默认打开的二级菜单

    OrganListOnExpend,          //左边组织架构列表节点展开事件

    OrganAddSector,             //左边组织架构列表点击新增部门
    OrganEditSector,            //左边组织架构列表点击编辑部门
    OrganDeleteSector,          //左边组织结构列表点击删除
    organOnMouseMove,           //左边部门鼠标悬浮事件

    staffManageSearchVisible,   //右边table列表搜索栏是否显示(用来使组织架构高度和右边table高度一样)
  }) {

    /*右边组织架构列表数据*/
        const loopAllOrganList = data => data.map((item,index) => {
        if (item.children && (item.children).length > 0) {
            if(item.headOffice == true){
                return (
                    <TreeNode title={
                        <span>
                            <Icon type="menu-xqsz" className={styles.icon}/><span style={{fontSize:'14px',color:'#666'}} className={styles.deptName}>{item.label}(总部)</span>
                        </span>
                        } key={item.value}>{loopAllOrganList(item.children)}
                    </TreeNode>
                );
            }else if(item.org == true){
                return (
                    <TreeNode title={
                        <span className={styles.deptName}>
                            <Icon type="menu-xqsz" className={styles.icon}/><span style={{fontSize:'14px',color:'#666'}} className={styles.deptName}>{item.label}</span>
                        </span>
                        } key={item.value}>{loopAllOrganList(item.children)}
                    </TreeNode>
                );
            }else{
                if(index == organItemIndexOnMouseMove && item.value == organItemIdOnMouseMove){
                    return (
                        <TreeNode title={
                            <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                                <span style={{fontSize:'14px',color:'#999'}} className={styles.deptName}>{item.label}</span>
                                <span onClick={() => OrganEditSector(item)} style={{marginLeft:'40px',color:'#4e9ff8',fontSize:'14px',cursor:'pointer'}}>编辑</span>
                                <Popconfirm placement="top" title='确定删除此部门吗' onConfirm={() => OrganDeleteSector(item.value)}>
                                    <span style={{marginLeft:'20px',color:'#4e9ff8',fontSize:'14px',cursor:'pointer'}}>删除</span>
                                </Popconfirm>
                            </span>
                            } key={item.value}>{loopAllOrganList(item.children)}
                        </TreeNode>
                    );
                }else{
                    return (
                        <TreeNode title={
                            <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                                <span style={{fontSize:'14px',color:'#999'}} className={styles.deptName}>{item.label}</span>
                            </span>
                            } key={item.value}>{loopAllOrganList(item.children)}
                        </TreeNode>
                    );
                }
            }
        }else{
            if(item.headOffice == true){
                return (
                    <TreeNode title={
                        <span>
                            <Icon type="menu-xqsz" className={styles.icon}/><span style={{fontSize:'14px',color:'#666'}} className={styles.deptName}>{item.label}(总部)</span>
                        </span>
                        } key={item.value}>{loopAllOrganList(item.children)}
                    </TreeNode>
                );
            }else if(item.org == true){
                if(index == organItemIndexOnMouseMove && item.value == organItemIdOnMouseMove){
                    return <TreeNode title={
                        <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                            <Icon type="menu-xqsz" className={styles.icon}/><span style={{fontSize:'14px',color:'#666'}} className={styles.deptName}>{item.label}</span>
                        </span>
                    } key={item.value}/>
                }else{
                    return <TreeNode title={
                        <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                            <Icon type="menu-xqsz" className={styles.icon}/><span style={{fontSize:'14px',color:'#666'}} className={styles.deptName}>{item.label}</span>
                        </span>
                    } key={item.value}/>
                }
            }else{
                if(index == organItemIndexOnMouseMove && item.value == organItemIdOnMouseMove){
                    return <TreeNode title={
                        <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                            <span style={{fontSize:'14px',color:'#999'}} className={styles.deptName}>{item.label}</span>
                            <span onClick={() => OrganEditSector(item)} style={{marginLeft:'40px',color:'#4e9ff8',fontSize:'14px',cursor:'pointer'}}>编辑</span>
                            <Popconfirm placement="top" title='确定删除此部门吗' onConfirm={() => OrganDeleteSector(item.value)}>
                                <span style={{marginLeft:'20px',color:'#4e9ff8',fontSize:'14px',cursor:'pointer'}}>删除</span>
                            </Popconfirm>
                        </span>
                    } key={item.value}/>
                }else{
                    return <TreeNode title={
                        <span onMouseMove={() => organOnMouseMove(item.value,index)}>
                            <span style={{fontSize:'14px',color:'#999'}} className={styles.deptName}>{item.label}</span>
                        </span>
                    } key={item.value}/>
                }
            }
        }
    });

    return(
        <div className = { styles.all }>
            <div className = { styles.block_title }>组织架构</div>
            <div className = { 'zj_staff_manage_organ_tree ' + (staffManageSearchVisible == false ? styles.orgListTypeOne : styles.orgListTypeTwo)}>
                <Spin title='Loading' spinning = { allOrganListLoading }>
                    <Tree
                        autoExpandParent = { false }
                        expandedKeys = { secondOrganArray }
                        onExpand = { OrganListOnExpend }
                        >
                        <TreeNode title={
                                        <div>
                                            <span style={{fontSize:'16px',color:'#666'}}>全校区</span>
                                            <Button style={{marginLeft:'70px'}} type='primary' size='small' onClick={OrganAddSector}>新增部门</Button>
                                        </div>
                                    }
                                  key='allOrgan'>
                            { loopAllOrganList(allOrganList) || [] }
                        </TreeNode>
                    </Tree>
                </Spin>
            </div>
        </div>
    );
}

export default StaffLeftList;
