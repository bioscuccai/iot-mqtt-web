'use strict';

import axios from 'axios';

export default {
  setSelectedApp (selectedApp) {
    return {
      type: 'SET_SELECTED_APP',
      selectedApp
    };
  },
  
  fetchApps () {
    return (dispatch, getState) => {
      return axios.get('/api/applications')
      .then(data => {
        dispatch(this.fetchAppsSuccess(data.data));
        return data;
      });
    };
  },

  fetchAppsSuccess (apps) {
    return {
      type: 'FETCH_APPS_SUCCESS',
      apps
    };
  },

  fetchCurrentApp (appId) {
    return (dispatch, getState) => {
      return axios.get(`/api/applications/${appId}`)
      .then(data => {
        dispatch(this.fetchCurrentAppSuccess(data.data));
        return data.data;
      });
    };
  },

  fetchCurrentAppSuccess(app) {
    return {
      type: 'FETCH_CURRENT_APP_SUCCESS',
      app
    };
  },

  createApp(app) {
    return (dispatch, getState) => {
      return axios.post('/api/applications', {
        name: app.name,
        description: app.description
      })
      .then(data => {
        dispatch(this.createAppSuccess(data.data));
      });
    };
  },

  createAppSuccess(app) {
    return {
      type: 'CREATE_APP_SUCCESS',
      app
    };
  },
  
  deleteApp(appId) {
    return (dispatch, getState) => {
      return axios.delete(`/api/apps/${appId}`)
      .then(data => {
        dispatch(this.deleteAppSuccess(appId, data.data));
        return data.data;
      });
    };
  },
  
  deleteAppSuccess(appId, data) {
    return {
      type: 'DELETE_APP_SUCCESS',
      appId,
      data
    };
  },

  updateApp(app) {
    return dispatch => {
      return axios.post(`/api/applications/${app.id}`, {
        name: app.name,
        descriptions: app.description
      })
      .then(data => {
        dispatch(this.updateAppSuccess(app));
      });
    };
  },

  updateAppSuccess(app) {
    return {
      type: 'UPDATE_APP_SUCCESS',
      app
    };
  },

  fetchCredentials() {
    return dispatch => {
      return axios.get(`/api/applications/credentials`)
      .then(data => {
        dispatch(this.fetchCredentialsSuccess(data.data));
        return data.data;
      });
    };
  },

  fetchCredentialsSuccess(credentials) {
    return {
      type: 'FETCH_CREDENTIALS_SUCCESS',
      credentials
    };
  }
};
