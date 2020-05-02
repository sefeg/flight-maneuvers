/**
 * Provides an overview of all the maneuevers and past performance. The user can select a
 * maneuver from the list to start training.
 *
 * @author Sebastian Feger
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from "prop-types";

import { setSelectedManeuever } from "../actions/actions";

import ScreenBrief from '../components/ScreenBrief';
import ManeuverOverviewItem from '../components/ManeuverOverviewItem';
import maneuvers from '../atoms/ManeuverTypes';
import { connect } from 'react-redux';
import ConnectionContainer from '../container/ConnectionContainer';
import KeepAwake from 'react-native-keep-awake';

function BriefingRoom({ navigation, navigateToManeuver }) {

  return (
    <View style={styles.rootContainer}>
      <KeepAwake />
      <ConnectionContainer />
      <ScreenBrief
        briefTitle="BriefingRoom"
        briefDescription="It is important that you regularly train common flight maneuvers. 
        Exercise and master them and you will be ready when you need to be."
        callToAction="Select a maneuver to start training."
      />
      <View style={styles.maneuverListContainer}>
        <TouchableOpacity onPress={() => navigateToManeuverScreen(maneuvers.STEEP_TURNS)}>
          <ManeuverOverviewItem
            maneuverTitle={maneuvers.STEEP_TURNS}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateToManeuverScreen(maneuvers.POWER_ON_STALLS)}>
          <ManeuverOverviewItem
            maneuverTitle={maneuvers.POWER_ON_STALLS}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  function navigateToManeuverScreen(maneuver) {

    navigateToManeuver(maneuver);
    navigation.navigate('ManeuverScreen');
  }
}

BriefingRoom.propTypes = {
  navigateToManeuver: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  rootContainer: {
    padding: 20,
  },
  maneuverListContainer: {
    paddingTop: 20,
  },
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  navigateToManeuver: maneuver => dispatch(setSelectedManeuever(maneuver)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BriefingRoom)