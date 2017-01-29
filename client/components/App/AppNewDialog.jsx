'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {
      name: '',
      description: '',
      token: '',
      secret: ''
    };
  },

  render() {
    let actions = [
      {label: 'Create', onClick: this.handleCreate},
      {label: 'Cancel', onClick: this.props.close}
    ];
    return <Dialog active={this.props.active}
      actions={actions}
      title='New Application'
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}>
      <Input type='text' label='Name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')}/>
      <Input type='text' label='Description' value={this.state.description} onChange={this.handleChange.bind(this, 'description')}/>
      <Input type='text' label='Token' value={this.state.token} onChange={this.handleChange.bind(this, 'token')}/>
      <Input type='text' label='Secret' value={this.state.secret} onChange={this.handleChange.bind(this, 'secret')}/>
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      [type]: value
    });
  },

  handleCreate () {
    this.props.createApp(this.state)
    .then(app => {
      this.props.close();
      this.props.fetchApps();
      console.log('succ');
      NotificationManager.info('Application has been created');
    });
  },

  reset() {
    this.setState({});
  }
});
