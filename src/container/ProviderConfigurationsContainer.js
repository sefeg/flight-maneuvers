import { connect } from "react-redux";
import ProviderConfiguration from "../components/ProviderConfigurations";

function mapStateToProps(state, ownProps) {
    return {
        configuration: { "automated_search": false, "iP_address": "192.168.1.26", "port": 49000, "provider": "X-Plane" },
    };
}

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderConfiguration);
