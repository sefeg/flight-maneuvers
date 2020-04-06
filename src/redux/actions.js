/**
 * Defines actions and action creators
 */

import maneuvers from '../atoms/ManeuverTypes';

/*
 * Action types
 */
export const SET_SELECTED_MANEUVER = 'SET_SELECTED_MANEUVER';
export const SET_MANEUVER_TERMINATED = 'SET_MANEUVER_TERMINATED';

export const SIGNAL_RPOS_DATA_RECEIVED = 'SIGNAL_RPOS_DATA_RECEIVED';

export const COMPLETED_MANEUVER_PERFORMANCE = 'COMPLETED_MANEUVER_PERFORMANCE';

export const maneuverSelectionStatus = {
    NONE_SELECTED: 'NONE_SELECTED',
};

/*
 * Action creators
 */

export function setSelectedManeuever(maneuver) {
    return { type: SET_SELECTED_MANEUVER, maneuver };
}

export function setManeuverTerminated() {
    return { type: SET_MANEUVER_TERMINATED };
}

export function signalRPOSDataReceived(heading, elevASL, elevAGL, roll) {
    return { type: SIGNAL_RPOS_DATA_RECEIVED, heading, elevASL, elevAGL, roll };
}

export function completedManeuverPerformance(accuracy, maneuver) {
    return { type: COMPLETED_MANEUVER_PERFORMANCE, accuracy, maneuver };
}