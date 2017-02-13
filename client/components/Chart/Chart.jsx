'use strict';

import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Button, AppBar, Navigation, Checkbox} from 'react-toolbox';
import {Line} from 'react-chartjs';

import chartDataActions from '../../actions/chartData';
import readingActions from '../../actions/readings';


const Chart = React.createClass({
  getInitialState() {
    return {
      readings: [],
      chartdata: {
        keys: [],
        datasets: []
      }
    };
  },

  chartKeys () {
    return _(this.state.readings.readings).map(reading => _.keys(reading.data)).flatten().uniq().value();
  },

  parseDataFromReadings () {
    let keys = this.chartKeys();
    let datasets = keys.map(key => {
      let it = 0;
      return {
        label: key,
        data: _(this.state.readings.readings).map('data.' + key).map(val => val || 0).map(val => {
          return {
            x: it++,
            y: val
          };
        }).value()
      };
    });

    let chartData = {
      /*labels: {
        xLabels: ['a'],
      yLabels: ['a']
      },*/
      labels: _.repeat_.maxBy(datasets, 'data.length'),
      datasets: datasets
    };

    return chartData;
  },

  render() {
    let data = this.parseDataFromReadings();
    console.log(data);

    let keys = this.chartKeys();
    return <div>
      <AppBar title='Chart'>
        <Navigation type='horizontal'>
        </Navigation>
      </AppBar>
      
      {keys.map(key => {
        return <Checkbox key={`chart-key-${key}`} label={key} onChange={this.handleKeyChange.bind(this, key)}/>;
      })}
      <Button label='Clean' onClick={this.props.clean} />
      <div>
        <Line data={data}></Line>
      </div>
    </div>;
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      readings: nextProps.readings
    });
  },

  componentDidMount () {
    this.props.fetchReadings();
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
  },

  clean () {
    this.setState({
      data: []
    });
  }
});

export default connect(state => {
  return {
    chartData: state.chartData,
    readings: state.readings
  };
}, dispatch => {
  return {
    receiveData(data) {
      dispatch(chartDataActions.receiveData(data));
    },

    clean() {
      dispatch(chartDataActions.clean());
    },

    fetchReadings() {
      dispatch(readingActions.fetchReadings());
    }
  };
})(Chart);
