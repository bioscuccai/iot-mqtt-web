'use strict';

import React from 'react';
import {Dialog, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';
import _ from 'lodash';

export default React.createClass({
  getInitialState() {
    return {
      id: '',
      data: '',
      meta: ''
    };
  },

  componentWillReceiveProps (nextProps) {
    console.log();
    this.setState(_.assign({}, nextProps.reading, {
      data: JSON.stringify(nextProps.reading.data),
      meta: JSON.stringify(nextProps.reading.meta)
    }));
  },

  reset() {
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
      <Input type='text' multiline={true} label='Data' value={this.state.data} onChange={this.handleChange.bind(this, 'data')} />
      <Input type='text' multiline={true} label='Meta' value={this.state.meta} onChange={this.handleChange.bind(this, 'meta')} />
    </Dialog>;
  },

  handleChange(type, value) {
    this.setState({
      ...this.state,
      [type]: value
    });
  },
  
  handleUpdate() {
    this.props.updateReading(this.state)
    .then(data => {
      NotificationManager.info('Reading has been updated');
      return this.props.refreshReadings();
    })
    .then( () => {
      return this.props.fetchCurrentReading(this.props.reading.id);
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Update failed');
    });
  }
});
