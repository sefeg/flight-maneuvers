/**
 * Introduction to a screen with a title and a screen description.
 *
 * @author Sebastian Feger
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

export default function ScreenBrief(props) {
  const callToAction = props.callToAction;
  let callToActionElement;

  if (callToAction) {
    callToActionElement = (
      <Text style={styles.callToActionContainer}>{callToAction}</Text>
    );
  }

  return (
    <View>
      <Text style={styles.heading}>{props.briefTitle}</Text>
      <Text>{props.briefDescription}</Text>
      {callToActionElement}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  callToActionContainer: {
    paddingTop: 10,
  },
});

ScreenBrief.propTypes = {
  /**
   * The displayed screen title
   */
  briefTitle: PropTypes.string.isRequired,

  /**
   * A description of the screen
   */
  briefDescription: PropTypes.string.isRequired,

  /**
   * An optional call to action
   * @example "Select a maneuver to start training"
   */
  callToAction: PropTypes.string,
};
