import React from "react";
import { connect } from "react-redux";
import RequirementsView from "../components/RequirementsView";

import maneuverSelectionStatus from "../actions/actions";
import maneuvers from "../atoms/ManeuverTypes";
import { signalManeuverRequirementsMet } from "../actions/actions";

import { getManeuverRequierements } from "../selectors/RequirementsCalculator";


function mapStateToProps(state) {
    return getManeuverRequierements(state);
}
const mapDispatchToProps = dispatch => {
    return {
        metRequirements: () => dispatch(signalManeuverRequirementsMet()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsView);