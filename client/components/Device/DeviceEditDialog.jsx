'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';
import _ from 'lodash';

export default React.createClass({
  getInitialState() {
    return {
      id: '',
      name: '',
      type: '',
      token: ''
    };
  },

  componentWillReceiveProps (nextProps) {
    console.log(nextProps.device);
    this.setState(nextProps.device);
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
      <Input value={this.state.token} label='Token' disabled={true} onChange={this.handleChange.bind(this, 'token')}/>
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      ...this.state,
      [type]: value
    });
  },

  handleUpdate() {
    this.props.updateDevice({
      ...this.state,
      application: this.props.selectedApp.id
    })
    .then(data => {
      NotificationManager.info('Device has been updated');
      this.props.refreshDevices();
      return this.props.fetchCurrentDevice(this.props.device.id);
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Device update failed');
    });
  },

  handleRegenDeviceToken() {
    return this.props.regenDeviceToken(this.props.device.id)
    .then(data => {
      NotificationManager.info('Secret has been regenerated');
      return this.props.fetchCurrentDevice(this.props.device.id);
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Token regeneration failed');
    });
  },

  reset() {
    this.setState(_.assign({
      id: '',
      name: '',
      type: '',
      token: ''
    }, this.props.device));
  }
});
