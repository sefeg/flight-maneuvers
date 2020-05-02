import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

/**
 * Indicates the plane's currentBank in respect to the targetBank (default 45°) based on a round
 * progress bar that covers a 90° angle. Values from 0° bank to 90° bank are displayed as progress
 * in the indicator. A bank angle > 90° results in a full progress display.
 * 
 * @param targetBank the ideal bank for the maneuver in degrees. Positive values indicate right turn, negative values a left turn.
 */
export default function HeadingIndicator({ rollInOutHeading, progressInPercent }) {

    const BANK_RANGE_IN_DEGREES = 20;

    var barColor = "#b3b300";

    return (
        <AnimatedCircularProgress
            size={65}
            width={6}
            backgroundWidth={10}
            fill={progressInPercent}
            tintColor={barColor}
            arcSweepAngle={360}
            rotation={rollInOutHeading}
            lineCap="round"
            backgroundColor="#3d5875">
            {(fill) => <Text>{progressInPercent}%</Text>}
        </AnimatedCircularProgress>
    );
}

const styles = StyleSheet.create({
    airspeedContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
});