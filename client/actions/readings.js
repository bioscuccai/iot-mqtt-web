'use strict';

import axios from 'axios';
import _ from 'lodash';

export default {
  fetchReadings (filter) {
    return (dispatch, getState) => {
      return axios.get(`/api/readings`)
      .then(data => {
        dispatch(this.fetchReadingsSuccess(data.data));
        return data.data;
      })
      .catch(err => {
        console.log(err);
      });
    };
  },

  fetchReadingsSuccess(readings) {
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
  },
  
  createReading(reading) {
    return dispatch => {
      let data;
      let meta;
      if (_.isString(reading.data)) {
        try {
          data = JSON.parse(reading.data);
        } catch (err) {
          return dispatch(this.updateReadingFailure(err));
        }
      }
      if (_.isString(reading.meta)) {
        try {
          meta = JSON.parse(reading.meta);
        } catch (err) {
          return dispatch(this.updateReadingFailure(err));
        }
      }
      return axios.post('/api/readings', {
        data,
        meta: meta,
        device: reading.device
      })
      .then(data => {
        dispatch(this.createReadingSuccess(data.data));
        return data.data;
      })
      .catch(err => {
        console.error(err);
        dispatch(this.createReadingError(err));
      });
    };
  },

  createReadingSuccess(reading) {
    return {
      type: 'CREATE_READING_SUCCESS',
      reading
    };
  },

  createReadingError (err) {
    return {
      type: 'CREATE_READING_FAILURE',
      err
    };
  },

  updateReading(reading) {
    return dispatch => {
      let data;
      let meta;
      if (_.isString(reading.data)) {
        try {
          data = JSON.parse(reading.data);
        } catch (err) {
          return dispatch(this.updateReadingFailure(err));
        }
      }
      if (_.isString(reading.meta)) {
        try {
          meta = JSON.parse(reading.meta);
        } catch (err) {
          return dispatch(this.updateReadingFailure(err));
        }
      }

      return axios.post(`/api/readings/${reading.id}`, {
        data,
        meta
      })
      .then(data => {
        dispatch(this.updateReadingSuccess(data.data));
        return data.data;
      })
      .catch(err => {
        console.error(err);
        dispatch(this.updateReadingFailure(err));
      });
    };
  },
  
  updateReadingSuccess(reading) {
    return {
      type: 'UPDATE_READING_SUCCESS',
      reading
    };
  },
  
  updateReadingFailure(err) {
    return {
      type: 'UPDATE_READING_ERROR',
      err
    };
  }
};
