/**
 * A high level observer of the status of the current maneuver. Directs responsibility to
 * judge maneuver performance and termination to the individual and applicable maneuver
 * observer that depends on the type of maneuver. Returns three major information: whether
 * or not the user fullfilled the criteria to start the maneuver, whether or not the maneuver
 * has been completed, and the maneuver performance data (live and retrospective).
 */

import { createSelector } from 'reselect';
import { getManeuverRequierements } from "./RequirementsCalculator";
import { getSteepTurnPerformance } from "./maneuver_selectors/SteepTurnObserver";

import maneuverTypes from "../atoms/ManeuverTypes";

const getSelectedManeuver = state => state.maneuver.maneuverSelected;
const getFlightData = state => state.flightData;
const getManeuverRecording = state => state.maneuver.maneuverRecording;
const getManeuverEnded = state => state.maneuver.maneuverEnded;

export const getManeuverStatus = createSelector(
    [getSelectedManeuver, getFlightData, getManeuverRequierements, getManeuverRecording, getManeuverEnded, getSteepTurnPerformance],
    (selectedManeuver, flightData, maneueverRequirements, maneuverRecording, maneuverEnded, steepTurnPerformance) => {

        switch (selectedManeuver) {
            case maneuverTypes.STEEP_TURNS:

                return {
                    "userFulfilledEngagementCriteria": !maneuverEnded && !maneuverRecording && maneueverRequirements.allRequirementsFulfilled && (flightData.roll <= -45 || flightData.roll >= 45),
                    "maneuverStopCriteriaReached": !maneuverEnded && maneuverRecording && steepTurnPerformance.terminateManeuver,
                    "maneuverPerformance": steepTurnPerformance,
                }
        }
    }
)
