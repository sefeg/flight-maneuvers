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
