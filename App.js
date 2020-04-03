/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import BriefingRoom from './src/screens/BriefingRoom';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BriefingRoom"
        screenOptions={{
          title: 'FlightManeuvers',
        }}>
        <Stack.Screen name="BriefingRoom" component={BriefingRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
