import React from "react";
import { View, Text } from "react-native";

/**
 * The width of the marker labels
 */
const MARKER_LABEL_WIDTH = 70;

/**
 * Determines the ratio between the inner range that covers 2* elevationLimits and the outer (red) boxes
 */
const OUTER_BOX_RATIO = 0.15;

/**
 * Height of the marker labels
 */
const MARKER_CONTAINER_HEIGHT = 15;

/**
 * Fixed value that describes the number of pixels the marker dash is offset from the center of the label
 */
const MARKER_NON_CENTERED_CORRECTION_FACTOR = 2;

/**
 * The space between the bar and the markers, i.e. the dash of the markers
 */
const DISTANCE_MARKERS_TO_BAR = 2;


/**
 * A vertical bar that indicates deviation in altitude (ft) from a targetElevation. Depending on the value of actualElevation, displays
 * a marker that is moving within a green range denoted by elevationLimits, and within the two outside red boxes that provide a small
 * range of altitude outside the target area. actualElevation beyond the absolute limits of the bar are marked on the absolut top or
 * bottom position of the ElevationIndicator. 
 */
export default function ElevationIndicator({ targetElevation, actualElevation, elevationLimits = 100, height = 70 }) {

    const barWidth = height * 0.25;
    const componentWidth = 2 * MARKER_LABEL_WIDTH + barWidth;
    const componentHeight = height + 2 * (MARKER_CONTAINER_HEIGHT / 2 + MARKER_NON_CENTERED_CORRECTION_FACTOR); //Component height is bar height + correction because of the space labels need on the upper and lower limit

    const outerHeight = height * OUTER_BOX_RATIO; //height (in pixels) of the outer boxes
    const innerHeight = height - 2 * outerHeight; //height (in pixels) of the center main box

    /**
     * Position of the upper marker (+100 ft)
     */
    const upperPosition = outerHeight - MARKER_CONTAINER_HEIGHT / 2 - MARKER_NON_CENTERED_CORRECTION_FACTOR;

    /**
     * Position of the lower marker (-100 ft)
     */
    const lowerPosition = innerHeight - (MARKER_CONTAINER_HEIGHT / 2 - MARKER_NON_CENTERED_CORRECTION_FACTOR) - MARKER_CONTAINER_HEIGHT / 2 - MARKER_NON_CENTERED_CORRECTION_FACTOR;

    const feetElevationPerPixel = (elevationLimits / ((1.0 - 2 * OUTER_BOX_RATIO) / 2.0)) / height;
    const altitudeRangeOuterBoxes = ((2 * elevationLimits) / (1.0 - 2 * OUTER_BOX_RATIO)) * OUTER_BOX_RATIO;

    /**
     * Upper elevation limit. Any elevation above will fix marker to the top most position.
     */
    const upperElevation = targetElevation + elevationLimits + altitudeRangeOuterBoxes;

    /**
     * Lower elevation limit. Any elevation below will fix marker to the lowest position.
     */
    const lowerElevation = targetElevation - elevationLimits - altitudeRangeOuterBoxes;

    const deviation = actualElevation - targetElevation;
    var deviationDisplay = deviation + " ft";
    if (deviation > 0) {
        deviationDisplay = "+" + deviation + " ft";
    }

    /**
     * The position of the moving marker indicating current elevation deviation
     */
    var offset = (height / 2.0) - (deviation / feetElevationPerPixel);

    if (actualElevation < lowerElevation) {
        offset = height;
    } else if (actualElevation > upperElevation) {
        offset = 0;
    }

    const performanceMarkerOffsetCorrected = offset - MARKER_CONTAINER_HEIGHT / 2 - MARKER_NON_CENTERED_CORRECTION_FACTOR;

    return (
        <View style={{ flexDirection: "row", width: componentWidth, height: componentHeight }}>

            <Text style={{
                marginTop: performanceMarkerOffsetCorrected, height: MARKER_CONTAINER_HEIGHT,
                top: MARKER_CONTAINER_HEIGHT / 2 + MARKER_NON_CENTERED_CORRECTION_FACTOR,
                width: MARKER_LABEL_WIDTH - DISTANCE_MARKERS_TO_BAR, textAlign: "right"
            }}>{
                    deviationDisplay} —
            </Text>

            <View style={{ position: "absolute", left: MARKER_LABEL_WIDTH, top: MARKER_CONTAINER_HEIGHT / 2 + MARKER_NON_CENTERED_CORRECTION_FACTOR }}>
                <View style={{ flexDirection: "column", position: "absolute" }}>
                    <View style={{ width: barWidth, height: outerHeight, backgroundColor: "red" }} />
                    <View style={{ width: barWidth, height: innerHeight, backgroundColor: "green" }} />
                    <View style={{ width: barWidth, height: outerHeight, backgroundColor: "red" }} />
                </View>
                <View style={{ flexDirection: "column", position: "absolute", left: barWidth + DISTANCE_MARKERS_TO_BAR }}>
                    <Text style={{ marginTop: upperPosition, height: MARKER_CONTAINER_HEIGHT }}>— +{elevationLimits}ft</Text>
                    <Text style={{ marginTop: lowerPosition, height: MARKER_CONTAINER_HEIGHT }}>— -{elevationLimits} ft</Text>
                </View>
            </View>
        </View>
    );
}