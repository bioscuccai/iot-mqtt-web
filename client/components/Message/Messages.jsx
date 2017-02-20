'use strict';

import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Dropdown, Button, AppBar, Navigation, Link, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

import messageActions from '../../actions/messages';
import deviceActions from '../../actions/devices';

const Messages = React.createClass({
  getInitialState () {
    return {
      message: '',
      targetDevice: '',
      targetDeviceType: ''
    };
  },

  componentDidMount () {
    if (!this.props.devices.loaded) {
      this.props.fetchDevices();
    }
  },

  render() {
    let options = this.props.devices.devices.map(device => {
      return {
        label: device.name,
        value: device.id
      };
    });

    let types = _(this.props.devices.devices).map('type').uniq().value();

    let typeOptions = types.map(type => {
      return {
        label: type,
        value: type
      };
    });
    
    return <div>
      <AppBar title='Messages'>
        <Navigation type='horizontal'>
          
        </Navigation>
      </AppBar>

      <Dropdown source={options} label='Device'
        value={this.state.targetDevice}
        onChange={this.handleChange.bind(this, 'targetDevice')}/>

      <Dropdown source={typeOptions} label='Device type'
        value={this.state.targetDeviceType}
        onChange={this.handleChange.bind(this, 'targetDeviceType')}/>

      <Input multiline={true} value={this.state.message} onChange={this.handleChange.bind(this, 'message')}/>

      <Button label='Send message' onClick={this.handleSendMessage}/>
    </div>;
  },

  handleChange(field, value) {
    this.setState({
      ...this.state,
      [field]: value
    });
  },

  handleSendMessage() {
    this.props.sendMessage(this.props.apps.selectedApp.id, this.state)
    .then(data => {
      NotificationManager.info('Message has been sent');
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
    sendMessage(appId, message) {
      return dispatch(messageActions.sendMessage(appId, message));
    },

    fetchDevices() {
      return dispatch(deviceActions.fetchDevices());
    }
  };
})(Messages);
