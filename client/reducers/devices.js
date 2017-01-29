'use strict';

import _ from 'lodash';

const initialState = {
  currentDevice: {},
  devices: [],
  currentPage: 0,
  totalDevices: 0,
  loaded: false
};

export default function (state = initialState, action) {
  switch(action.type) {
    case 'FETCH_DEVICES_SUCCESS':
      return {
        ...state,
        devices: action.devices,
        totalDevices: action.totalDevices || 0,
        loaded: true
      };
    case 'FETCH_CURRENT_DEVICE_SUCCESS':
      return {
        ...state,
        currentDevice: action.device
      };
  }

  return state;
};
