/**
 * Displays a selectable container with information about a data provider (e.g. X-Plane). Displays
 * the provider name and an icon (gamepad if it is a simulator, gps/arrow icon in case of a real location
 * source). Can further indicate if this is the currently used data provider. By default, the container is
 * selectable and indicates that the provider has been selected if touched.
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { setDataProvider } from "../actions/actions";

function ProviderItem({ itemName, simulated, selectedProvider, disableTouch = false, currentItem = false }) {

    let displayTitle = itemName;

    if (currentItem) {
        displayTitle += " (current provider)";
    }
    return (
        <TouchableOpacity onPress={() => selectedProvider(itemName)} disabled={disableTouch | currentItem}>
            <View style={styles.overallContainer}>
                {simulated ? (
                    <FontAwesomeIcon icon={faGamepad} size={20} color="gray" style={styles.iconContainer} />
                ) : (
                        <FontAwesomeIcon icon={faLocationArrow} size={20} color="gray" style={styles.iconContainer} />
                    )}
                <Text>{displayTitle}</Text>
            </View>
        </TouchableOpacity>
    );
}

ProviderItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    simulated: PropTypes.bool.isRequired,
    selectedProvider: PropTypes.func.isRequired,
    disableTouch: PropTypes.bool,
    currentItem: PropTypes.bool,
};

const styles = StyleSheet.create({
    overallContainer: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5,
    },
    iconContainer: {
        marginRight: 10,
    }
});

function mapStateToProps(state, ownProps) {
    return {

    };
}

const mapDispatchToProps = dispatch => ({
    selectedProvider: dataProvider => dispatch(setDataProvider(dataProvider)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderItem);