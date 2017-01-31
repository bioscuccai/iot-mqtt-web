'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {
      id: '',
      name: '',
      type: '',
      token: ''
    };
  },

  render(){
    let actions = [
      {label: 'Update', onClick: this.handleUpdate},
      {label: 'Regen token', onClick: this.handleRegenDeviceToken},
      {label: 'Cancel', onClick: this.props.close}
    ];

    return <Dialog title='Edit Device' active={this.props.active}
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}
      actions={actions}>
      <Input value={this.state.id} disabled={true}/>
      <Input value={this.state.name} label='Name' onChange={this.handleChange.bind(this, 'name')} />
      <Input value={this.state.type} label='Type' onChange={this.handleChange.bind(this, 'type')} />
      <Input value={this.state.token} label='Token' disabled={true}/>
        disabled={true}/>
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      ...this.state,
      [type]: value
    });
  },

  handleUpdate() {
    console.log('handle update');
    this.props.updateDevice({
      ...this.state,
      application: this.props.selectedApp.id
    })
    .then(data => {
      NotificationManager.info('Device has been updated');
      this.props.close();
      this.props.refreshDevices();
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Device update failed');
    });
  },

  handleRegenDeviceToken() {
    return this.props.regenDeviceToken(this.props.device.id)
    .then(data => {
      return this.props.fetchCurrentDevice(this.props.device.id);
    })
    .then(data => {
      this.reset();
      NotificationManager.info('Secret has been regenerated');
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Token regeneratiomn failed');
    });
  },

  reset() {
    this.setState(this.props.device);
  }
});
