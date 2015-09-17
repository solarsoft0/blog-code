import React from 'react';
import Logger from './lib/Logger';

import dispatcher from './dispatcher';
import AppStore from './stores/AppStore';
import ImageStore from './stores/ImageStore';
import AppView from './views/AppView';

var appLogger = new Logger('bootstrap');
appLogger.debug('Registering Stores');
dispatcher.registerStore(new AppStore());
dispatcher.registerStore(new ImageStore());

appLogger.debug('Dispatching INITIALIZE action to all stores');
dispatcher.dispatch('INITIALIZE');

appLogger.debug('Rendering Root View');
React.render(<AppView/>, document.getElementById('root'));
