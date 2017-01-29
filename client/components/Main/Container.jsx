'use strict';

import React from 'react';
import {Layout, Sidebar, Panel, NavDrawer} from 'react-toolbox';
import {NotificationContainer} from 'react-notifications';

import Main from './Main.jsx';
import SideMenu from './SideMenu.jsx';

export default (props) => {
  return <Layout>
  <NavDrawer width={'normal'} permanentAt={'sm'} style={{maxWidth: '250px'}}>
      
      <SideMenu></SideMenu>
    </NavDrawer>
    <Sidebar >
      
    </Sidebar>
    <Panel scrollY={true}>
      {props.children}
    </Panel>
    <NotificationContainer/>
  </Layout>;
};
