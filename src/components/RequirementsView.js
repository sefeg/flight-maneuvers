/**
 * Displays requiremetns that need to be fullfilled before a maneuver can be started.
 */

import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import PropTypes from "prop-types";

export default function RequirementsView(conditions) {


    return (
        < View style={styles.rootContainer} >
            <Text style={styles.title}>Requirements</Text>
            {
                conditions.conditions.map(condition => {
                    return (
                        <View style={styles.requirementsItemContainer}>
                            {condition.fulfilled ? (
                                <Image style={styles.statusIcon} source={require('../assets/icons/checkmark.png')} />
                            ) : (
                                    <Image style={styles.statusIcon} source={require('../assets/icons/fail.png')} />
                                )}
                            <Text>{condition.description}</Text>
                        </View>
                    )
                })
            }
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

RequirementsView.propTypes = {
    conditions: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string.isRequired,
            fulfilled: PropTypes.bool.isRequired,
        }).isRequired,
    ).isRequired,
};
