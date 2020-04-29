/**
 * Defines actions and action creators
 */

import maneuvers from '../atoms/ManeuverTypes';

/*
 * Action types
 */
export const SET_SELECTED_MANEUVER = 'SET_SELECTED_MANEUVER';
export const RESET_CURRENT_MANEUVER = 'RESET_CURRENT_MANEUVER';
export const RESTART_CURRENT_MANEUVER = 'RESTART_CURRENT_MANEUVER';

export const SIGNAL_RPOS_DATA_RECEIVED = 'SIGNAL_RPOS_DATA_RECEIVED';
export const SIGNAL_DATAREF_RECEIVED = 'SIGNAL_DATAREF_RECEIVED';

export const COMPLETED_MANEUVER_PERFORMANCE = 'COMPLETED_MANEUVER_PERFORMANCE';

export const SET_DATA_PROVIDER = 'SET_DATA_PROVIDER';
export const CONNECTION_STATUS_CHANGED = 'CONNECTION_STATUS_CHANGED';

export const START_MANEUVER = 'START_MANEUVER';
export const STOP_MANEUVER = 'STOP_MANEUVER';

export const maneuverSelectionStatus = {
    NONE_SELECTED: 'NONE_SELECTED',
};

export const connectionStatus = {
    NOT_CONNECTED: 'NOT_CONNECTED',
    CONNECTED: 'CONNECTED',
};

/*
 * Action creators
 */

export function setDataProvider(dataProvider) {
    return { type: SET_DATA_PROVIDER, dataProvider };
}

export function connectionStatusChanged(connectionStatus) {
    return { type: CONNECTION_STATUS_CHANGED, connectionStatus };
}

export function setSelectedManeuever(maneuver) {
    return { type: SET_SELECTED_MANEUVER, maneuver };
}

export function resetCurrentManeuever() {
    return { type: RESET_CURRENT_MANEUVER };
}

export function restartCurrentManeuver() {
    return { type: RESTART_CURRENT_MANEUVER };
}

export const startManeuver = () =>
    (dispatch, getState) => {
        const flightDataState = getState().flightData;
        dispatch({ type: START_MANEUVER, flightData: flightDataState });
    };

export function stopManeuver(outcomeSuccessful) {
    return { type: STOP_MANEUVER, outcomeSuccessful };
}

export function singalDataRefReceived(dataref, value) {
    return { type: SIGNAL_DATAREF_RECEIVED, dataref, value };
}

export function signalRPOSDataReceived(heading, elevASL, elevAGL, roll) {
    return { type: SIGNAL_RPOS_DATA_RECEIVED, heading, elevASL, elevAGL, roll };
}

export function completedManeuverPerformance(accuracy, maneuver) {
    return { type: COMPLETED_MANEUVER_PERFORMANCE, accuracy, maneuver };
}