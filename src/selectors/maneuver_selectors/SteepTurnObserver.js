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

var maneuverSuccess = false;
var maneuverEntrySetting;
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

            const currentElevASL = flightData.elevASL;
            const currentAirspeed = flightData.indicatedAirspeed;
            const currentBank = flightData.roll;
            const currentHeading = flightData.heading;

            if (!performanceDataInitialized) {
                initializeRecording(currentElevASL, currentAirspeed, currentBank);
                performanceDataInitialized = true;
            }

            updatePerformanceRecord([currentElevASL, currentAirspeed, currentBank]);

            if (Math.abs(currentHeading - performanceRecord.lastHeading) > 1.0) { //check for significant change in heading

                const zeroCrossingIsAcceptable = performanceRecord.crossedZeroHeadingCounter == 0
                    || (entrySettings.heading > 360 - HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 1);

                /**
                 * Check if direction of roll stays conistent
                 */
                var rollingInTheCorrectDirection = currentHeading >= performanceRecord.lastHeading;

                if (!rollingInTheCorrectDirection) {

                    /**
                     * Compensate in case the 0° heading has been crossed
                     */
                    if (currentHeading < 15 && performanceRecord.lastHeading > 345) {

                        performanceRecord.crossedZeroHeadingCounter++;
                        rollingInTheCorrectDirection = zeroCrossingIsAcceptable;
                    }

                    /**
                     * Check if opposite direction is a result of a fast roll-out attempt WITHIN the roll-out heading range
                     */
                    if (calculateRealDistanceBetweenTwoHeadings(currentHeading, entrySettings.heading) <= HEADING_TOLERANCE) {
                        rollingInTheCorrectDirection = true;
                    }
                }

                /**
                 * Check for overshooting the turn
                 */
                var overshotRollOutHeading =
                    !zeroCrossingIsAcceptable
                    && currentHeading > getHeadingOnStandardScale(entrySettings.heading + HEADING_TOLERANCE);

                /**
                 * Check if the plane is within the roll-out tolerance range
                 * and, if so, if the plane has in fact rolled out
                 */
                var rolledOutWithinRollOutRange =
                    Math.abs(currentBank) <= MAXIMUM_ROLLOUT_BANK
                    && calculateRealDistanceBetweenTwoHeadings(currentHeading, entrySettings.heading) <= HEADING_TOLERANCE
                    && (
                        !zeroCrossingIsAcceptable
                        || (currentHeading <= 360
                            && (entrySettings.heading > 360 - HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 1)
                            || (entrySettings.heading < HEADING_TOLERANCE && performanceRecord.crossedZeroHeadingCounter == 0)
                        )
                    );

                if (rolledOutWithinRollOutRange) {
                    performanceRecord.rollOutHeading = currentHeading;
                }

                /**
                 * Calculate progress based on heading
                 */

                const distanceTravelledFromEntry = calculateHeadingDistanceFromStartingPoint(entrySettings.heading, currentHeading);

                if (distanceTravelledFromEntry < HEADING_TOLERANCE
                    && (!zeroCrossingIsAcceptable
                        || (entrySettings.heading <= 360 && performanceRecord.crossedZeroHeadingCounter == 1))) {
                    /**
                     * The plane overshot the roll out heading, but this is acceptable until the upper
                     * tolerance is reached, at which point the maneuver is terminated.
                     */
                    performanceRecord.progressInPercent = 100.0;
                } else {
                    performanceRecord.progressInPercent = (distanceTravelledFromEntry / 360.0) * 100;
                }

                terminateManeuver = !rollingInTheCorrectDirection || overshotRollOutHeading || rolledOutWithinRollOutRange;

                performanceRecord.lastHeading = currentHeading;
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
