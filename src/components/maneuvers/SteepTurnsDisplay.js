import React from "react";
import { View, Text, StyleSheet, YellowBox } from "react-native";
import PropTypes from "prop-types";

import AirspeedIndicator from "../performance_indicators/AirspeedIndicator";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ElevationIndicator from "../performance_indicators/ElevationIndicator";
import BankIndicator from "../performance_indicators/BankIndicator";
import HeadingIndicator from "../performance_indicators/HeadingIndicator";

export default function SteepTurnDisplay({ targetAirspeed, targetElevation, rollInOutHeading, headingProgress, actualAirspeed, actualElevation, currentBank, meanAltitude }) {

    console.log(meanAltitude);

    return (
        < View style={styles.rootContainer} >
            <Text style={styles.title}>It's on! Turn performance recording...</Text>

            <View style={styles.performanceItemContainer}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 48 }}>
                        <HeadingIndicator
                            rollInOutHeading={rollInOutHeading}
                            progressInPercent={headingProgress}
                        />
                    </View>
                </View>
                <Text style={styles.performanceItemDescription}>Roll in/out heading: {rollInOutHeading}°</Text>
            </View>


            <View style={styles.airspeedRoot}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 15 }}>
                        <AirspeedIndicator targetAirspeed={targetAirspeed} actualAirspeed={actualAirspeed} />
                    </View>
                </View>
                <Text style={styles.performanceItemDescription}>Keep airspeed: {targetAirspeed} kts</Text>
            </View>

            <View style={styles.performanceItemContainer}>
                <ElevationIndicator
                    targetElevation={targetElevation}
                    actualElevation={actualElevation}
                    elevationLimits={100}
                />
                <Text style={styles.performanceItemDescription}>Keep altitude: {targetElevation} ft</Text>
            </View>


            <View style={styles.performanceItemContainer}>
                <View style={styles.indicatorParentContainer}>
                    <View style={{ left: 48 }}>
                        <BankIndicator
                            currentBank={currentBank}
                            targetBank={-45}
                        />
                    </View>
                </View>
                <Text style={styles.bankDescriptor}>Keep bank: 45°</Text>
            </View>
        </ View >
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
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
        top: -10,
        paddingLeft: 15,
    }
});

SteepTurnDisplay.propTypes = {
    targetAirspeed: PropTypes.number.isRequired,
    targetElevation: PropTypes.number.isRequired,
    rollInOutHeading: PropTypes.number.isRequired,
    headingProgress: PropTypes.number.isRequired,
    actualAirspeed: PropTypes.number.isRequired,
    actualElevation: PropTypes.number.isRequired,
    currentBank: PropTypes.number.isRequired,
    meanAltitude: PropTypes.number.isRequired,
}