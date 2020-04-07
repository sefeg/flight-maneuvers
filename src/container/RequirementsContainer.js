import React from "react";
import { connect } from "react-redux";
import RequirementsView from "../components/RequirementsView";

import maneuverSelectionStatus from "../actions/actions";
import maneuvers from "../atoms/ManeuverTypes";

function getRequirementsSteepTurns(flightData) {

    const elevAGLRequirement = flightData.elevAGL > 2500;

    return [
        {
            "description": "Altitude >= 2.500 AGL",
            "fulfilled": elevAGLRequirement,
        },
        {
            "description": "KIAS: 95 knots (+/- 5%)",
            "fulfilled": false,
        },
        {
            "description": "2300 RPM (+/- 5%)",
            "fulfilled": false,
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