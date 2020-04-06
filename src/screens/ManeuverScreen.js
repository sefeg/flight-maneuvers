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
import { connect } from 'react-redux';

function ManeuverScreen({ maneuverType }) {

  const maneuverDescription = getManeuverDescription(maneuverType);

  return (
    <View style={styles.rootContainer}>

      <ManeuverOverviewItem style={styles.overviewContainer}
        maneuverTitle={maneuverType} />
      <ScreenBrief briefTitle={maneuverType}
        briefDescription={maneuverDescription}
        callToAction="Fullfill the requirements to start training."
      />
      <RequirementsView />
    </View>
  );
}

function getManeuverDescription(maneuverType) {

  if (maneuverType == maneuvers.STEEP_TURNS) {
    return "Regularly practice controlled and accurate steep turns. They can come in handy when you get into a busy or unforseen situation where you have to change course rapidly.";
  } else if (maneuverType == maneuvers.POWER_ON_STALLS) {
    return "Practice Power ON stalls to know how to react when a stall occurs during take off.";
  }
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
  maneuverType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  maneuverType: state.maneuverSelection,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ManeuverScreen)