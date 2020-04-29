import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ManeuverEngagementMessage(props) {

    return (
        <View style={styles.messageContainer}>
            <Text style={styles.engagementText}>{props.engagementMessage}</Text>
            <FontAwesomeIcon style={styles.gameIcon} icon={faGamepad} size={55} color="gray" style={styles.redoButton} />
        </View>
    );
}

const styles = StyleSheet.create({

    engagementText: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 15,
    },
    messageContainer: {
        alignItems: "center",
        marginTop: 5,
    },
    gameIcon: {
        paddingTop: 15,
    }

});

ManeuverEngagementMessage.propTypes = {

    engagementMessage: PropTypes.string.isRequired,
}