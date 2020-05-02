import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

/**
 * Indicates actualAirspeed in relation to the targetAirspeed on a half-circle round progress bar where
 * the center (90°) represents the targetAirspeed.
 */
export default function AirspeedIndicator({ targetAirspeed, actualAirspeed }) {

    const AIRSPEED_RANGE = 20;

    const LOWER_SPEED_ANGLE = 16;
    const UPPER_SPEED_ANGLE = 85;

    const range_airspeed_green = UPPER_SPEED_ANGLE - LOWER_SPEED_ANGLE;
    const airspeedPerDegree = AIRSPEED_RANGE / range_airspeed_green;

    const lowerAirspeedLimit = targetAirspeed - AIRSPEED_RANGE / 2 - LOWER_SPEED_ANGLE * airspeedPerDegree;
    const upperAirspeedLimit = targetAirspeed + AIRSPEED_RANGE / 2 + LOWER_SPEED_ANGLE * airspeedPerDegree;

    var currentSpeedInDegrees = (actualAirspeed - lowerAirspeedLimit) / airspeedPerDegree;

    if (actualAirspeed < lowerAirspeedLimit) {
        currentSpeedInDegrees = 1;
    } else if (actualAirspeed > upperAirspeedLimit) {
        currentSpeedInDegrees = 100;
    }

    var barColor = "#b3b300";
    if (currentSpeedInDegrees < LOWER_SPEED_ANGLE || currentSpeedInDegrees > UPPER_SPEED_ANGLE) {
        barColor = "#ff531a";
    }

    return (
        <View style={styles.airspeedContainer}>
            <Text>{targetAirspeed - AIRSPEED_RANGE / 2}—</Text>
            <AnimatedCircularProgress
                style={{ top: 15, }}
                size={65}
                width={6}
                backgroundWidth={10}
                fill={currentSpeedInDegrees}
                tintColor={barColor}
                arcSweepAngle={180}
                rotation={270}
                lineCap="round"
                backgroundColor="#3d5875">
                {(fill) => <Text>{actualAirspeed}</Text>}
            </AnimatedCircularProgress>
            <Text>—{targetAirspeed + AIRSPEED_RANGE / 2}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    airspeedContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
});
