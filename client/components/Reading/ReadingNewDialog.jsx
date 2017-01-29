'use strict';

import React from 'react';
import {Dialog, Input, Dropdown} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {};
  },

  render() {
    let actions = [
      {label: 'Create', onClick: this.handleCreate},
      {label: 'Cancel', onClick: this.props.close}
    ];

    let devices = this.props.devices.map(device => {
      return {
        value: device.id,
        label: device.name
      };
    });

    return <Dialog active={this.props.active}
      onOverlayClick={this.props.close}
      onEscKeydown={this.props.close}
      title='New Reading'
      actions={actions}>
      <Dropdown label='Device'
        value={this.state.deviceId}
        onChange={this.handleChange.bind(this, 'deviceId')}
        source={devices}/>
      <Input label='Payload' value={this.state.payload} onChange={this.handleChange.bind(this, 'payload')}/>
    </Dialog>;
  },

  handleChange(type, value) {
    this.getState({
      ...this.state,
      [type]: value
    });
  },

  handleCreate () {
    this.props.createReading(this.state)
    .then(data => {
      NotificationManager.info('Reading has been created');
      this.props.close();
      this.props.refreshReadings();
    });
  }
});
