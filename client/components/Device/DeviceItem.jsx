'use strict';

import React from 'react';
import _ from 'lodash';
import {ListItem} from 'react-toolbox';

export default ({device, openEditDialog}) => {
  let rightActions = [
    {label: 'Delete', onClick: console.log}
  ];

  return <ListItem caption={device.name}
    legend={_.get(device, 'application.name')}
    onClick={openEditDialog}></ListItem>;
};
