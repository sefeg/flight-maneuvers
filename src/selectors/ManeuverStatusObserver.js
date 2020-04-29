import { createSelector } from 'reselect';
import { getManeuverRequierements } from "./RequirementsCalculator";
import { getSteepTurnPerformance } from "./maneuver_selectors/SteepTurnObserver";

import maneuverTypes from "../atoms/ManeuverTypes";

const getSelectedManeuver = state => state.maneuver.maneuverSelected;
const getFlightData = state => state.flightData;
const getManeuverRecording = state => state.maneuver.maneuverRecording;
const getEntrySettings = state => state.maneuver.entrySettings;
const getManeuverEnded = state => state.maneuver.maneuverEnded;

export const getManeuverStatus = createSelector(
    [getSelectedManeuver, getFlightData, getManeuverRequierements, getManeuverRecording, getEntrySettings, getManeuverEnded, getSteepTurnPerformance],
    (selectedManeuver, flightData, maneueverRequirements, maneuverRecording, entrySettings, maneuverEnded, steepTurnPerformance) => {

        switch (selectedManeuver) {
            case maneuverTypes.STEEP_TURNS:

                return {
                    "userFulfilledEngagementCriteria": !maneuverEnded && !maneuverRecording && (flightData.roll <= -45 || flightData.roll >= 45),
                    "maneuverStopCriteriaReached": !maneuverEnded && maneuverRecording && steepTurnPerformance.terminateManeuver,
                    "maneuverPerformance": steepTurnPerformance,
                }
        }
    }
)
