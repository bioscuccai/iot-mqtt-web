'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

export default React.createClass({
  getInitialState() {
    return {
      id: '',
      data: '',
      meta: ''
    };
  },

  reset() {
    this.setState({
      ...this.props.reading,
      data: JSON.stringify(this.props.reading.data),
      meta: JSON.stringify(this.props.reading.meta)
    });
  },

  render() {
    let actions = [
      {label: 'Update', onClick: this.handleUpdate},
      {label: 'Close', onClick: this.props.close}
    ];

    return <Dialog
      title='Edit Reading'
      actions={actions}
      active={this.props.active}
      onEscKeyDown={this.props.close}
      onOverlayClick={this.props.close}>
      <Input type='text' value={this.state.id} label='Id' disabled={true} />
      <Input type='text' multiLine={true} label='Data' value={this.state.data} onChange={this.handleChange.bind(this, 'data')} />
      <Input type='text' multiLine={true} label='Meta' value={this.state.meta} onChange={this.handleChange.bind(this, 'meta')} />
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      ...this.state,
      [value]: type
    });
  },
  
  handleUpdate() {
    this.props.updateReading(this.state)
    .then(data => {
      NotificationManager.info('Reading has been updated');
      this.props.close();
      return this.props.refreshReadings();
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Update failed');
    });
  }
});
