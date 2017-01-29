'use strict';

import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Button, AppBar, Navigation, Checkbox} from 'react-toolbox';

import chartDataActions from '../../actions/chartData';

const Chart = React.createClass({
  getInitialState() {
    return {
      keys: []
    };
  },

  render() {
    let keys = _(this.props.chartData).map(_.keys).flatten().uniq().value();
    return <div>
      <AppBar title='Chart'>
        <Navigation type='horizontal'>
      
        </Navigation>
      </AppBar>
      
      {this.keys.map(key => {
        return <Checkbox key={`chart-key-${key}`} label={key} onChange={this.handleKeyChange.bind(this, key)}/>;
      })}
      <Button label='Clean' onClick={this.props.clean} />
    </div>;
  },

  componentWillMount () {
  
  },

  componentWillUnmount () {
  
  },
  
  handleKeyChange(key, value) {
    this.setState({
      ...this.state,
      keys: {
        [key]: value
      }
    });
  }
});

export default connect(state => {
  return {
    chartData: state.chartData
  };
}, dispatch => {
  return {
    receiveData(data) {
      dispatch(chartDataActions.receiveData(data));
    },

    clean() {
      dispatch(chartDataActions.clean());
    }
  };
})(Chart);
