'use strict';

export default {
  openModal(scope, modal) {
    return {
      type: 'SET_MODAL',
      scope,
      state: true
    };
  },

  closeModal(scope, modal) {
    return {
      type: 'SET_MODAL',
      scope,
      state: false
    };
  }
};
