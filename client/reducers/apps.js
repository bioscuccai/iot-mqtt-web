'use strict';

import _ from 'lodash';

const initialState = {
  dialogStatus: {
    show: false,
    edit: false,
    new: false
  },
  currentPage: 0,
  apps: [],
  selectedApp: {
    name: '',
    id: null
  },
  currentApp: {},
  error: null,
  loaded: false,

  credentialsLoaded: false,
  credentials: {}
};

function errorState(state, err) {
  return _.assign({}, state, {
    error: err
  });
}

export default function (state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case 'FETCH_APPS_SUCCESS':
      return {
        ...state, 
        apps: action.apps,
        loaded: true
      };

    case 'FETCH_APPS_ERROR':
      return errorState(state, action.error);

    case 'SET_SELECTED_APP':
    	  return {
          ...state,
    	    selectedApp: action.selectedApp
    	  };

    case 'FETCH_CURRENT_APP_SUCCESS':
      return {
        ...state,
        currentApp: action.app
      };

    case 'FETCH_CREDENTIALS_SUCCESS':
      return {
        ...state,
        credentialsLoaded: true,
        credentials: action.credentials
      };

    case 'FETCH_CURRENT_APP_ERROR':
      return errorState(state, action.error);

    default:
      return state;
  }
};
