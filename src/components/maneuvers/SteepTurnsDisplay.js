import React from "react";
import { View, Text, StyleSheet, YellowBox } from "react-native";
import PropTypes from "prop-types";

import AirspeedIndicator from "../performance_indicators/AirspeedIndicator";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ElevationIndicator from "../performance_indicators/ElevationIndicator";
import BankIndicator from "../performance_indicators/BankIndicator";
import HeadingIndicator from "../performance_indicators/HeadingIndicator";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { greaterThan } from "react-native-reanimated";

export default function SteepTurnDisplay({ maneuverEnded, targetAirspeed, targetElevation,
     rollInOutHeading, headingProgress, actualAirspeed, actualElevation, currentBank, maneuverAnalysisData}) {

    var displayAirspeed = actualAirspeed;
    var displayBank = currentBank;
    var displayAltitude = actualElevation;
    var meanAltitudeAnalysisText = "";
    var rollOutHeadingAnalysisText = "";
    var rolledOutWithinRange = false;

    if(maneuverEnded){
        displayAirspeed = maneuverAnalysisData.airspeed.mean;
        displayBank = maneuverAnalysisData.bank.mean;
        displayAltitude = maneuverAnalysisData.altitude.mean;

        var altitudeDifference = maneuverAnalysisData.altitude.mean - targetElevation;
        
        if(altitudeDifference >= 0){
            meanAltitudeAnalysisText = "Mean altitude: +" + altitudeDifference + " ft";
        } else {
            meanAltitudeAnalysisText = "Mean altitude: " + altitudeDifference + " ft";
        }

        if(maneuverAnalysisData.rollOutHeading == undefined){
            rollOutHeadingAnalysisText = "Not rolled out";
        }else{
            rollOutHeadingAnalysisText = "Actual heading: " + Math.floor(maneuverAnalysisData.rollOutHeading) + "°";
            rolledOutWithinRange = "Actual hdg.: " + maneuverAnalysisData.rollOutWithinRange + "°";
        }
    }
    
    return (
        < View style={styles.rootContainer} >

            {
                maneuverEnded ? (
                    <Text style={styles.centeredTitle}>Maneuver Analysis</Text>
                ) : (
                    <Text style={styles.title}>It's on! Turn performance recording...</Text>
                )
            }

            <View style={styles.performanceItemContainer}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 48 }}>
                        <HeadingIndicator
                            rollInOutHeading={rollInOutHeading}
                            progressInPercent={headingProgress}
                        />
                    </View>
                </View>
                <View style={styles.performanceItemDescription}>
                    <Text>Roll in/out heading: {rollInOutHeading}°</Text>
                    {maneuverEnded &&
                    <View style={styles.analysisLine}>
                        {
                        rolledOutWithinRange? (
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.analysisIconSuccess} size={15} />
                            ) : (
                                <FontAwesomeIcon icon={faTimesCircle} style={styles.analysisIconFail} size={15} />
                            )
                        }
                        <Text>{rollOutHeadingAnalysisText}</Text>
                    </View>
                    }
                </View>
            </View>


            <View style={styles.airspeedRoot}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 15 }}>
                        <AirspeedIndicator targetAirspeed={targetAirspeed} actualAirspeed={displayAirspeed} />
                    </View>
                </View>
                <View style={styles.performanceItemDescription}>
                    <Text>Keep airspeed: {targetAirspeed} kts</Text>
                    {maneuverEnded &&
                        <View style={styles.analysisLine}>
                        {
                            maneuverAnalysisData.airspeed.meanWithinRange ? (
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.analysisIconSuccess} size={15} />
                            ) : (
                                <FontAwesomeIcon icon={faTimesCircle} style={styles.analysisIconFail} size={15} />
                            )
                        }
                        <Text>Mean airspeed: {maneuverAnalysisData.airspeed.mean} kts</Text>
                        </View>
                    }
                </View>
            </View>

            <View style={styles.performanceItemContainer}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 48 }}>
                        <BankIndicator
                            currentBank={displayBank}
                            targetBank={45}
                        />
                    </View>
                </View>
                <View style={styles.bankDescriptor}>
                    <Text>Keep bank: 45°</Text>
                    {maneuverEnded &&
                    <View style={styles.analysisLine}>
                        {
                            maneuverAnalysisData.bank.meanWithinRange ? (
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.analysisIconSuccess} size={15} />
                            ) : (
                                <FontAwesomeIcon icon={faTimesCircle} style={styles.analysisIconFail} size={15} />
                            )
                        }
                        <Text>Mean bank {maneuverAnalysisData.bank.mean}°</Text>
                    </View>
                    }
                </View>
            </View>


            <View style={styles.elevationContainer}>
                <ElevationIndicator
                    targetElevation={targetElevation}
                    actualElevation={displayAltitude}
                    elevationLimits={100}
                />
                <View style={styles.performanceItemDescription}>
                    <Text>Keep altitude: {targetElevation} ft</Text>
                    {maneuverEnded &&
                    <View style={styles.analysisLine}>
                        {
                            maneuverAnalysisData.altitude.meanWithinRange ? (
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.analysisIconSuccess} size={15} />
                            ) : (
                                <FontAwesomeIcon icon={faTimesCircle} style={styles.analysisIconFail} size={15} />
                            )
                        }
                        <Text>{meanAltitudeAnalysisText}</Text>
                    </View>
                    }
                </View>
            </View>

        </ View >
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    centeredTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center",
    },
    rootContainer: {
        marginTop: 20,
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        padding: 20,
        borderRadius: 5,
    },
    performanceItemContainer: {
        alignItems: "center",
        flexDirection: "row",
        marginTop: 7,
        marginBottom: 7,
    },
    airspeedRoot: {
        alignItems: "center",
        flexDirection: "row",
    },
    indicatorParentContainer: {
        width: 158,
        justifyContent: "center"
    },
    headerParentContainer: {
        width: 158,
        backgroundColor: "red",
        justifyContent: "center"
    },
    airspeedContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginTop: -10,
        marginBottom: -10,
        left: 15,
    },
    performanceItemDescription: {
        paddingLeft: 15,
    },
    bankDescriptor: {
        paddingLeft: 15,
        top: -15,
    },
    analysisLine:{
        flexDirection: "row"
    },
   analysisIconSuccess:{
       color: "green",
       marginRight: 5,
   },
   analysisIconFail:{
    color: "red",
    marginRight: 5,
   },
       elevationContainer: {
        alignItems: "center",
        flexDirection: "row",
        marginTop: -22,
        marginBottom: 7,
    },
});

SteepTurnDisplay.propTypes = {
    targetAirspeed: PropTypes.number.isRequired,
    targetElevation: PropTypes.number.isRequired,
    rollInOutHeading: PropTypes.number.isRequired,
    headingProgress: PropTypes.number.isRequired,
    actualAirspeed: PropTypes.number.isRequired,
    actualElevation: PropTypes.number.isRequired,
    currentBank: PropTypes.number.isRequired,
}