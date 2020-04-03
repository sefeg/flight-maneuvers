/**
 * Provides an overview of all the maneuevers and past performance. The user can select a
 * maneuver from the list to start training.
 *
 * @author Sebastian Feger
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';

import ScreenBrief from '../components/ScreenBrief';
import ManeuverOverviewItem from '../components/ManeuverOverviewItem';
import maneuvers from '../atoms/ManeuverTypes';

export default function BriefingRoom({ navigation }) {
  return (
    <View style={styles.rootContainer}>
      <ScreenBrief
        briefTitle="BriefingRoom"
        briefDescription="It is important that you regularly train common flight maneuvers. 
        Exercise and master them and you will know what to do when you need to."
        callToAction="Select a maneuver to start training."
      />
      <View style={styles.maneuverListContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ManeuverScreen', { maneuverType: maneuvers.steepTurns })
          }>
          <ManeuverOverviewItem
            maneuverTitle={maneuvers.steepTurns}
            accuracy={80}
            frequency={9}
            overallTrainingStatus={83}
          />
        </TouchableOpacity>

        <ManeuverOverviewItem
          maneuverTitle={maneuvers.powerOnStalls}
          accuracy={75}
          frequency={3}
          overallTrainingStatus={71}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    padding: 20,
  },
  maneuverListContainer: {
    paddingTop: 20,
  },
});
