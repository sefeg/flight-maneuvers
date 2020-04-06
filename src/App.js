/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import maneuversAppReducer from './redux/reducers';

import BriefingRoom from './screens/BriefingRoom';
import ManeuverScreen from './screens/ManeuverScreen';
import xplaneConnector from './api/xplaneConnector';

const Stack = createStackNavigator();

function App() {

  console.log("App started");

  console.log('Create Redux store');
  const store = createStore(maneuversAppReducer);

  console.log("Connect to X-Plane");
  xplaneConnector("192.168.1.26");

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BriefingRoom"
          screenOptions={{
            title: 'FlightManeuvers',
          }}>
          <Stack.Screen name="BriefingRoom" component={BriefingRoom} />
          <Stack.Screen name="ManeuverScreen" component={ManeuverScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
