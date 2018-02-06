import React from 'react';
import { Menu, Icon, Tooltip, Popover,} from 'antd';
import styles from './SiderMenuItem.less';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function SiderMenuItem ({
    currentMenu,selectedKeys,openModuleMenus,openSubMenus,menuType,menuTreeList,menuRenderInit,updateMenuRenderInit,
    openModuleMenu,
    menuOpenChange,
    menuSelectChange,
    }) {

    let menuOpenKeys = [];

    let menu_split = (<div className={styles.sider_module_menu_split}></div>);

    function loopModuleSubMenus(moduleChildMenu) {

        let moduleChildMenuRender = [];

        moduleChildMenu && moduleChildMenu.map(function(item, index) {

            let icon_cont = undefined;
        	if(item.icon && item.icon.length > 0) {
        		icon_cont = (<Icon type={item.icon} />);
        	}

            let subMenuChild = item.children;

            if(subMenuChild && subMenuChild.length > 0) {
            	let item_menu_popover = (
	            	<Menu
		                mode={'inline'}
		                selectedKeys={[currentMenu]}
		                style={{ width: 120 }}
		                inlineIndent={20}
		                className={styles.sider_third_menu}
		                onClick={(selectItem)=> menuSelectChange(selectItem.key, item.menu_key)}
		            >
		                {subMenuChild && subMenuChild.map(function(itemMenu, indexMenu) {
		                	return (
		                		<Menu.Item key={itemMenu.menu_key} className={styles.sider_third_item_menu}>
				                	<span className={styles.sider_third_item_menu_cont}><span className={styles.sider_third_item_menu_title}>{itemMenu.name}</span></span>
				                </Menu.Item>
		                	)
		                })}
		            </Menu>
	            );

	            moduleChildMenuRender.push(

	            		<Menu.Item key={item.menu_key} className={styles.sider_sub_item_menu}>
		            		<Popover key={item.menu_key} overlayClassName={styles.sider_sub_menu_popover} content={item_menu_popover} title={null} trigger="hover" placement="rightTop">
			                	<span className={styles.item_menu_cont}>{icon_cont}<span className={styles.sub_menu_title}>{item.name}</span></span>
			                </Popover>
		                </Menu.Item>

	            );
            } else {
            	moduleChildMenuRender.push(
            		<Menu.Item key={item.menu_key} className={styles.sider_sub_item_menu} >
	                	<span className={styles.item_menu_cont}
	                	onClick={()=>menuSelectChange(item.menu_key, item.menu_key)}
	                	>{icon_cont}<span className={styles.sub_menu_title}>{item.name}</span></span>
	                </Menu.Item>
	            );
            }

        });

        return moduleChildMenuRender;
    }

    let initMenuRender = window._init_data && window._init_data.menu_render_init;

    if((!menuRenderInit) || (initMenuRender && initMenuRender.length == 0 && menuTreeList && menuTreeList.length > 0)) {

    	window._init_data = window._init_data || {};
    	let menu_render_init = [];

    	menuTreeList && menuTreeList.map(function(moduleMenuItem, moduleMenuIndex) {
            menu_render_init.push(
            	<MenuItemGroup key={moduleMenuItem.menu_key}  title={menu_split}>
	                <SubMenu
	                    key={moduleMenuItem.menu_key}
	                    title={<span className={styles.module_menu_title}>{moduleMenuItem.name}</span>}
	                    className={styles.module_menu_title_cont}
	                >
	                    {loopModuleSubMenus(moduleMenuItem.children)}
	                </SubMenu>
                </MenuItemGroup>
            );
       });

       window._init_data.menu_render_init = menu_render_init;
       setTimeout(function(){
       		updateMenuRenderInit && updateMenuRenderInit(true);
       	}, 500);
    }

    return (
        <div className={styles.sider_menu_div_cont}>

            <Menu
                mode={'inline'}
                openKeys={openModuleMenus}
                onOpenChange={menuOpenChange}
                selectedKeys={selectedKeys}
                onSelect={()=>{}}
                style={{ width: 150 }}
                inlineIndent={0}
            >
                {window._init_data.menu_render_init}
            </Menu>

        </div>
    );
}

export default SiderMenuItem;
