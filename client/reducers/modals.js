'use strict';

import _ from 'lodash';

let initialState = {};

export default function (state = initialState, action) {
  switch(action.type) {
    case 'SET_MODAL':
      return _.assign({}, state, {
        [action.scope]: action.state
      });
  };

  return state;
};
