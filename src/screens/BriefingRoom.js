/**
 * Provides an overview of all the maneuevers and past performance. The user can select a
 * maneuver from the list to start training.
 * 
 * @author Sebastian Feger
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import ScreenBrief from '../components/ScreenBrief';
import ManeuverOverviewItem from "../components/ManeuverOverviewItem";

export default function BriefingRoom() {
  return (
    <View style={{ padding: 20 }}>
      <ScreenBrief
        briefTitle="BriefingRoom"
        briefDescription="It is important that you regularly train common flight manoeuvres. 
        Exercise and master them and you will know what to do when you need to."
        callToAction="Select a maneuver to start training."
      />
      <ScrollView style={{ paddingTop: 20 }}>
        <ManeuverOverviewItem
          maneuverTitle="Steep turns"
          accuracy={80}
          frequency={9}
        >

        </ManeuverOverviewItem>
      </ScrollView>
    </View>



  );
}

const styles = StyleSheet.create({

  headerContainer: {
    backgroundColor: "gray",
  },
});
