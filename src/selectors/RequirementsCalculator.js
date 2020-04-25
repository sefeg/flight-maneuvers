import { createSelector } from 'reselect';
import maneuverTypes from "../atoms/ManeuverTypes";

const getSelectedManeuver = state => state.maneuver.maneuverSelected;
const getFlightData = state => state.flightData;

export const getManeuverRequierements = createSelector(
    [getSelectedManeuver, getFlightData],
    (selectedManeuver, flightData) => {

        if (selectedManeuver === maneuverTypes.STEEP_TURNS) {

            const elevAGLRequirement = flightData.elevAGL > 2500;
            const speedRequirement = 90 <= flightData.indicatedAirspeed && flightData.indicatedAirspeed <= 100;
            const rpmRequirement = 2185 <= flightData.engineRPM && flightData.engineRPM <= 2415;

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
        } else {
            return {
                "allRequirementsFulfilled": false,
            }
        }
    }
)