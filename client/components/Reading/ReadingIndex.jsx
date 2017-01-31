'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {List, AppBar, Navigation, Link} from 'react-toolbox';

import ReadingItem from './ReadingItem.jsx';
import readingActions from '../../actions/readings';

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
  },
 
  setModal(type, value) {
    this.setState({...this.state, 
      [type]: value
    });
  },

  handleRefresh () {
    this.props.fetchReadings({appId: this.props.apps.selectedApp.id});
  },

  render () {
    console.log(this.props.readings.readings);
    return <div>
      <AppBar title='Readings'>
        <Navigation type='horizontal'>
          <Link label='New' onClick={this.setModal.bind(this, 'new', true)}/>
          <Link label='Refresh' onClick={this.refreshReadings} />
        </Navigation>
      </AppBar>

      <ReadingNewDialog
        active={!!this.state.modals.new}
        devices={this.props.devices.devices}
        close={this.setModal.bind(this, 'new', false)}
        refreshReadings={this.refreshReadings}
        selectedApp={this.props.apps.selectedApp}
      />
      
      <ReadingEditDialog active={!!this.state.modals.edit}
        ref='editModal'
        reading={this.props.readings.currentReading}
        close={this.setModal.bind(this, 'edit', false)}
        updateDevice={this.props.updateReading}
        refreshReadings={this.refreshReadings}
      />

      <List>
        {this.props.readings.readings.map(reading => {
          return <ReadingItem
            reading={reading}
            key={`reading-item-${reading.id}`}
            openEdit={this.setModal.bind(this, 'edit', true)}/>;
      })}
      </List>
    </div>;
  }.

  openEditDialog(readingId) {
    this.props.fetchCurrentReading(readingId)
    .then(reading => {
      thiss.refs.editModal.reset();
      this.setModal(edit, true);
    })
    .catch(err => {
      console.error(err);
      NotificationManager.error(err);
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
