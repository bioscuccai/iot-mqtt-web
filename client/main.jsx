'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute,hashHistory} from 'react-router';

import 'react-toolbox/lib/commons.scss';
import 'react-notifications/lib/notifications.css';
import 'highlight.js/styles/androidstudio.css';

import Main from './components/Main/Main.jsx';
import Container from './components/Main/Container.jsx';
import AppIndex from './components/App/AppIndex.jsx';
import DeviceIndex from './components/Device/DeviceIndex.jsx';
import ReadingIndex from './components/Reading/ReadingIndex.jsx';
import Chart from './components/Chart/Chart.jsx';
import Messages from './components/Message/Messages.jsx';

import reducers from './reducers';
import sagas from './sagas/apps';

const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}>
  <Router history={hashHistory}>
    <Route path='/' component={Container}>
      <IndexRoute component={Main}></IndexRoute>
      <Route path='/apps' component={AppIndex}></Route>
      <Route path='/devices' component={DeviceIndex}></Route>
      <Route path='/readings' component={ReadingIndex}></Route>
      <Route path='/charts' component={Chart}></Route>
      <Route path='/messages' component={Messages}></Route>
    </Route>
  </Router>
</Provider>, document.getElementById('cont'));
