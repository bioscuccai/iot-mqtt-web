'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {List, AppBar, Navigation, Link} from 'react-toolbox';
import {NotificationManager} from 'react-notifications';

import ReadingItem from './ReadingItem.jsx';
import readingActions from '../../actions/readings';
import deviceActions from '../../actions/devices';

import ReadingNewDialog from './ReadingNewDialog.jsx';
import ReadingEditDialog from './ReadingEditDialog.jsx';

const ReadingIndex = React.createClass({
  getInitialState() {
    return {
      modals: {
        new: false,
        edit: false
      }
    };
  },

  componentWillMount() {
    if (!this.props.readings.loaded) {
      this.props.fetchReadings();
    }
    if(!this.props.devices.loaded) {
      this.props.fetchDevices();
    }
  },
 
  setModal(type, value) {
    this.setState({
      ...this.state,
      modals: {
        [type]: value
      }
    });
  },

  handleRefresh () {
    this.props.fetchReadings({appId: this.props.apps.selectedApp.id});
  },

  render () {
    return <div>
      <AppBar title='Readings'>
        <Navigation type='horizontal'>
          <Link label='New' onClick={this.openNewDialog}/>
          <Link label='Refresh' onClick={this.refreshReadings} />
        </Navigation>
      </AppBar>

      <ReadingNewDialog
        ref='newDialog'
        active={!!this.state.modals.new}
        devices={this.props.devices.devices}
        close={this.setModal.bind(this, 'new', false)}
        refreshReadings={this.refreshReadings}
        selectedApp={this.props.apps.selectedApp}
        createReading={this.props.createReading}
      />
      
      <ReadingEditDialog active={!!this.state.modals.edit}
        ref='editModal'
        reading={this.props.readings.currentReading}
        close={this.setModal.bind(this, 'edit', false)}
        updateReading={this.props.updateReading}
        refreshReadings={this.refreshReadings}
        fetchCurrentReading={this.props.fetchCurrentReading}
      />

      <List>
        {this.props.readings.readings.map(reading => {
          return <ReadingItem
            reading={reading}
            key={`reading-item-${reading.id}`}
            openEdit={this.openEditDialog.bind(this, reading.id)}/>;
      })}
      </List>
    </div>;
  },

  openNewDialog() {
    this.refs.newDialog.reset();
    this.setModal('new', true);
  },

  openEditDialog(readingId) {
    this.props.fetchCurrentReading(readingId)
    .then(reading => {
      this.refs.editModal.reset();
      this.setModal('edit', true);
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error('Error fetching reading');
    });
  },

  refreshReadings() {
    return this.props.fetchReadings({
      appId: this.props.apps.selectedApp.id
    });
  }
});

export default connect(state => {
  return {
    readings: state.readings,
    devices: state.devices,
    apps: state.apps
  };
}, dispatch => {
  return {
    fetchReadings(filter = {}) {
      return dispatch(readingActions.fetchReadings(filter));
    },

    fetchDevices(filter = {}) {
      return dispatch(deviceActions.fetchDevices(filter));
    },

    fetchCurrentReading(readingId) {
      return dispatch(readingActions.fetchCurrentReading(readingId));
    },

    createReading(reading) {
      return dispatch(readingActions.createReading(reading));
    },

    updateReading(reading) {
      return dispatch(readingActions.updateReading(reading));
    }
  };
})(ReadingIndex);
