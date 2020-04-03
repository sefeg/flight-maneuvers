/**
 * A screen dedicated to a specific maneuver. Provides an overview of past
 * training performance for that maneuver and records a new training session.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from "prop-types";
import maneuvers from "../atoms/ManeuverTypes";
import ScreenBrief from "../components/ScreenBrief";
import ManeuverOverviewItem from '../components/ManeuverOverviewItem';
import RequirementsView from '../components/RequirementsView';

export default function ManeuverScreen({ route }) {

  const { maneuverType } = route.params;

  return (
    <View style={styles.rootContainer}>

      <ManeuverOverviewItem style={styles.overviewContainer}
        maneuverTitle={maneuverType} accuracy={80} frequency={9} overallTrainingStatus={83} />
      <ScreenBrief briefTitle={maneuverType}
        briefDescription="Regularly practice controlled and accurate steep turns. They can come in handy when you get into a busy or unforseen situation where you have to change course rapidly."
        callToAction="Fullfill the requirements to start training."
      />
      <RequirementsView />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    padding: 20,
  },
  overviewContainer: {
    paddingTop: 20,
  },
  requirementsContainer: {

  }
});

ManeuverScreen.propTypes = {
};
