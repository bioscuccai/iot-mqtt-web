'use strict';

import {call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

import appActions from '../actions/apps';

function* fetchApps (action) {
  try {
    let apps = yield call(axios.get, '/apps.json', {}, {responseType: 'json'});
    yield put(appActions.fetchAppsSuccess(apps.data));
  } catch (err) {
    console.log(err);
    yield put(appActions.fetchAppsError(err));
  }
}

function* createApp(action) {
  try {
    let app = yield call(axios.post, '/api/apps', action.app);
    yield put(appActions.createAppSuccess(app));
  } catch (err) {
    yield put(appActions.createAppError(err));
  }
}

function* updateApp(action) {
  try {
    let app = yield call(axios.post, `/api/apps/${action.app.id}`, action.app);
    yield put(appActions.upateAppSuccess(app));
  } catch (err) {
    yield put(appActions.updateAppError(err));
  }
}

function* deleteApp(action) {
  try {
    let deletion = yield call(axios.delete, `/api/apps/${action.appId}`);
    yield put(appActions.deleteAppSuccess(deletion));
  } catch (err) {
    yield put(appActions.deleteAppError(err));
  }
}

function* fetchCurrentApp(action) {
  try {
    let app = yield call(`/api/apps/${action.appId}`);
  } catch(err) {
    yield put(appActions.fetchCurrentAppError(err));
  }
}

export default function* () {
  yield takeLatest('FETCH_APPS', fetchApps);
  yield takeLatest('FETCH_CURRENT_APP', fetchCurrentApp);
  yield takeLatest('UPDATE_APP', updateApp);
  yield takeLatest('DELETE_APP', deleteApp);
}
