import React from "react";
import { connect } from "react-redux";
import RequirementsView from "../components/RequirementsView";

import maneuverSelectionStatus from "../actions/actions";
import maneuvers from "../atoms/ManeuverTypes";

function getRequirementsSteepTurns(flightData) {

    const elevAGLRequirement = flightData.elevAGL > 2500;
    const speedRequirement = 90 <= flightData.indicatedAirspeed && flightData.indicatedAirspeed <= 100;
    const rpmRequirement = 2185 <= flightData.engineRPM && flightData.engineRPM <= 2415;


    return [
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
    ];
}

function getRequirementsPowerONStalls(state) {

    return [];
}

function getRequirementsItems(state) {

    switch (state.maneuverSelection) {
        case maneuvers.STEEP_TURNS:
            return getRequirementsSteepTurns(state.flightData);
        case maneuvers.POWER_ON_STALLS:
            return getRequirementsPowerONStalls();
        default:
            return [];
    }
}

function mapStateToProps(state) {
    return {
        conditions: getRequirementsItems(state),
    };
}
function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsView);