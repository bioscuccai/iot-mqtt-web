'use strict';

import React from 'react';
import {Navigation, Link} from 'react-toolbox';
import AppSelector from './AppSelector.jsx';

export default React.createClass({
  render () {
  	  return <div>
  	  		<AppSelector></AppSelector>
					<Navigation type='vertical'>
						<Link href='#/apps' label='Apps' />
						<Link href='#/devices' label='Devices'/>
						<Link href='#/readings' label='Readings' />
						<Link href='#/messages' label='Messages' />
						<Link href='#/charts' label='Charts' />
					</Navigation>
  	  </div>;
  }
});
