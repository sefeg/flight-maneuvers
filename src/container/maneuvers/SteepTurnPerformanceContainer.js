import { connect } from "react-redux";
import SteepTurnDisplay from "../../components/maneuvers/SteepTurnsDisplay"
import { getSteepTurnPerformance } from "../../selectors/maneuver_selectors/SteepTurnObserver";

function mapStateToProps(state) {

    return {
        targetAirspeed: Math.floor(state.maneuver.entrySettings.indicatedAirspeed),
        targetElevation: Math.floor(state.maneuver.entrySettings.elevASL),
        rollInOutHeading: Math.floor(state.maneuver.entrySettings.heading),
        headingProgress: Math.floor(getSteepTurnPerformance(state).maneuverProgress),
        actualAirspeed: Math.floor(state.flightData.indicatedAirspeed),
        actualElevation: Math.floor(state.flightData.elevASL),
        currentBank: Math.floor(state.flightData.roll),
        meanAltitude: Math.floor(getSteepTurnPerformance(state).performance.meanAltitude),
    };
}
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SteepTurnDisplay);