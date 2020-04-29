import { createSelector } from 'reselect';
import { FlingGestureHandler } from 'react-native-gesture-handler';

const getFlightData = state => state.flightData;
const getManeuverRecording = state => state.maneuver.maneuverRecording;
const getEntrySettings = state => state.maneuver.entrySettings;

/**
 * Heading tolerance for rolling out from the steep turn maneuver (+/-)
 */
const HEADING_TOLERANCE = 10;

/**
 * Maximum bank angle that is acceptable as 'roll-out'
 */
const MAXIMUM_ROLLOUT_BANK = 10;

var crossedZeroHeadingCounter = 0;
var lastHeading = 0;
var progressInPercent = 0;

var altitudeSum = 0;
var countAltitudeRecordings = 0;
var lastAltitudeRecorded = 0;
var upperAltitude = 0;
var lowerAltitude = 0;

var performanceDataInitialized = false;

/**
 * Keeps track of the steep turn performance and the rules of the maneuver. Signals terminateManeuver
 * in case the plane overshoots the roll in/out heading and tolerance, changes direction of turn, or
 * successfully rolls out at the in/out heading (+/- tolerance). Signals outcome through maneuverSuccess.
 * 
 * @returns the above described turn status information and performance data, including the maneuverProgress
 * in percent.
 */
export const getSteepTurnPerformance = createSelector(
    [getFlightData, getManeuverRecording, getEntrySettings],
    (flightData, maneuverRecording, entrySettings) => {

        var terminateManeuver = false;

        if (maneuverRecording) {

            if (!performanceDataInitialized) {

                crossedZeroHeadingCounter = 0;
                lastHeading = 0;
                progressInPercent = 0;

                /**
                 * Altitude init
                 */
                altitudeSum = 0;
                countAltitudeRecordings = 0;
                lastAltitudeRecorded = 0;
                upperAltitude = entrySettings.elevASL;
                lowerAltitude = entrySettings.elevASL;


                performanceDataInitialized = true;
            }

            if (flightData.elevASL !== lastAltitudeRecorded) {

                altitudeSum += flightData.elevASL;
                countAltitudeRecordings++;

                lastAltitudeRecorded = flightData.elevASL;

                if (flightData.elevASL > upperAltitude) {
                    upperAltitude = flightData.elevASL;
                } else if (flightData.elevASL < lowerAltitude) {
                    lowerAltitude = flightData.elevASL;
                }
            }

            if (Math.abs(flightData.heading - lastHeading) > 1.0) { //check for significant change in heading

                const crossedZeroRequirementPassed =
                    (entrySettings.heading > 360 - HEADING_TOLERANCE && crossedZeroHeadingCounter == 2)
                    || (entrySettings.heading <= 360 - HEADING_TOLERANCE && crossedZeroHeadingCounter == 1);

                /**
                 * Check if direction of roll stays conistent
                 */
                var rollingInTheCorrectDirection = flightData.heading >= lastHeading;

                if (!rollingInTheCorrectDirection) {

                    /**
                     * Compensate in case the 0° heading has been crossed
                     */
                    if (flightData.heading < 15 && lastHeading > 345 && crossedZeroHeadingCounter === 0) {
                        crossedZeroHeadingCounter++;
                        rollingInTheCorrectDirection = true;
                    }

                    /**
                     * Check if opposite direction is a result of a fast roll-out attempt WITHIN the roll-out heading range
                     */
                    if (calculateRealDistanceBetweenTwoHeadings(flightData.heading, entrySettings.heading) <= HEADING_TOLERANCE) {
                        rollingInTheCorrectDirection = true;
                    }
                }

                /**
                 * Check for overshooting the turn
                 */
                var overshotRollOutHeading =
                    crossedZeroRequirementPassed
                    && flightData.heading > getHeadingOnStandardScale(entrySettings.heading + HEADING_TOLERANCE);


                /**
                 * Check if the plane is within the roll-out tolerance range
                 * and, if so, if the plane has in fact rolled out
                 */
                var rolledOutWithinRollOutRange =
                    calculateRealDistanceBetweenTwoHeadings(flightData.heading, entrySettings.heading) <= HEADING_TOLERANCE
                    && crossedZeroRequirementPassed
                    && Math.abs(flightData.roll) <= MAXIMUM_ROLLOUT_BANK;

                /**
                 * Calculate progress based on heading
                 */

                progressInPercent = (calculateHeadingDistanceFromStartingPoint(entrySettings.heading, flightData.heading) / 360.0) * 100;

                terminateManeuver = !rollingInTheCorrectDirection || overshotRollOutHeading || rolledOutWithinRollOutRange;

                lastHeading = flightData.heading;
            }
        } else {
            performanceDataInitialized = false;
        }

        return {
            "terminateManeuver": terminateManeuver,
            "maneuverProgress": progressInPercent,
            "maneuverSuccess": rolledOutWithinRollOutRange,
            "performance": {
                "meanAltitude": altitudeSum / countAltitudeRecordings,
                "upperAltitude": upperAltitude,
                "lowerAltitude": lowerAltitude,
            }
        }
    }
)

/**
 * Handles calculated headings in a range from  -360° to +720° and returns a corresponding
 * heading >= 0° and < 360°
 * @example heading 367° returns 7°
 * @param {*} heading in degrees, from >= -360 and <= +720
 */
function getHeadingOnStandardScale(heading) {

    if (heading >= 360) {
        return heading - 360;
    } else if (heading < 0) {
        return heading + 360;
    } else {
        return heading;
    }
}

/**
 * Calculates the real distance between two headings, compensating for N (0°) cross-overs
 * @example distance between 10° and 30° = 20°; distance between 350° and 10° = 20°
 * @param {*} heading1 in degrees
 * @param {*} heading2 in degrees
 */
function calculateRealDistanceBetweenTwoHeadings(heading1, heading2) {

    var distance = Math.abs(heading1 - heading2);

    if (distance > 180) {
        distance = 360 - distance;
    }

    return distance;
}

/**
 * Calculates the heading distance from the currentHeading to the entryHeading in degrees, 
 * compensating for N (0°) cross-overs
 * @example distance between entryHeading: 10° and currentHeading: 350° = 340°
 * @param {*} entryHeading in degrees, represents the heading at which the turn was initiated
 * @param {*} currentHeading in degrees, the plane's current heading
 */
function calculateHeadingDistanceFromStartingPoint(entryHeading, currentHeading) {

    var distance = Math.abs(entryHeading - currentHeading);

    if (entryHeading > currentHeading) {
        distance = 360 - distance;
    }

    return distance;
}
