'use strict';

export default {
  receiveData(data) {
    return {
      type: 'RECEIVE_DATA',
      data
    };
  }
};
