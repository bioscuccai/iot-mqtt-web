'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {List, ListItem, Button, AppBar, Navigation, Link} from 'react-toolbox';

import appActions from '../../actions/apps';
import AppItem from './AppItem.jsx';
import AppNewDialog from './AppNewDialog.jsx';
import AppEditDialog from './AppEditDialog.jsx';

const AppIndex = React.createClass({
  getInitialState() {
    return {
      modals: {
        new: false,
        edit: false
      }
    };  
  },

  render () {
    return <div>
      <AppBar title='Applications'>
        <Navigation type='horizontal'>
          <Link label='New' onClick={this.openNewDialog} />
          <Link label='Refresh' onClick={this.props.fetchApps}/>
        </Navigation>
      </AppBar>

      <AppNewDialog active={!!this.state.modals.new}
        close={this.setModal.bind(this, 'new', false)}
        createApp={this.props.createApp}
        fetchApps={this.props.fetchApps}/>
      
      <AppEditDialog active={!!this.state.modals.edit}
        ref='editDialog'
        close={this.setModal.bind(this, 'edit', false)}
        updateApp={this.props.updateApp}
        fetchApps={this.props.fetchApps}
        app={this.props.apps.currentApp} />

      <List>
        {this.props.apps.apps.map(app => {
          return <AppItem key={`main-app-list-${app.id}`} app={app}
          openEditDialog={this.openEditDialog.bind(this, app.id)}></AppItem>;
        })}
      </List>
    </div>;
  },

  onNewAppClick(e) {
    e.preventDefault();
  },

  setModal(type, value) {
    this.setState({
      ...this.state,
      modals: {
        [type]: value
      }
    });
  },

  openEditDialog(appId) {
    this.props.fetchCurrentApp(appId)
    .then(app => {
      this.refs.editDialog.reset();
      this.setModal('edit', true);
    });
  },

  openNewDialog() {
    this.refs.newDialog.reset();
    this.setModal('new', true);
  }
});

export default connect(state => {
  return {
    apps: state.apps
  };
}, (dispatch) => {
  return {
    fetchApps() {
      return dispatch(appActions.fetchApps());
    },
    
    fetchCurrentApp(appId) {
      return dispatch(appActions.fetchCurrentApp(appId));
    },

    updateApp(app) {
      return dispatch(appActions.updateApp(app));
    },
    
    createApp(app) {
      return dispatch(appActions.createApp(app));
    },
    
    deleteApp(appId) {
      return dispatch(appActions.deleteApp(appId));
    }
  };
})(AppIndex);
