'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  componentWillMount () {
    this.setState(this.props.app);
  },

  reset(){
    this.setState(this.props.app);
  },

  render() {
    let actions = [
      {label: 'Cancel', onClick: this.props.close},
      {label: 'Update', onClick: this.handleUpdate},
      {label: 'Regen token', onClick: this.handleRegen}
    ];
    return <Dialog active={this.props.active}
      title='Update application'
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}
      actions={actions}>
      <Input type='text' value={this.state.name} label='Name' onChange={this.handleChange.bind(this, 'name')}/>
      <Input type='text' value={this.state.description} label='Description' onChange={this.handleChange.bind(this, 'description')} />
      <Input type='text' value={this.state.name} label='Name' />
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({...this.state, [type]: value});
  },

  handleRegen() {
    return this.props.regen(this.state.appId)
    .then(data => {
      this.props.close();
    });
  },

  handleUpdate() {
    return this.props.updateApp(this.state)
    .then(data => {
      NotificationManager.info('Application has been updated');
      this.props.fetchApps();
      this.props.close();
    });
  }
});

