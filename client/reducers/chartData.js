'use strict';

import _ from 'lodash';

const initialState = {
  chartData: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_DATA':
      return _.assing({}, state, {
        chartData: [...state.chartData, action.data]
      });
  };
  return state;
};
