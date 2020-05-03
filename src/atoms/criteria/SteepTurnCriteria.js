/**
 * Criteria for a successful steep turn maneuver
 */

export default {
    /**
     * The bank angle that should be maintained during the steep turn maneuver.
     */
    MANEUVER_BANK_ANGLE: 45,

    /**
     * Deviation (+/-) in bank angle that is allowd
     */
    BANK_DEVIATION_ALLOWED: 5,

    /**
     * Deviation allowed for the roll out (+/-) in degrees
     */
    ROLL_OUT_DEVIATION_ALLOWED: 10,

    /**
     * Deviation in altitude allowed (+/-) feet
     */
    ALTITUDE_DEVIATION_ALLOWED: 100,

    /**
     * Deviation in airspeed allowed (+/-) knots
     */
    AIRSPEED_DEVIATION_ALLOWED: 10,
};