'use strict';

import axios from 'axios';

export default {
  sendMessage(appId, message) {
    return (dispatch) => {
      return axios.post(`/api/applications/${appId}/messages`, {
        payload: {
          targetDevice: message.targetDevice,
          targetDeviceType: message.targetDeviceType,
          message: message.message
        }
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
