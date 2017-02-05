'use strict';

import axios from 'axios';

export default {
  fetchCurrentDevice(deviceId) {
    return (dispatch, getState) => {
      return axios.get(`/api/devices/${deviceId}`)
      .then(data => {
        dispatch(this.fetchCurrentDeviceSuccess(data.data));
        return data.data;
      });
    };
  },

  fetchCurrentDeviceSuccess(device) {
    return {
      type: 'FETCH_CURRENT_DEVICE_SUCCESS',
      device
    };
  },
  
  fetchDevices (appId) {
    return (dispatch, getState) => {
      return axios.get('/api/devices')
      .then(data => {
        dispatch(this.fetchDevicesSuccess(data.data));
        return data.data;
      });
    };
  },
  
  fetchDevicesSuccess(devices) {
    return {
      type: 'FETCH_DEVICES_SUCCESS',
      devices
    };
  },
  
  deleteDevice(deviceId) {
    return (dispatch, getState) => {
      axios.delete(`/api/devices/${deviceId}`)
      .then(data => {
        dispatch(this.deleteDeviceSuccess(data.data));
        return data.data;
      });
    };
  },
  
  deleteDeviceSuccess(deviceId, data) {
    return {
      type: 'DELETE_DEVICE_SUCCESS',
      deviceId,
      data
    };
  },

  createDevice(device) {
    return dispatch => {
      return axios.post(`/api/devices`, {
        name: device.name,
        type: device.type
      })
      .then(data => {
        dispatch(this.createDeviceSuccess(data.data));
        return data.data;
      });
    };
  },

  createDeviceSuccess(device) {
    return {
      type: 'CREATE_DEVICE_SUCCESS',
      device
    };
  },

  updateDevice(device) {
    return dispatch => {
      return axios.post(`/api/devices/${device.id}`, {
        name: device.name,
        type: device.type
      })
      .then(data => {
        dispatch(this.updateDeviceSuccess(device));
        return data.data;
      });
    };
  },

  updateDeviceSuccess(device) {
    return {
      type: 'UPDATE_DEVICE_SUCCESS',
      device
    };
  },
  
  regenDeviceToken(deviceId) {
    return dispatch => {
      return axios.post(`/api/devices/${deviceId}`)
      .then(data => {
        dispatch(this.regenDeviceTokenSuccess(data.data));
        return data.data;
      });
    };
  },
  
  regenDeviceTokenSuccess(data) {
    return {
      type: 'REGEN_TOKEN_SUCCESS',
      data
    };
  }
};
