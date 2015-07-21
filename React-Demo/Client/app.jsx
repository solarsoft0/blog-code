import React from 'react';
import dispatcher from './dispatcher';
import AppView from './views/AppView.jsx';

dispatcher.dispatch('APPINIT');

React.render(<AppView/>, document.getElementById('root'));
