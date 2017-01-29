'use strict';

import axios from 'axios';

export default {
  fetchReadings (filter) {
    return (dispatch, getState) => {
      return axios.get(`/api/readings`)
      .then(data => {
        dispatch(this.fetchReadingsSuccess(data.data));
        console.log('reading succ');
        return data.data;
      })
      .catch(err => {
        console.log(err);
      });
    };
  },

  fetchReadingsSuccess(readings) {
    console.log('reading succ 2');
    return {
      type: 'FETCH_READINGS_SUCCESS',
      readings
    };
  },

  fetchCurrentReading(readingId) {
    return (dispatch, getState) => {
      return axios.get(`/api/readings/${readingId}`)
      .then(data => {
        dispatch(this.fetchCurrentReadingSuccess(data.data));
        return data.data;
      });
    };
  },

  fetchCurrentReadingSuccess(reading) {
    return {
      type: 'FETCH_CURRENT_READING_SUCCESS',
      reading
    };
  }
};
