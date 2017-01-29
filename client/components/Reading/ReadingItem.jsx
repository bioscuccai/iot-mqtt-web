'use strict';

import React from 'react';
import {ListItem} from 'react-toolbox';
import Highlight from 'react-highlight';

export default ({reading, openEdit}) => <ListItem caption={reading.createdAt}
  onClick={openEdit}>
  <div>
    <Highlight className='json'>
      {JSON.stringify(reading.data)}
    </Highlight>
  </div>
  
  <div>
    {reading.createdAt}
  </div>
</ListItem>;
