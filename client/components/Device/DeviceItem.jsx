'use strict';

import React from 'react';
import _ from 'lodash';
import {ListItem} from 'react-toolbox';

export default ({device, openEditDialog}) => <ListItem caption={device.name}
  legend={_.get(device, 'application.name')}
  onClick={openEditDialog}></ListItem>;
