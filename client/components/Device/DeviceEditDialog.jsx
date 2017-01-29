'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {
      name: '',
      type: '',
      token: ''
    };
  },

  render(){
    let actions = [
      {label: 'Update', onClick: this.handleUpdate},
      {label: 'Cancel', onClick: this.props.close}
    ];
    
    return <Dialog title='Edit Device' active={this.props.active}
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}
      actions={actions}>
      <Input value={this.state.name} label='Name' onChange={this.handleChange.bind(this, 'name')} />
      <Input value={this.state.type} label='Type' onChange={this.handleChange.bind(this, 'type')} />
      <Input value={this.state.token} label='Token' onChange={this.handleChange.bind(this, 'token')}
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
      this.props.fetchDevices();
    });
  },

  reset() {
    this.setState(this.props.device);
  }
});
