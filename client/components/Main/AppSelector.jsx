'use strict';

import React from 'react';
import { Dropdown } from 'react-toolbox';
import { connect } from 'react-redux';
import _ from 'lodash';

import appActions from '../../actions/apps';

const AppSelector = React.createClass({
  getInitialState() {
    return {
      selectedAppId: null
    };
  },

  componentDidMount() {
    this.props.dispatch(appActions.fetchApps())
      .then(res => {
      });
    this.setState({
      selectedAppId: this.props.apps.selectedApp.id
    });
  },

  render() {
    let apps = this.props.apps.apps.map(app => {
      return {
        value: app.id,
        label: app.name
      };
    });

    return <div>
      <Dropdown value={this.state.selectedAppId} source={apps} onChange={this.handleAppSelected}>
      </Dropdown>
    </div>;
  },

  handleAppSelected(value) {
    this.setState({
      selectedAppId: value
    });
    let app = _.find(this.props.apps.apps, ['id', value]);
    this.props.dispatch(appActions.setSelectedApp(app));
  }
});

export default connect(state => {
  return {
    apps: state.apps
  };
})(AppSelector);
