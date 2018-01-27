import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import uuid from 'uuid';
import { persistor, store } from './src/redux/store';

import TaskDetailsScreen from './src/redux/components/ConnectedTaskDetailsScreen';
import TaskListScreen from './src/redux/components/ConnectedTaskListScreen';
import Loading from './src/components/Loading';

import Amplify from 'aws-amplify-react-native';
import awsmobile from './src/aws-exports';

Amplify.configure(awsmobile);
Auth.configure({ autoRefresh: false });

/**
 * Wrapper helper to map the navigation params to props.  it also adds the appropriate
 * event handlers to ensure that navigation continues to work properly.
 *
 * @param {React.Component} Component the component to wrap
 */
const mapParamsToProps = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const { navigation, ...props } = this.props;
      const { state: { params }} = navigation;

      const eventHandlers = {
        onBack: () => { navigation.goBack(); },
        onAddTask: () => { navigation.navigate('details', { taskId: uuid.v4() }); },
        onViewTask: (item) => { navigation.navigate('details', { taskId: item.taskId }); }
      };

      return <WrappedComponent {...eventHandlers} {...props} {...params} />;
    }
  };
};

const App = (props) => {
  const routeConfig = {
    'master':  { screen: mapParamsToProps(TaskListScreen) },
    'details': { screen: mapParamsToProps(TaskDetailsScreen) }
  };

  const navigatorOptions = {
    initialRoute: 'master',
    headerMode: 'none'
  };

  const Navigator = StackNavigator(routeConfig, navigatorOptions);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loading/>}>
        <Navigator/>
      </PersistGate>
    </Provider>
  );
};

export default App;

