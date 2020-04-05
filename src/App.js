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

import BriefingRoom from './screens/BriefingRoom';
import ManeuverScreen from './screens/ManeuverScreen';
import xplaneConnector from './api/xplaneConnector';

const Stack = createStackNavigator();

function App() {

  console.log("App started");

  xplaneConnector("192.168.1.26");

  return (
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
  );
}

export default App;
