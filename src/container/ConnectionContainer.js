import { connect } from "react-redux";
import ConnectionStatus from "../components/ConnectionStatus";
import { connectionStatus } from "../actions/actions";


function mapStateToProps(state, ownProps) {
    return {
        dataProvider: state.dataProvider.dataProvider,
        connected: state.dataProvider.connectionStatus === connectionStatus.CONNECTED,
    };
}

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
