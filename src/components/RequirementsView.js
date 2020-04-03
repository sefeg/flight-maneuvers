/**
 * Displays requiremetns that need to be fullfilled before a maneuver can be started.
 */

import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native';

export default function RequirementsView(props) {
    return (
        <View style={styles.rootContainer}>
            <Text style={styles.title}>Requirements</Text>
            <View style={styles.requirementsItemContainer}>
                <Image style={styles.statusIcon} source={require('../assets/icons/checkmark.png')} />
                <Text>Altitude >= 2.500 AGL</Text>
            </View>
            <View style={styles.requirementsItemContainer}>
                <Image style={styles.statusIcon} source={require('../assets/icons/fail.png')} />
                <Text>KIAS: 95 knots (+/- 5%)</Text>
            </View>
            <View style={styles.requirementsItemContainer}>
                <Image style={styles.statusIcon} source={require('../assets/icons/fail.png')} />
                <Text>2300 RPM (+/- 5%)</Text>
            </View>
            <Text style={styles.criteriaText}>Match the criteria before starting the maneuver.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
    },
    rootContainer: {
        marginTop: 20,
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 1,
        padding: 20,
        borderRadius: 5,
    },
    requirementsItemContainer: {
        flexDirection: 'row',
        alignItems: "center",
        paddingTop: 10
    },
    criteriaText: {
        paddingTop: 20,
    },
    statusIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    }
});

RequirementsView.propTypes = {};
