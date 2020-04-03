/**
 * Displays key information about a specific maneuver, including accuracy, frequency, and overall training status.
 * @author Sebastian Feger
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

/**
 * @param {Number} accuracy
 * @returns {String} descriptor for the specified accuracy. Either Very poor (< 20%), Poor (< 40%),
 * Acceptable (< 60%), Good (< 80%), Very good (< 90%), or Excellent (<= 100%).
 */
function getAccuracyDescriptor(accuracy) {
    if (accuracy < 20) {
        return 'Very poor';
    } else if (accuracy < 40) {
        return 'Poor';
    } else if (accuracy < 60) {
        return 'Acceptable';
    } else if (accuracy < 80) {
        return 'Good';
    } else if (accuracy < 90) {
        return 'Very good';
    } else {
        return 'Excellent';
    }
}

/**
 * @param {Number} frequency of completed trainings over the past month
 * @returns {String} descriptor indicating the training frequency. Either Not trained (0 times),
 * Low (<= 2), Medium (<= 5), High (<= 8), or Very high (> 8).
 */
function getFrequencyDescriptor(frequency) {
    if (frequency == 0) {
        return 'Not trained';
    } else if (frequency <= 2) {
        return 'Low';
    } else if (frequency <= 5) {
        return 'Medium';
    } else if (frequency <= 8) {
        return 'High';
    } else {
        return 'Very high';
    }
}

export default function ManeuverOverviewItem(props) {
    let accuracyDescriptor = getAccuracyDescriptor(props.accuracy);
    let frequencyDescriptor = getFrequencyDescriptor(props.frequency);

    const statusValue = props.overallTrainingStatus;

    return (
        <View style={styles.itemContainer}>
            <AnimatedCircularProgress
                size={70}
                width={6}
                backgroundWidth={10}
                fill={statusValue}
                tintColor="#b3b300"
                arcSweepAngle={360}
                rotation={0}
                lineCap="round"
                tintColorSecondary="#00ff00"
                backgroundColor="#3d5875">
                {(fill) => <Text>{statusValue}%</Text>}
            </AnimatedCircularProgress>

            <View style={styles.maneuverInfoContainer}>
                <Text style={styles.maneuverTitle}>{props.maneuverTitle}</Text>
                <Text>
                    Accuracy: {accuracyDescriptor} ({props.accuracy} %)
        </Text>
                <Text>
                    Frequency: {frequencyDescriptor} ({props.frequency} last month)
        </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
    },
    maneuverInfoContainer: {
        paddingLeft: 20,
    },
    maneuverTitle: {
        fontWeight: "bold",
        paddingBottom: 5,
    }
});


ManeuverOverviewItem.propTypes = {
    /**
     * Name of the maneuver
     */
    maneuverTitle: PropTypes.string.isRequired,

    /**
     * Overall accuracy of the maneuver, in percentage (0 - 100)
     */
    accuracy: PropTypes.number.isRequired,

    /**
     * Indicates the number of completed maneuvers over the past month.
     */
    frequency: PropTypes.number.isRequired,

    /**
     * The overall maneuver competence in percent (0 - 100)
     */
    overallTrainingStatus: PropTypes.number.isRequired,
};