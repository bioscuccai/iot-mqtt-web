'use strict';

import React from 'react';
import {List, Button, AppBar, Navigation, Link} from 'react-toolbox';
import {connect} from 'react-redux';
import _ from 'lodash';

import DeviceItem from './DeviceItem.jsx';
import DeviceNewDialog from './DeviceNewDialog.jsx';
import DeviceEditDialog from './DeviceEditDialog.jsx';

import appActions from '../../actions/apps';
import modalActions from '../../actions/modals';
import deviceActions from '../../actions/devices';

const DeviceIndex = React.createClass({
  getInitialState() {
    return {
      modals: {
        new: false,
        edit: false
      }
    };  
  },

  componentDidMount() {
    if(!this.props.apps.loaded) {
      this.props.fetchApps();
    }
    
    if(!this.props.devices.loaded) {
      this.props.fetchDevices();
    }
  },

  render () {
    return <div>
      <AppBar title='Devices'>
        <Navigation type='horizontal'>
          <Link label='New' onClick={this.setModal.bind(this, 'new', true)}/>
          <Link label='Refresh' onClick={this.props.fetchDevices}/>
        </Navigation>
      </AppBar>

      <DeviceNewDialog apps={this.props.apps.apps}
        active={!!this.state.modals.new}
        close={this.setModal.bind(this, 'new', false)}
        createDevice={this.props.createDevice}
        refreshDevices={this.refreshDevices}
        selectedApp={this.props.apps.selectedApp}
        apps={this.props.apps}/>

      <DeviceEditDialog apps={this.props.apps.apps}
        ref='editModal'
        active={!!this.state.modals.edit}
        close={this.setModal.bind(this, 'edit', false)}
        device={this.props.devices.currentDevice}
        updateDevice={this.props.updateDevice}
        selectedApp={this.props.apps.selectedApp}
        device={this.props.devices.currentDevice}
        refreshDevices={this.refreshDevices}
        regenDeviceToken={this.props.regenDeviceToken}
        fetchCurrentDevice={this.props.fetchCurrentDevice}/>

      <List>
        {this.props.devices.devices.map(device => {
          return <DeviceItem 
          device={device}
          key={`device-index-item-${device.id}`}
          openEditDialog={this.openEditDialog.bind(this, device.id)}
          close={this.setModal.bind(this, 'edit', false)}/>;
        })}
      </List>
    </div>;
  },

  setModal(type, value) {
    this.setState({...this.state, modals: {
      [type]: value
    }});
  },

  openEditDialog(deviceId) {
    this.props.fetchCurrentDevice(deviceId)
    .then(data => {
      this.setModal('edit', true);
    });
  },

  refreshDevices() {
    this.props.fetchDevices({
      appId: this.props.apps.selectedApp.id
    });
  }
});

export default connect(state => {
  return {
    devices: state.devices,
    apps: state.apps
  };
}, dispatch => {
  return {
    createDevice(device) {
      return dispatch(deviceActions.createDevice(device));
    },

    updateDevice(device) {
      return dispatch(deviceActions.updateDevice(device));
    },

    deleteDevice(deviceId) {
      return dispatch(deviceActions.deleteDevice(deviceId));
    },

    fetchApps() {
      return dispatch(appActions.fetchApps());
    },

    fetchDevices() {
      return dispatch(deviceActions.fetchDevices());
    },

    fetchCurrentDevice(deviceId) {
      return dispatch(deviceActions.fetchCurrentDevice(deviceId));
    },
    
    regenDeviceToken(deviceToken) {
      return dispatch(deviceActions.regenDeviceToken(deviceToken));
    }
  };  
})(DeviceIndex);
