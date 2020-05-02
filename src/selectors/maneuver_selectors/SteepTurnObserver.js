/**
 * Monitors the entire performance of the steep turns maneuver. Evaluates and returns an
 * analysis of all criteria (heading, airspeed, altitude, and bank angle). Considers the 
 * maneuver successful if the plane rolls out around the start heading and all criteria
 * are met. The steep turn maneuver ends if the plane overshoots the start heading, rolls out
 * at the start heading, or changes turn direction.
 */

import { createSelector } from 'reselect';
import criteria from "../../atoms/criteria/SteepTurnCriteria";

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


/**
 * Designated to store information on the performance regarding altitude, speed, and bank.
 */
var performanceRecord;

/**
 * Holds all data for communicating maneuver analysis to the user
 */
var maneuverAnalysisData = {};

/**
 * Indicates whether or not the plane can still cross the 0° (N) heading once more
 */
var zeroCrossingIsAcceptable = true;

var maneuverSuccess = false;

/**
 * The plane's setup (heading, speed, altitude) when entering the maneuver
 */
var maneuverEntrySetting;

/**
 * Holds the current (last received) flight data
 */
var currentFlightData;

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

        if (performanceRecord == undefined) {
            initializeRecording(0, 0, 0);
        }

        var terminateManeuver = false;

        if (maneuverRecording) {

            maneuverEntrySetting = entrySettings;
            currentFlightData = flightData;

            if (!performanceDataInitialized) {
                initializeRecording(flightData.elevASL, flightData.indicatedAirspeed, flightData.roll);
                performanceDataInitialized = true;
            }

            updatePerformanceRecord([flightData.elevASL, flightData.indicatedAirspeed, flightData.roll]);

            if (Math.abs(flightData.heading - performanceRecord.lastHeading) > 1.0) { //check for significant change in heading

                zeroCrossingIsAcceptable = isZeroCrossingAcceptable();

                const rollingInTheCorrectDirection = isPlaneRollingInCorrectDirection();

                const overshotRollOutHeading = checkIfPlaneOvershootRollout();

                var rolledOutWithinRollOutRange = didRollOutCorrectly();

                if (rolledOutWithinRollOutRange) {
                    performanceRecord.rollOutHeading = flightData.heading;
                }

                determineManeuverProgress();

                terminateManeuver = !rollingInTheCorrectDirection || overshotRollOutHeading || rolledOutWithinRollOutRange;

                performanceRecord.lastHeading = flightData.heading;
            }

        } else {
            performanceDataInitialized = false;
        }

        if (maneuverRecording) {
            maneuverAnalysisData = assemblePerformanceOverview();
            maneuverSuccess = rolledOutWithinRollOutRange
                && maneuverAnalysisData.altitude.meanWithinRange
                && maneuverAnalysisData.airspeed.meanWithinRange
                && maneuverAnalysisData.bank.meanWithinRange;
        }

        if (maneuverSuccess == undefined) {
            maneuverSuccess = false;
        }

        return {
            "terminateManeuver": terminateManeuver,
            "maneuverProgress": performanceRecord.progressInPercent,
            "maneuverSuccess": maneuverSuccess,
            "performance": maneuverAnalysisData,
        }
    }
)

/**
* Calculates progress (in percent) based on the current heading and the roll-out heading
*/

function determineManeuverProgress() {

    const distanceTravelledFromEntry = calculateHeadingDistanceFromStartingPoint(maneuverEntrySetting.heading, currentFlightData.heading);

    if (distanceTravelledFromEntry < HEADING_TOLERANCE
        && (!zeroCrossingIsAcceptable
            || (maneuverEntrySetting.heading <= 360 && performanceRecord.crossedZeroHeadingCounter == 1))) {

        /**
         * The plane overshot the roll out heading, but this is acceptable until the upper
         * tolerance is reached, at which point the maneuver is terminated.
         */
        performanceRecord.progressInPercent = 100.0;
    } else {
        performanceRecord.progressInPercent = (distanceTravelledFromEntry / 360.0) * 100;
    }
}

/**
 * @return true if the plane is within the roll-out tolerance range
 * and has in fact rolled out (i.e. bank <= HEADING_TOLERANCE)
 */
function didRollOutCorrectly() {

    return Math.abs(currentFlightData.roll) <= MAXIMUM_ROLLOUT_BANK
        && calculateRealDistanceBetweenTwoHeadings(currentFlightData.heading, maneuverEntrySetting.heading) <= HEADING_TOLERANCE
        && (
            !zeroCrossingIsAcceptable
            || (currentFlightData.heading <= 360
                && (maneuverEntrySetting.heading > 360 - HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 1)
                || (maneuverEntrySetting.heading < HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 0)
            )
        );
}

/**
 * @return true if the plane is still turning after the rollout heading (plus tolearnce)
 */
function checkIfPlaneOvershootRollout() {

    return !zeroCrossingIsAcceptable
        && currentFlightData.heading > getHeadingOnStandardScale(maneuverEntrySetting.heading + HEADING_TOLERANCE);
}

/**
 * Checks if the direction of the plane's turn is correct. The plane cannot turn to one side while
 * being in a steep turn maneuver to the other side. The only exception is when the plane is rolling out. In this case a
 * short overturn correction is permitted.
 */
function isPlaneRollingInCorrectDirection() {

    var rollingInTheCorrectDirection = currentFlightData.heading >= performanceRecord.lastHeading;

    if (!rollingInTheCorrectDirection) {

        /**
         * Compensate in case the 0° heading has been crossed
         */
        if (currentFlightData.heading < 15 && performanceRecord.lastHeading > 345) {

            performanceRecord.crossedZeroHeadingCounter++;
            rollingInTheCorrectDirection = zeroCrossingIsAcceptable;
        }

        /**
         * Check if opposite direction is a result of a fast roll-out attempt WITHIN the roll-out heading range
         */
        if (calculateRealDistanceBetweenTwoHeadings(currentFlightData.heading, maneuverEntrySetting.heading) <= HEADING_TOLERANCE) {
            rollingInTheCorrectDirection = true;
        }
    }

    return rollingInTheCorrectDirection;
}

/**
 * @return true in case the plane can still cross the 0° (N) heading once more. This is always the case
 * if the plane did not cross the heading yet or if it only crossed once in case the roll-out heading is
 * in close proximity to the 0° heading.
 */
function isZeroCrossingAcceptable() {

    return performanceRecord.crossedZeroHeadingCounter == 0
        || (maneuverEntrySetting.heading > 360 - HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 1);
}

/**
 * Constructs an array with key information regarding airspeed, altitude, and bank performance during the maneuver
 */
function assemblePerformanceOverview() {

    var meanAltitude = 0;
    var meanAirspeed = 0;
    var meanBank = 0;

    if (performanceRecord.altitude.countRecordings > 0) {
        meanAltitude = Math.floor(performanceRecord.altitude.sum / performanceRecord.altitude.countRecordings);
    }

    if (performanceRecord.airspeed.countRecordings > 0) {
        meanAirspeed = Math.floor(performanceRecord.airspeed.sum / performanceRecord.airspeed.countRecordings);
    }

    if (performanceRecord.bank.countRecordings > 0) {
        meanBank = Math.floor(performanceRecord.bank.sum / performanceRecord.bank.countRecordings);
    }

    return {
        "altitude": {
            "mean": meanAltitude,
            "meanWithinRange": Math.abs(meanAltitude - maneuverEntrySetting.elevASL) <= criteria.ALTITUDE_DEVIATION_ALLOWED,
            "upper": performanceRecord.altitude.limits.upper,
            "lower": performanceRecord.altitude.limits.lower,
        },
        "airspeed": {
            "mean": meanAirspeed,
            "meanWithinRange": Math.abs(meanAirspeed - maneuverEntrySetting.indicatedAirspeed) <= criteria.AIRSPEED_DEVIATION_ALLOWED,
            "upper": performanceRecord.airspeed.limits.upper,
            "lower": performanceRecord.airspeed.limits.lower,
        },
        "bank": {
            "mean": meanBank,
            "meanWithinRange": Math.abs(meanBank - criteria.MANEUVER_BANK_ANGLE) <= criteria.BANK_DEVIATION_ALLOWED,
            "upper": performanceRecord.bank.limits.upper,
            "lower": performanceRecord.bank.limits.lower,
        },
        "rollOutHeading": performanceRecord.rollOutHeading,
        "rollOutWithinRange": Math.abs(calculateRealDistanceBetweenTwoHeadings(performanceRecord.rollOutHeading, maneuverEntrySetting.heading)) <= criteria.ROLL_OUT_DEVIATION_ALLOWED,
    }
}

/**
 * 
 * Initializes all variables that indicate maneuver performance regarding altitude, airspeed, and bank.
 * Values for those need to be tracked separetly as we cannot rely on the data provider to update / send
 * them at the same frequency.
 */

function initializeRecording(initialElevASL, initialAirspeed, initialBank) {

    performanceRecord = {
        "altitude": {
            sum: initialElevASL,
            countRecordings: 1,
            lastRecorded: initialElevASL,
            limits: {
                lower: initialElevASL,
                upper: initialElevASL,
            }
        },
        "airspeed": {
            sum: initialAirspeed,
            countRecordings: 1,
            lastRecorded: initialAirspeed,
            limits: {
                lower: initialAirspeed,
                upper: initialAirspeed,
            }
        },
        "bank": {
            sum: initialBank,
            countRecordings: 1,
            lastRecorded: initialBank,
            limits: {
                lower: initialBank,
                upper: initialBank,
            }
        },
        rollOutHeading: undefined,
        crossedZeroHeadingCounter: 0,
        lastHeading: 0,
        progressInPercent: 0,
    }
}

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

/**
 * Updates the performance record regarding elevation, airspeed, and bank, based on the current flight data.
 * @param {Array} currentFlightData expects an array with three values: [0] elevation, [1] airspeed, [2] bank
 */
function updatePerformanceRecord(currentFlightData) {

    const performanceRecordKeys = ["altitude", "airspeed", "bank"];

    var counter = 0;
    for (; counter <= 2; counter++) {

        const performanceRecordEntry = performanceRecord[performanceRecordKeys[counter]];
        const value = currentFlightData[counter];

        if (value != performanceRecordEntry.lastRecorded) {

            performanceRecordEntry.sum += value;
            performanceRecordEntry.countRecordings++;
            performanceRecordEntry.lastRecorded = value;

            if (value > performanceRecordEntry.limits.upper) {
                performanceRecordEntry.limits.upper = value;
            } else if (value < performanceRecordEntry.limits.lower) {
                performanceRecordEntry.limits.lower = value;
            }
        }
    }
}
