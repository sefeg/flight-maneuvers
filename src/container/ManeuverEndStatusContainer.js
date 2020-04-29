import { connect } from "react-redux";
import ManeuverEndStatus from "../components/ManeuverEndStatus";
import { restartCurrentManeuver } from "../actions/actions";


function mapStateToProps(state, ownProps) {
    return {
        maneuverSuccess: state.maneuver.maneuverOutcome.outcomeSuccessful,
    };
}

const mapDispatchToProps = dispatch => ({
    restartManeuver: () => dispatch(restartCurrentManeuver()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManeuverEndStatus);
