import { combineReducers } from 'redux';
import {
    SET_SELECTED_MANEUVER,
    SET_MANEUVER_TERMINATED,
    SIGNAL_RPOS_DATA_RECEIVED,
    COMPLETED_MANEUVER_PERFORMANCE,
    SET_DATA_PROVIDER,
    CONNECTION_STATUS_CHANGED,
    connectionStatus,
    maneuverSelectionStatus,
} from '../actions/actions';
import maneuvers from '../atoms/ManeuverTypes';
import dataProviders from '../atoms/DataProviders';
import ConnectionStatus from '../components/ConnectionStatus';

function maneuverSelection(state = maneuverSelectionStatus.NONE_SELECTED, action) {

    switch (action.type) {
        case SET_SELECTED_MANEUVER:
            return action.maneuver;
        case SET_MANEUVER_TERMINATED:
            return maneuverSelectionStatus.NONE_SELECTED;
        default:
            return state;
    }
}

function dataProvider(state = {
    dataProvider: dataProviders.XPLANE, connectionStatus: connectionStatus.NOT_CONNECTED,
    configurations: { provider: dataProviders.XPLANE, automatedSearch: false, ipAddress: "192.168.1.26", port: 49000 },
},
    action) {

    switch (action.type) {
        case SET_DATA_PROVIDER:

            if (state.dataProvider === action.dataProvider) {
                return state;
            } else {
                return Object.assign({}, dataProvider, {
                    dataProvider: action.dataProvider,
                    connectionStatus: connectionStatus.NOT_CONNECTED,
                });
            }
        case CONNECTION_STATUS_CHANGED:

            return Object.assign({}, dataProvider, {
                dataProvider: state.dataProvider,
                connectionStatus: action.connectionStatus,
            });
        default:
            return state;
    }
}



function flightData(
    state = { heading: 0, elevASL: 0, elevAGL: 0, roll: 0 },
    action,
) {

    switch (action.type) {
        case SIGNAL_RPOS_DATA_RECEIVED:

            return Object.assign({}, flightData, {
                heading: action.heading,
                elevASL: action.elevASL,
                elevAGL: action.elevAGL,
                roll: action.roll,
            });
        default:
            return state;
    }
}

function userPerformances(state, action) {

    if (typeof state === 'undefined') {

        var newState = [];

        for (let [key, value] of Object.entries(maneuvers)) {

            newState = [
                ...newState,
                {
                    maneuver: value,
                    accuracy: 0,
                    frequency: 0,
                    overallTrainingStatus: 0,
                }
            ]
        }
        return newState;
    } else {

        /**
         * @todo calculate new total accuracy and overall training status
         */
        switch (action.type) {
            case COMPLETED_MANEUVER_PERFORMANCE:
                return state.map((maneuverPerformance, index) => {
                    if (maneuverPerformance.maneuver === action.maneuver) {
                        return Object.assign({}, maneuverPerformance, {
                            frequency: maneuverPerformance.frequency + 1,
                        })
                    }
                    return maneuverPerformance
                })
            default:
                return state;
        }
    }
}

const maneuversAppReducer = combineReducers({
    maneuverSelection,
    flightData,
    userPerformances,
    dataProvider,
});

export default maneuversAppReducer;