/**
 * A screen dedicated to a specific maneuver. Provides an overview of past
 * training performance for that maneuver and records a new training session. In particular,
 * displays live maneuver performance data and retrospective analyes. Displays all information
 * during the entire maneuver cycle (fulfilling requirement, enaging in the maneuver, live performance data,
 * retro-spective analysis).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from "prop-types";
import maneuvers from "../atoms/ManeuverTypes";
import ScreenBrief from "../components/ScreenBrief";
import ManeuverOverviewItem from '../components/ManeuverOverviewItem';
import { connect } from 'react-redux';
import RequirementsContainer from "../container/RequirementsContainer";
import ConnectionContainer from '../container/ConnectionContainer';
import { getManeuverRequierements } from "../selectors/RequirementsCalculator";
import { getManeuverStatus } from "../selectors/ManeuverStatusObserver";
import { startManeuver, stopManeuver, restartCurrentManeuver } from "../actions/actions";
import ManeuverEndStatusContainer from "../container/ManeuverEndStatusContainer";
import ManeuverEngagementMessage from "../components/ManeuverEngagementMessage";
import SteepTurnPerformanceContainer from '../container/maneuvers/SteepTurnPerformanceContainer';


function ManeuverScreen({ maneuverType, allRequirementsFulfilled, userFulfilledEngagementCriteria, startCurrentManeuver, stopCurrentManeuver, maneuverRecording, maneuverEnded, maneuverStopCriteriaReached, maneuverSuccess }) {

  const maneuverDescription = getManeuverDescription(maneuverType);

  if (maneuverRecording) {
    if (maneuverStopCriteriaReached) {
      stopCurrentManeuver(maneuverSuccess);
    }
  } else {
    if (userFulfilledEngagementCriteria) {
      startCurrentManeuver();
    }
  }

  return (
    <View style={styles.rootContainer}>

      <ConnectionContainer />

      {/*<ManeuverOverviewItem style={styles.overviewContainer}
        maneuverTitle={maneuverType} />*/}

      {
        (!maneuverRecording && !maneuverEnded) ? (

          <View>
            <ScreenBrief briefTitle={maneuverType}
              briefDescription={maneuverDescription}
              callToAction="Fullfill the requirements to start training."
            />
            <RequirementsContainer />
          </View>
        ) : (
            <View>
              <ScreenBrief briefTitle={maneuverType}
                briefDescription={maneuverDescription}
                callToAction=""
              />
            </View>
          )
      }

      {(allRequirementsFulfilled && !maneuverRecording && !maneuverEnded) &&
        <ManeuverEngagementMessage engagementMessage="Roll quickly into a 45° turn to start the maneuver" />
      }

      {maneuverEnded &&
        <ManeuverEndStatusContainer maneuverSuccess={false} />
      }

      {(maneuverRecording || maneuverEnded) &&
        <SteepTurnPerformanceContainer />
      }

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
});

ManeuverScreen.propTypes = {
  maneuverType: PropTypes.string.isRequired,
  allRequirementsFulfilled: PropTypes.bool.isRequired,
  startCurrentManeuver: PropTypes.func.isRequired,
  maneuverRecording: PropTypes.bool.isRequired,
  maneuverEnded: PropTypes.bool.isRequired,
  stopCurrentManeuver: PropTypes.func.isRequired,
  maneuverStopCriteriaReached: PropTypes.bool.isRequired,
  maneuverSuccess: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  maneuverType: state.maneuver.maneuverSelected,
  allRequirementsFulfilled: getManeuverRequierements(state).allRequirementsFulfilled,
  userFulfilledEngagementCriteria: getManeuverStatus(state).userFulfilledEngagementCriteria,
  maneuverRecording: state.maneuver.maneuverRecording,
  maneuverEnded: state.maneuver.maneuverEnded,
  maneuverStopCriteriaReached: getManeuverStatus(state).maneuverStopCriteriaReached,
  maneuverSuccess: getManeuverStatus(state).maneuverPerformance.maneuverSuccess,
});

const mapDispatchToProps = dispatch => ({
  startCurrentManeuver: () => dispatch(startManeuver()),
  stopCurrentManeuver: success => dispatch(stopManeuver(success)),
  restartManeuver: () => dispatch(restartCurrentManeuver()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManeuverScreen)