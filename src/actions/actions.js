/*
 * Action types
 */

/**
 * The user selected a maneuver for training in the briefing room
 */
export const SET_SELECTED_MANEUVER = 'SET_SELECTED_MANEUVER';

/**
 * The user went back to the briefing room after selecting a specific maneuver
 */
export const RESET_CURRENT_MANEUVER = 'RESET_CURRENT_MANEUVER';

/**
 * The users wants to exercise the current maneuver again after having completed it
 */
export const RESTART_CURRENT_MANEUVER = 'RESTART_CURRENT_MANEUVER';

/**
 * X-Plane sent a dataframe with RPOS data (heading, elevation, roll)
 */
export const SIGNAL_RPOS_DATA_RECEIVED = 'SIGNAL_RPOS_DATA_RECEIVED';

/**
 * X-Plane sent a dataframe with RREF data (e.g. engine rpm, airspeed)
 */
export const SIGNAL_DATAREF_RECEIVED = 'SIGNAL_DATAREF_RECEIVED';

/**
 * The user selected a data provider (e.g. X-Plane)
 */
export const SET_DATA_PROVIDER = 'SET_DATA_PROVIDER';

/**
 * The connection to the current data provider (e.g. X-Plane) has changed
 */
export const CONNECTION_STATUS_CHANGED = 'CONNECTION_STATUS_CHANGED';

/**
 * The user started the current maneuver
 */
export const START_MANEUVER = 'START_MANEUVER';

/**
 * The maneuver has been stoped
 */
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