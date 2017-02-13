'use strict';

import React from 'react';
import {Input, Dropdown, Dialog} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {
      name: '',
      application: '',
      type: ''
    };
  },
  
  render() {
    let actions= [
      {label: 'Create device', onClick: this.handleCreateDevice},
      {label: 'Cancel', onClick: this.props.close}
    ];

    let apps = this.props.apps.apps.map(app => {
      return {
        label: app.name,
        value: app.id
      };
    });

    return <Dialog actions={actions} title='New Device'
      active={this.props.active}
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}>
      <Dropdown
        label='Application'
        source={apps}
        onChange={this.handleChange.bind(this, 'application')}
        value={this.state.application}>
      </Dropdown>
      <Input type='text' value={this.state.name} onChange={this.handleChange.bind(this, 'name')} label='Name'/>
      <Input type='text' value={this.state.type} onChange={this.handleChange.bind(this, 'type')} label='Type'/>
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      [type]: value
    });
  },
  
  handleCreateDevice() {
    this.props.createDevice({
      ...this.state
    })
    .then(data => {
      this.props.refreshDevices();
      this.props.close();
      NotificationManager.info('Device has been created');
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Error creating device');
    });
  }
});
