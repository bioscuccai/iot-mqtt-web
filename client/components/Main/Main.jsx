'use strict';

import React from 'react';
import {connect} from 'react-redux';

import { Button } from 'react-toolbox/lib/button';

import appActions from '../../actions/apps';

const Main = React.createClass({
  componentWillMount() {
    if (!this.props.credentialsLoaded) {
      this.props.fetchCredentials();
    }
  },

  render() {
    return <div>
      <h1>Credentials</h1>
      <dl>
        <dt>MQTT Port</dt>
        <dd>{this.props.credentials.mqttPort}</dd>

        <dt>MQTT Websocket port</dt>
        <dd>{this.props.credentials.mqttWsPort}</dd>
      </dl>
    </div>;
  }
});

export default connect(state => {
  return {
    credentials: state.apps.credentials,
    credentialsLoaded: state.apps.credentialsLoaded
  };
}, dispatch => {
  return {
    fetchCredentials() {
      dispatch(appActions.fetchCredentials());
    }
  };
})(Main);
