import React from "react";
import { View, TouchOpacity, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ManeuverEndStatus({ restartManeuver, maneuverSuccess }) {

    console.log("end status");
    console.log(maneuverSuccess);

    return (
        < View style={styles.container} >

            {
                maneuverSuccess ? (
                    <Text style={styles.question}>Maneuver ended successfully. Do you want to exercise it once more?</Text>
                ) : (
                        <Text style={styles.question}>Maneuver failed. Do you want to exercise it once more?</Text>
                    )
            }
            <TouchableOpacity onPress={() => restartManeuver()} >
                <FontAwesomeIcon icon={faRedo} size={45} color="gray" style={styles.redoButton} />
            </TouchableOpacity>
        </View >
    );
}

const styles = StyleSheet.create({

    container: {
        alignItems: "center",
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: "white"
    },
    redoButton: {
        marginTop: 4,
    },
    question: {
        fontWeight: "bold",
    }
});

ManeuverEndStatus.propTypes = {
    restartCurrentManeuver: PropTypes.func.isRequired,
    maneuverSuccess: PropTypes.bool.isRequired,
}