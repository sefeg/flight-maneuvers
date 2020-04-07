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
import maneuversAppReducer from './reducers/reducers';

import BriefingRoom from './screens/BriefingRoom';
import ManeuverScreen from './screens/ManeuverScreen';
import XPlaneConnector from './api/XPlaneConnector';

import { signalRPOSDataReceived } from "../src/actions/actions";

const Stack = createStackNavigator();

function App() {

  console.log("App started");

  console.log('Create Redux store');
  const store = createStore(maneuversAppReducer);
  console.log(store.getState());

  return (
    <Provider store={store}>
      <XPlaneConnector remoteAddress="192.168.1.26" store={store} />
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
