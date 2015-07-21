import React from 'react';
import AppView from './views/AppView.jsx';

var pages = [
      { name: 'welcome', title: 'Welcome', nav: true, auth: false, default: true },
      { name: 'flickr', title: 'Flickr', nav: true, auth: false },
      { name: 'spells', title: 'Spells', nav: true, auth: true }
];
var route = 'welcome';

React.render(<AppView pages={pages} route={route}/>, document.getElementById('root'));
