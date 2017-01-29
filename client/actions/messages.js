'use strict';

import axios from 'axios';

export default {
  sendMessage(payload) {
    return (dispatch, getState) => {
      return axios.post('/api/messages', {
        message: payload.message
      })
      .then(data => {
        dispatch(this.sendMessageSuccess(data.data));
        return data.data;
      });
    };
  },
  
  sendMessageSuccess(data) {
    return {
      type: 'SEND_MESSAGE_SUCCESS',
      data
    };
  }
};
