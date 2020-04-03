/**
 * Provides an overview of all the maneuevers and past performance. The user can select a
 * maneuver from the list to start training.
 *
 * @author Sebastian Feger
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import ScreenBrief from '../components/ScreenBrief';
import ManeuverOverviewItem from '../components/ManeuverOverviewItem';

export default function BriefingRoom() {
  return (
    <View style={styles.rootContainer}>
      <ScreenBrief
        briefTitle="BriefingRoom"
        briefDescription="It is important that you regularly train common flight manoeuvres. 
        Exercise and master them and you will know what to do when you need to."
        callToAction="Select a maneuver to start training."
      />
      <ScrollView style={styles.maneuverListContainer}>
        <ManeuverOverviewItem
          maneuverTitle="Steep turns"
          accuracy={80}
          frequency={9}
          overallTrainingStatus={83}
        />
        <ManeuverOverviewItem
          maneuverTitle="Power ON stalls"
          accuracy={75}
          frequency={3}
          overallTrainingStatus={71}
        />
      </ScrollView>
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
