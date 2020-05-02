/**
 * Indicates which requirements of the currently seclected maneuver
 * are currently met.
 */

import { createSelector } from 'reselect';
import maneuverTypes from "../atoms/ManeuverTypes";

const getSelectedManeuver = state => state.maneuver.maneuverSelected;
const getFlightData = state => state.flightData;

export const getManeuverRequierements = createSelector(
    [getSelectedManeuver, getFlightData],
    (selectedManeuver, flightData) => {

        if (selectedManeuver === maneuverTypes.STEEP_TURNS) {

            return calculateSteepTurnRequirements(flightData.elevAGL, flightData.indicatedAirspeed, flightData.engineRPM);

        } else {
            return {
                "allRequirementsFulfilled": false,
            }
        }
    }
)

function calculateSteepTurnRequirements(elevAGL, indicatedAirspeed, engineRPM) {

    const elevAGLRequirement = elevAGL > 2500;
    const speedRequirement = 90 <= indicatedAirspeed && indicatedAirspeed <= 100;
    const rpmRequirement = 2185 <= engineRPM && engineRPM <= 2415;

    return {
        "allRequirementsFulfilled": elevAGLRequirement && speedRequirement && rpmRequirement,
        "individualRequirements": [
            {
                "description": "Altitude >= 2.500 AGL",
                "fulfilled": elevAGLRequirement,
            },
            {
                "description": "KIAS: 95 knots (+/- 5%)",
                "fulfilled": speedRequirement,
            },
            {
                "description": "2300 RPM (+/- 5%)",
                "fulfilled": rpmRequirement,
            }
        ]
    };
}