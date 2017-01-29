'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Dropdown, Button, AppBar, Navigation, Link, Input} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

import messageActions from '../../actions/messages';

const Messages = React.createClass({
  getInitialState () {
    return {
      message: ''
    };
  },

  render() {
    let options = this.props.devices.devices.map(device => {
      return {
        label: device.name,
        value: device.id
      };
    });
    
    return <div>
      <AppBar title='Messages'>
        <Navigation type='horizontal'>
          
        </Navigation>
      </AppBar>
      <Dropdown source={options} label='Devices'/>
      
      <Input multiline={true} value={this.state.message} onChange={this.handleChange.bind(this, this.state.message)}/>
      
      <Button label='Send message' onClick={this.props.handleSendMessage}/>
    </div>;
  },

  handleChange(field, value) {
    this.setState({
      ...this.state,
      [field]: value
    });
  },

  handleSendMessage() {
    this.props.sendMessage(this.state)
    .then(data => {
      NotificationManager.info('Message has been sent');
    });
  }
});

export default connect(state => {
  return {
    devices: state.devices
  };
}, dispatch => {
  return {
    sendMessage(message) {
      dispatch(messageActions.sendMessage(message));
    }
  };
})(Messages);
