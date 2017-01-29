'use strict';

import _ from 'lodash';

const initialState = {
  readings: [],
  totalReadings: 0,
  currentPage: 0,
  currentReading: {},
  loaded: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'FETCH_READINGS_SUCCESS':
      return {
        ...state,
        readings: action.readings.readings,
        loaded: true,
        totalReadings: action.readings.count
      };
    case 'FETCH_CURRENT_READING_SUCCESS':
      return {
        ...state,
        currentReading: action.reading
      };
  }

  return state;
};
