'use strict';

import React from 'react';
import {ListItem} from 'react-toolbox';

export default ({app, openEditDialog}) => <ListItem
  caption={app.name}
  legend={app.description}
  onClick={openEditDialog}>
</ListItem>;
