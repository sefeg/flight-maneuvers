import { combineReducers } from 'redux';
import {
    SET_SELECTED_MANEUVER,
    SET_MANEUVER_TERMINATED,
    SIGNAL_RPOS_DATA_RECEIVED,
    COMPLETED_MANEUVER_PERFORMANCE,
    maneuverSelectionStatus,
} from './actions';
import maneuvers from '../atoms/ManeuverTypes';

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

function flightData(state = { heading: 0, elevASL: 0, elevAGL: 0, roll: 0 }, action) {

    switch (action.type) {
        case SIGNAL_RPOS_DATA_RECEIVED:
            return Object.assign({}, flightData, {
                heading: heading,
                elevASL: elevASL,
                elevAGL: elevAGL,
                roll: roll,
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
});

export default maneuversAppReducer;